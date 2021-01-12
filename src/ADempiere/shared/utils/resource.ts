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

// Build a base 64 image from array
export function buildImageFromArray(params: {
  contentType?: string
  bytesArray: Uint8Array
}): string {
  const { bytesArray, contentType = params.contentType || 'image/*' } = params
  const binary = bytesArray.reduce((data, byte) => {
    return data + String.fromCharCode(byte)
  }, '')
  const b64encoded = btoa(binary)
  const buffer = 'data:' + contentType + ';base64,' + b64encoded
  return buffer
}

/**
 * Build a base 64 image from arrayBuffer
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author elsiosanchez <Elsiosanches@gmail.com>
 * @param {array} arrayBuffer
 * @param {string} contentType
 * @returns {string} image as base64 encoded
 */
export function buildImageFromArrayBuffer(params: {
  arrayBuffer: any[]
  contentType?: string
}): string {
  const { arrayBuffer, contentType = params.contentType || 'image/*' } = params
  const bytesArray = new Uint8Array(arrayBuffer)
  return buildImageFromArray({
    bytesArray,
    contentType
  })
}
