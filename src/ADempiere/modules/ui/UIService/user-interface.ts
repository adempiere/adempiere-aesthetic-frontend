// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import {
  IResourceReferenceParams,
  IAttachmentParams,
  IAttachmentData,
  convertAttachment
} from '@/ADempiere/modules/ui'
import {
  IResourceReferenceData,
  convertResourceReference
} from '@/ADempiere/modules/pos'

/**
 * Get Attachment
 * @param {number}  recordId
 * @param {string}  recordUuid // TODO: Add suppport to record uuid on backend
 */

export function requestResourceReference(
  data: IResourceReferenceParams
): Promise<IResourceReferenceData> {
  const { recordId, recordUuid } = data
  return requestRest({
    url: '/ui/resource-reference',
    method: 'get',
    params: {
      image_id: recordId,
      image_uuid: recordUuid
    }
  })
    .then(evaluateResponse)
    .then((response: any) => {
      return convertResourceReference(response)!
    })
}

/**
 * Get Attachment
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 */

export function requestAttachment(
  data: IAttachmentParams
): Promise<IAttachmentData> {
  const { tableName, recordUuid, recordId } = data
  return requestRest({
    url: '/ui/attachment',
    method: 'get',
    params: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid
    }
  })
    .then(evaluateResponse)
    .then((response: any) => {
      return convertAttachment(response)
    })
}
