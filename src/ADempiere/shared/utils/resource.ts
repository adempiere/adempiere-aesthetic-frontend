import { getConfig } from '@/ADempiere/shared/utils/config'
import { IConfigData, ImagePathData, IRequestImageData } from './types'

export function getImagePath(data: IRequestImageData): ImagePathData {
  const { operation, width, height, file } = data
  const config: IConfigData = getConfig()
  const url: string =
        config.adempiere.images.url + config.adempiere.images.service
  const urn = `/img?action=${operation}&width=${width}&height=${height}&url=${file}`
  const uri = `${url}${urn}`

  return {
    url,
    urn,
    uri
  }
}
