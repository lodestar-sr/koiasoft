import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const apiConfig = {
  returnRejectedPromiseOnError: true,
  timeout: 30000,
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const api = axios.create(apiConfig);

/**
 *
 * @template T - type.
 * @param {AxiosResponse<T>} response - axios response.
 * @returns {T} - expected object.
 */
const success = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

const error = (err: AxiosError<Error>): AxiosError<Error> => {
  if (err.response?.status === 401 || err.response?.status === 403) {
  }

  throw err;
};

/**
 * HTTP POST method `statusCode`: 201 Created.
 *
 * @access public
 * @template T - `TYPE`: expected object.
 * @template B - `BODY`: body request object.
 * @param {string} url - endpoint you want to reach.
 * @param {B} data - payload to be send as the `request body`,
 * @param {AxiosRequestConfig} [config] - axios request configuration.
 * @returns {Promise<T>} - HTTP [axios] response payload.
 */
export const post = <T, B>(
  url: string,
  data?: B,
  config?: AxiosRequestConfig
): Promise<T> => {
  return api.post(url, data, config).then(success).catch(error);
};
