import * as config from '@/../config/default.json'
import { IConfigData } from './types'

export function getConfig(): IConfigData {
  return config
}
