import * as config from '@/../config/default.json'
import { IConfigData } from './types'

export function getConfig(): IConfigData {
  return {
    adempiere: {
      api: {
        service: JSON.stringify(config.adempiere.api.service).replace(/['"]+/g, ''),
        url: JSON.stringify(config.adempiere.api.url).replace(/['"]+/g, '')
      },
      images: {
        service: JSON.stringify(config.adempiere.images.service).replace(/['"]+/g, ''),
        url: JSON.stringify(config.adempiere.images.url).replace(/['"]+/g, '')
      }
    },
    server: {
      host: JSON.stringify(config.server.host).replace(/['"]+/g, ''),
      port: Number(JSON.stringify(config.server.port).replace(/['"]+/g, ''))
    }
  }
  // return <IConfigData>JSON.stringify(config)
}
