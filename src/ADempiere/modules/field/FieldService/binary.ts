import {
  requestGetEntity,
  requestUpdateEntity
} from '@/ADempiere/modules/persistence/PersistenceService'
import { IValueData } from '../../core'
import { IEntityData, KeyValueData } from '../../persistence'

/**
 * Get entity with binary by identifier
 * @param {string} tableName
 * @param {string} recordUuid
 */
export function getResource(params: {
  uuid: string
  tableName: string
}): Promise<IEntityData> {
  const { uuid, tableName } = params

  return requestGetEntity({
    uuid: uuid,
    tableName
  })
}

/**
 * Update an existing binary by id or uuid
 * @param {string} tableName
 * @param {string} recordUuid
 * @param {KeyValueData<IValueData>[]} binaryFile
 */
export function updateResource(params: {
  uuid: string
  tableName: string
  binaryFile: KeyValueData<IValueData>[]
}): Promise<IEntityData> {
  const { uuid, tableName, binaryFile } = params
  return requestUpdateEntity({
    uuid,
    tableName,
    attributes: binaryFile
  })
}
