import {
  IEntityData,
  requestCreateEntity,
  requestGetEntity,
  requestUpdateEntity
} from '@/ADempiere/modules/persistence'
import {
  ICreateLocationAddressParams,
  IGetLocationAddressParams,
  IUpdateLocationAddressParams
} from '@/ADempiere/modules/field'

const tableName = 'C_Location'

export function createLocationAddress(
  data: ICreateLocationAddressParams
): Promise<IEntityData> {
  const { attributesList } = data
  return requestCreateEntity({
    tableName,
    attributesList
  })
}

export function getLocationAddress(
  data: IGetLocationAddressParams
): Promise<IEntityData> {
  const { id, uuid } = data

  return requestGetEntity({
    tableName,
    id,
    uuid: uuid!
  })
}

export function updateLocationAddress(
  data: IUpdateLocationAddressParams
): Promise<IEntityData> {
  const { id, uuid, attributesList } = data

  return requestUpdateEntity({
    tableName,
    id,
    uuid: uuid!,
    attributes: attributesList
  })
}
