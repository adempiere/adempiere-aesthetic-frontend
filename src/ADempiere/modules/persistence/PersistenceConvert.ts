import { IEntityListData, IEntityData, ITranslationData } from '.'
import { IValueData } from '../core'
import { KeyValueData } from './PersistenceType'

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
    attributes: <KeyValueData<IValueData>[]>entityToConvert.attributes
    // attributes: convertArrayKeyValueToObject({
    //   array: entityToConvert.attributes,
    //   keyName: 'key'
    // })
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
