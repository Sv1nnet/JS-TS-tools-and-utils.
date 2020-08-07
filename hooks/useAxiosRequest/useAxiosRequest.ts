import { useState, useCallback } from 'react';
import axios, { AxiosResponse, AxiosRequestConfig, AxiosPromise, AxiosError } from 'axios';

export type TState = {
  loading: boolean,
  success: {
    status: number,
    statusText: string | null | undefined,
  } | null,
  error: {
    status: number,
    statusText: string | null | undefined,
    message: string | null | undefined,
  } | null,
  data: any,
  response: any,
}

type TSuccessHandler = (res: AxiosResponse) => AxiosResponse;
type TErrorHandler = (err: AxiosError) => Promise<AxiosError | AxiosResponse>;

export type TMakeRequest = (options: AxiosRequestConfig) => AxiosPromise | Promise<AxiosError | AxiosResponse>;
export type THookResult = [TState, TMakeRequest];
export type TUseAxiosRequest = () => THookResult;
/**
 * Provides an array that contains request status and data, and function to make request.
 */
const useAxiosRequest: TUseAxiosRequest = () => {
  const [state, setState] = useState<TState>({
    loading: false,
    success: null,
    error: null,
    data: undefined,
    response: null,
  });

  const successHandler: TSuccessHandler = useCallback((res) => {
    setState({
      loading: false,
      success: res.status >= 200 && res.status < 300
        ? {
          status: res.status,
          statusText: res.statusText,
        }
        : null,
      error: null,
      data: res.data,
      response: res,
    });

    return res;
  }, []);

  const errorHandler: TErrorHandler = useCallback((err) => {
    const isNetworkError = err.message === 'Network Error';
    setState({
      loading: false,
      success: null,
      error: {
        message: isNetworkError ? 'Service Unavailable' : err.response.data,
        status: isNetworkError ? 503 : err.response.status,
        statusText: isNetworkError ? 'Service Unavailable' : err.response.statusText,
      },
      data: isNetworkError ? {} : err.response.data,
      response: err.response,
    });
    return Promise.reject(isNetworkError ? err : err.response);
  }, []);

  const makeRequest: TMakeRequest = useCallback((options) => {
    let request: AxiosPromise | Promise<AxiosError | AxiosResponse>;
    if (typeof options === 'string') {
      request = axios.get(options).then(successHandler).catch(errorHandler);
    } else if (typeof options === 'object' && !Array.isArray(options) && options !== null) {
      request = axios(options).then(successHandler).catch(errorHandler);
    } else {
      throw new TypeError('Wrong type of argument');
    }

    setState((prevState) => ({
      loading: true,
      success: null,
      error: null,
      data: prevState.data,
      response: prevState.response,
    }));

    return request;
  }, []);

  return [
    state,
    makeRequest,
  ];
};

export default useAxiosRequest;
