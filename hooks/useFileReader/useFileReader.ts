import { useCallback, useEffect, useMemo, useState } from "react";

export type EventListeners = {
  onAbort?: (e: ProgressEvent<FileReader>) => void;
  onError?: (e: ProgressEvent<FileReader>) => void;
  onLoad?: (e: ProgressEvent<FileReader>) => void;
  onLoadEnd?: (e: ProgressEvent<FileReader>) => void;
  onLoadStart?: (e: ProgressEvent<FileReader>) => void;
  onProgress?: (e: ProgressEvent<FileReader>) => void;
};

const addEventListeners = (
  reader: FileReader,
  { onAbort, onError, onLoad, onLoadEnd, onLoadStart, onProgress }: EventListeners
) => {
  if (onAbort) reader.addEventListener("abort", onAbort);
  if (onError) reader.addEventListener("error", onError);
  if (onLoad) reader.addEventListener("load", onLoad);
  if (onLoadEnd) reader.addEventListener("loadend", onLoadEnd);
  if (onLoadStart) reader.addEventListener("loadstart", onLoadStart);
  if (onProgress) reader.addEventListener("progress", onProgress);
};

const removeEventListeners = (
  reader: FileReader,
  { onAbort, onError, onLoad, onLoadEnd, onLoadStart, onProgress }: EventListeners
) => {
  if (onAbort) reader.removeEventListener("abort", onAbort);
  if (onError) reader.removeEventListener("error", onError);
  if (onLoad) reader.removeEventListener("load", onLoad);
  if (onLoadEnd) reader.removeEventListener("loadend", onLoadEnd);
  if (onLoadStart) reader.removeEventListener("loadstart", onLoadStart);
  if (onProgress) reader.removeEventListener("progress", onProgress);
};

const createReaderPromise = (
  reader: FileReader,
  setResult?: (result: string | ArrayBuffer | null) => void
) => {
  const abortController = new AbortController();

  const promise = new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    reader.addEventListener("load", () => resolve(reader.result), {
      signal: abortController.signal
    });
    reader.addEventListener("error", () => reject(reader.error), {
      signal: abortController.signal
    });
  });

  promise.then((result) => {
    setResult?.(result);
    abortController.abort();
    return result;
  });

  return { promise, abortController };
};

type ReadResultType<T> = T extends "dataURL" | "text"
  ? string
  : T extends "arrayBuffer"
  ? ArrayBuffer
  : string;

export type Result = string | ArrayBuffer | null;

const useFileReader = ({
  onAbort,
  onError,
  onLoad,
  onLoadEnd,
  onLoadStart,
  onProgress
}: {
  onAbort?: (e: ProgressEvent<FileReader>) => void;
  onError?: (e: ProgressEvent<FileReader>) => void;
  onLoad?: (e: ProgressEvent<FileReader>) => void;
  onLoadEnd?: (e: ProgressEvent<FileReader>) => void;
  onLoadStart?: (e: ProgressEvent<FileReader>) => void;
  onProgress?: (e: ProgressEvent<FileReader>) => void;
} = {}) => {
  const [reader, setReader] = useState(() => {
    const newReader = new FileReader();
    newReader.addEventListener("progress", () => setReadyState(newReader.readyState));

    addEventListeners(newReader, { onAbort, onError, onLoad, onLoadEnd, onLoadStart, onProgress });
    return newReader;
  });
  const [result, setResult] = useState<Result | Result[]>(null);
  const [readyState, setReadyState] = useState(reader.readyState);

  const createNewReader = useCallback(
    ({
      shouldAbortCurrentReader = true,
      shouldResetResult = true
    }: { shouldAbortCurrentReader?: boolean; shouldResetResult?: boolean } = {}) => {
      if (shouldAbortCurrentReader) reader.abort();

      const newReader = new FileReader();
      newReader.addEventListener("progress", () => setReadyState(newReader.readyState));

      if (shouldResetResult) setResult(null);

      setReader(newReader);
      setReadyState(newReader.readyState);

      addEventListeners(newReader, {
        onAbort,
        onError,
        onLoad,
        onLoadEnd,
        onLoadStart,
        onProgress
      });
      return newReader;
    },
    [onAbort, onError, onLoad, onLoadEnd, onLoadStart, onProgress]
  );

  const readAsDataURL = useCallback(
    (file: File, { skipSetResult = false }: { skipSetResult?: boolean } = {}) => {
      const { promise } = createReaderPromise(reader, skipSetResult ? undefined : setResult);

      reader.readAsDataURL(file);

      return promise as Promise<string>;
    },
    [reader]
  );

  const readAsArrayBuffer = useCallback(
    (file: File, { skipSetResult = false }: { skipSetResult?: boolean } = {}) => {
      const { promise } = createReaderPromise(reader, skipSetResult ? undefined : setResult);

      reader.readAsArrayBuffer(file);

      return promise as Promise<ArrayBuffer>;
    },
    [reader]
  );

  const readAsText = useCallback(
    (file: File, { skipSetResult = false }: { skipSetResult?: boolean } = {}) => {
      const { promise } = createReaderPromise(reader, skipSetResult ? undefined : setResult);

      reader.readAsText(file);

      return promise as Promise<string>;
    },
    [reader]
  );

  const readMultiple = useCallback(
    async <T extends "dataURL" | "arrayBuffer" | "text" = "dataURL">(
      fileList: FileList | File[],
      { type }: { type: T }
    ) => {
      const files = Array.from(fileList);
      const readFn =
        type === "dataURL"
          ? readAsDataURL
          : type === "arrayBuffer"
          ? readAsArrayBuffer
          : type === "text"
          ? readAsText
          : readAsDataURL;

      const result: ReadResultType<T>[] = [];

      for await (const file of files) {
        result.push((await readFn(file, { skipSetResult: true })) as ReadResultType<T>);
      }

      setResult(result);
      return result;
    },
    [readAsDataURL, readAsArrayBuffer, readAsText]
  );

  const abort = useCallback(() => reader.abort(), [reader]);

  const reset = useCallback(() => {
    setResult(null);
    createNewReader();
  }, []);

  useEffect(() => {
    addEventListeners(reader, { onAbort, onError, onLoad, onLoadEnd, onLoadStart, onProgress });

    return () =>
      removeEventListeners(reader, {
        onAbort,
        onError,
        onLoad,
        onLoadEnd,
        onLoadStart,
        onProgress
      });
  }, [onAbort, onError, onLoad, onLoadEnd, onLoadStart, onProgress]);

  return useMemo(
    () => ({
      reader,
      result,
      readyState,
      reset,
      createNewReader,
      readAsDataURL,
      readAsArrayBuffer,
      readAsText,
      readMultiple,
      abort
    }),
    [
      reader,
      result,
      readyState,
      reset,
      createNewReader,
      readAsDataURL,
      readAsArrayBuffer,
      readAsText,
      readMultiple,
      abort
    ]
  );
};

export default useFileReader;