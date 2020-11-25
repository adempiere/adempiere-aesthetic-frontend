import { getConfig } from '@/ADempiere/shared/utils/config'
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosPromise
} from 'axios'
import { getLanguage, getToken } from '@/utils/cookies'
import { ADempiereResponse } from './types'
import { IConfigData } from '../utils/types'

export function ApiRest(requestConfig: AxiosRequestConfig): AxiosPromise<any> {
  const setInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.response.use(
      response => {
        return response.data
      },
      error => {
        return Promise.reject(error)
      }
    )
    return instance.interceptors
  }

  const config: IConfigData = getConfig()
  const { adempiere } = config
  const { api } = adempiere
  const apiRestAddress = 'http://localhost:8085/adempiere-api '
  // config.adempiere.api.url + config.adempiere.api.service
  const instance: AxiosInstance = axios.create({
    baseURL: apiRestAddress,
    headers: {
      'Content-Type': 'application/json charset=UTF-8'
    },
    responseType: requestConfig.responseType
  })
  instance.interceptors = setInterceptor(instance)
  const language = getLanguage || 'en_US'
  requestConfig.params = {
    token: getToken(),
    language,
    ...requestConfig.params
  }
  return instance(requestConfig)
}

export const evaluateResponse = (
  response: AxiosResponse<ADempiereResponse>
): Promise<any> => {
  const { code, result } = response.data

  if (code >= 400) {
    const error: { code: number, message: string } = {
      code,
      message: result
    }
    throw error
  }

  return result
}
