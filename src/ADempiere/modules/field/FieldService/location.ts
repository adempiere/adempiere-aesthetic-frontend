import {
  IEntityData,
  requestCreateEntity,
  requestGetEntity,
  requestUpdateEntity
} from '@/ADempiere/modules/persistence';
import {
  ICreateLocationAddressParams,
  IGetLocationAddressParams,
  IUpdateLocationAddressParams
} from '@/ADempiere/modules/field';

const tableName = 'C_Location';

export function requestCreateLocationAddress(
  data: ICreateLocationAddressParams
): Promise<IEntityData> {
  const { attributesList } = data;
  return requestCreateEntity({
    tableName,
    attributesList
  });
}

export function requestGetLocationAddress(
  data: IGetLocationAddressParams
): Promise<IEntityData> {
  const { id, uuid } = data;

  return requestGetEntity({
    tableName,
    id,
    uuid
  });
}

export function requestUpdateLocationAddress(
  data: IUpdateLocationAddressParams
): Promise<IEntityData> {
  const { id, uuid, attributesList } = data;

  return requestUpdateEntity({
    tableName,
    id,
    uuid,
    attributes: attributesList
  });
}
