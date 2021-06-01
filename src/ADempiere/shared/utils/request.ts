import requestAPI from '@/utils/request'
import { getConfig } from '@/ADempiere/shared/utils/config'
import { getToken } from '@/utils/cookies'
import { getLocale } from '@/lang'
import { AxiosRequestConfig } from 'axios'
import { IConfigData } from './types'

// Request with default parameters
const config: IConfigData = getConfig()
export function request(requestValues: AxiosRequestConfig): Promise<any> {
  if (!requestValues) {
    requestValues = {}
  }
  if (!requestValues.params) {
    requestValues.params = {}
  }
  requestValues.baseURL = config.adempiere.api.url
  // //  Timeout
  if (config.adempiere.api.timeout && config.adempiere.api.timeout > 0) {
    requestValues.timeout = config.adempiere.api.timeout
  }
  requestValues.params.token = getToken()
  requestValues.params.language = getLocale() || 'en_US'
  console.warn('send request')
  console.warn({
    ...requestValues
  })
  return new Promise((resolve, reject) => {
    requestAPI(requestValues)
      .then(response => {
        resolve(response)
      })
      .catch(response => {
        reject(response)
      })
  })
}
