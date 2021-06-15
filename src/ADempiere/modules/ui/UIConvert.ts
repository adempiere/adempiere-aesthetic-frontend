import { convertResourceReference } from '@/ADempiere/modules/pos'
import { IAttachmentData, ILookupItemData } from './UITypes'

import { IReferenceListData, IReferenceData } from '.'
import { camelizeObjectKeys } from '@/ADempiere/shared/utils/transformObject'

export const convertAttachment = (data: any): IAttachmentData => {
  const convertedAttachment = camelizeObjectKeys(data) as Partial<IAttachmentData>
  convertedAttachment.resourceReferences = data.resource_reference.map((e: any) => {
    return convertResourceReference(e)
  })
  return convertedAttachment as IAttachmentData
}

export function convertReferencesList(
  references: any
): IReferenceListData {
  const convertedReferences = camelizeObjectKeys(references)
  convertedReferences.list = references.records.map((record: any) => convertReference(record))
  delete convertedReferences.records
  return convertedReferences as IReferenceListData
}

export function convertReference(reference: any): IReferenceData {
  return camelizeObjectKeys(reference) as IReferenceData
}

export function convertLookupItem(item: any): ILookupItemData {
  return camelizeObjectKeys(item) as ILookupItemData
}
