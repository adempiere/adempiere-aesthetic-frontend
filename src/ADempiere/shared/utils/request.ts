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
  requestValues.params.token = getToken()
  requestValues.params.language = getLocale() || 'en_US'
  return new Promise(resolve => {
    requestAPI(requestValues).then(response => {
      resolve(response)
    })
  })
}
