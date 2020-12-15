import { convertResourceReference } from '@/ADempiere/modules/pos'
import { IAttachmentData } from './UITypes'

import { IReferenceListData, IReferenceData } from '.'

export const convertAttachment = (data: any): IAttachmentData => {
  const { title } = data
  return {
    attachmentUuid: data.attachment_uuid,
    title,
    textMsg: data.text_msg,
    resourceReferences: data.resource_reference.map((e: any) => {
      return convertResourceReference(e)
    })
  }
}

export function convertReferencesList(
  listReferencesToConvert: any
): IReferenceListData {
  return {
    recordCount: listReferencesToConvert.record_count,
    list: listReferencesToConvert.records.map((record: any) => {
      return convertReference(record)
    }),
    nextPageToken: listReferencesToConvert.next_page_token
  }
}

export function convertReference(referenceToConvert: any): IReferenceData {
  const { uuid } = referenceToConvert

  return {
    uuid,
    tableName: referenceToConvert.table_name,
    windowUuid: referenceToConvert.window_uuid,
    displayName: referenceToConvert.display_name,
    whereClause: referenceToConvert.where_clause,
    recordCount: referenceToConvert.record_count
  }
}
