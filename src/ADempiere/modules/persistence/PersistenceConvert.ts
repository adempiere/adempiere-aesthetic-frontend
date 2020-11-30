import { convertArrayKeyValueToObject } from '@/ADempiere/shared/utils/valueFormat'
import { IEntityListData, IEntityData, ITranslationData } from '.'

export function convertEntityList(entityListToConvert: any): IEntityListData {
  return {
    nextPageToken: entityListToConvert.next_page_token,
    recordCount: entityListToConvert.record_count,
    recordsList: entityListToConvert.records.map((record: any) => {
      return convertEntity(record)
    })
  }
}

export function convertEntity(entityToConvert: any): IEntityData {
  return {
    id: entityToConvert.id,
    uuid: entityToConvert.uuid,
    tableName: entityToConvert.table_name,
    attributes: convertArrayKeyValueToObject({
      array: entityToConvert.attributes,
      keyName: 'key'
    })
  }
}

export function convertTranslation(
  translationToConvert: any
): ITranslationData {
  return {
    language: translationToConvert.language,
    uuid: translationToConvert.uuid,
    values: translationToConvert.values
  }
}
