import { camelizeObjectKeys } from '@/ADempiere/shared/utils/transformObject'
import { IEntityListData, IEntityData, ITranslationData } from '.'
import { IValueData } from '../core'
import { KeyValueData } from './PersistenceType'

export function convertEntityList(entityList: any): IEntityListData {
  const convertedEntityList = camelizeObjectKeys(entityList)
  convertedEntityList.recordsList = entityList.records.map((record: any) => convertEntity(record))
  delete convertedEntityList.records
  return convertedEntityList as IEntityListData
}

export function convertEntity(entity: any): IEntityData {
  const convertedEntity = camelizeObjectKeys(entity)
  convertedEntity.attributes = <KeyValueData<IValueData>[]>entity.atttributes
  return convertedEntity as IEntityData
}

export function convertTranslation(
  translation: any
): ITranslationData {
  return camelizeObjectKeys(translation) as ITranslationData
}
