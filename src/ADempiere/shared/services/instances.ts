import { getConfig } from '@/ADempiere/shared/utils/config';
import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { getLanguage, getToken } from '@/utils/cookies';

export function ApiRest(requestConfig: AxiosRequestConfig) {
  const setInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.response.use(
      response => {
        return response.data;
      },
      error => {
        return Promise.reject(error);
      }
    );
    return instance.interceptors;
  };

  const config: IConfigData = getConfig();
  const apiRestAddress: string =
    config.adempiere.api.url + config.adempiere.api.service;
  const instance: AxiosInstance = axios.create({
    baseURL: apiRestAddress,
    headers: {
      'Content-Type': 'application/json charset=UTF-8'
    },
    responseType: requestConfig.responseType
  });
  instance.interceptors = setInterceptor(instance);
  const language = getLanguage || 'en_US';
  requestConfig.params = {
    token: getToken(),
    language,
    ...requestConfig.params
  };
  return instance(requestConfig);
}

export const evaluateResponse = (response: AxiosResponse): Promise<any> => {
  if (response.status >= 400) {
    const error = {
      code: response.status,
      message: response.data
    };
    throw error;
  }

  return response.data;
};
