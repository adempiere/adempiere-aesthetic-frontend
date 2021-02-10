import { getConfig } from '@/ADempiere/shared/utils/config'
import axios, {
  AxiosRequestConfig,
  AxiosInstance
} from 'axios'
import { getLanguage, getToken } from '@/utils/cookies'
import { IConfigData } from '../utils/types'

export function ApiRest(requestConfig: AxiosRequestConfig): Promise<any> {
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
  const apiRestAddress = config.adempiere.api.fullPath
  const instance: AxiosInstance = axios.create({
    baseURL: apiRestAddress,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    responseType: requestConfig.responseType
  })
  instance.interceptors = setInterceptor(instance)
  const language = getLanguage() || 'en_US'

  requestConfig.method = requestConfig.method || 'post'
  requestConfig.data = requestConfig.data || {}
  requestConfig.responseType = requestConfig.responseType || 'json'
  requestConfig.params = {
    ...requestConfig.params,
    token: getToken(),
    language: language
  }

  return instance(requestConfig)
}

export const evaluateResponse = (response: any): Promise<any> => {
  const { code, result } = response
  if (code >= 400) {
    const error: { code: number, message: string } = {
      code: code,
      message: result
    }
    throw error
  }

  return response.result
}
