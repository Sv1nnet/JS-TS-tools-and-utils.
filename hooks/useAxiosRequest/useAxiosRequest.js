import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Provides an array that contains request status and data, and function to make request.
 * @returns {[
 *  {
 *   loading: boolean,
 *   success: null | { status: number, statusText: string },
 *   error: null | { message: string | undefined, status: number, statusText: string },
 *   data: any,
 *   response: any
 *  },
 *  Function
 * ]}
 */
const useAxiosRequest = () => {
  const [state, setState] = useState({
    loading: false,
    success: null,
    error: null,
    data: undefined,
    response: null,
  });

  const successHandler = (res) => {
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
  };

  const errorHandler = (err) => {
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
    return isNetworkError ? err : err.response;
  };

  const makeRequest = useCallback((options) => {
    let request;
    if (typeof options === 'string') {
      request = axios.get(options).then(successHandler).catch(errorHandler);
    } else if (typeof options === 'object' && !Array.isArray(options) && options !== null) {
      request = axios(options).then(successHandler).catch(errorHandler);
    } else {
      throw new TypeError('Wrong type of argument');
    }

    setState((prevState) => ({
      loading: true,
      error: null,
      success: null,
      data: prevState.data,
    }));

    return request;
  }, []);

  return [
    state,
    makeRequest,
  ];
};

export default useAxiosRequest;
