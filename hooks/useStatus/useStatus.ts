import { useState, useCallback } from 'react';

export type TStatus = {
  loading: boolean,
  err: {
    statusCode: number | null,
    message: string | null,
  },
  success: {
    statusCode: number | null,
    message: string | null,
    data: any,
  },
};

const defaultStatus: TStatus = {
  loading: false,
  err: {
    statusCode: null,
    message: null,
  },
  success: {
    statusCode: null,
    message: null,
    data: null,
  },
};


type TResponseDataProp = string | null | undefined;
type TResponseNumberProp = number | null | undefined;

export type TSetStatus = React.Dispatch<React.SetStateAction<TStatus>>;
export type TSetStatusLoading = () => void;
export type TResetStatus = () => void;
export type THandleSuccess = (res: {
  status: TResponseNumberProp,
  data: {
    message: TResponseDataProp,
    [key: string]: any,
  },
}) => void;
export type THandleError = (err: {
  status: TResponseNumberProp,
  message: TResponseDataProp,
}) => void;

export type TUseStatus = (initialState: TStatus) => {
  status: TStatus,
  setStatus: TSetStatus,
  setStatusLoading: TSetStatusLoading,
  resetStatus: TResetStatus,
  handleSuccess: THandleSuccess,
  handleError: THandleError,
};

const useStatus: TUseStatus = (initialStatus: TStatus = {
  ...defaultStatus,
  err: { ...defaultStatus.err },
  success: { ...defaultStatus.success },
}) => {
  const [status, setStatus] = useState(initialStatus);

  /**
   * Set status.lading as true.
   */
  const setStatusLoading: TSetStatusLoading = useCallback(() => {
    setStatus(prevStatus => ({ ...prevStatus, loading: true }));
  }, []);

  /**
   * Handle success response from a server. It sets status.loading as false,
   * status.err.statusCode and status.err.message as null.
   * status.success changes listied in types.
   * @param {Object} res response object
   * @param {number} res.status response object
   * @param {string} res.message response object
   * @param {any} res.data response object
   * @return res argument.
   */
  const handleSuccess: THandleSuccess = useCallback((res) => {
    setStatus({
      loading: false,
      err: {
        statusCode: null,
        message: null,
      },
      success: {
        statusCode: res.status,
        message: res.data.message,
        data: res.data,
      },
    });

    return res;
  }, []);

  /**
   * Handle error response from a server. It sets status.loading as false,
   * status.success.statusCode, status.success.message and status.success.data as null.
   * status.err changes listied in types.
   * @param {Object} err response object
   * @param {number} err.status response object
   * @param {string} err.message response object
   * @return Promise.reject(err).
   */
  const handleError: THandleError = useCallback((err) => {
    setStatus({
      loading: false,
      err: {
        statusCode: err.status,
        message: err.message,
      },
      success: {
        statusCode: null,
        message: null,
        data: null,
      },
    });

    return Promise.reject(err);
  }, []);

  /**
   * Set all status props as null and loading as false.
   */
  const resetStatus: TResetStatus = useCallback(() => {
    setStatus({
      ...defaultStatus,
      err: { ...defaultStatus.err },
      success: { ...defaultStatus.success },
    });
  }, []);

  return {
    status,
    setStatus,
    setStatusLoading,
    resetStatus,
    handleSuccess,
    handleError,
  };
};

export default useStatus;
