import { request } from '@/ADempiere/shared/utils/request'
import {
  IRecordAccessDataExtended,
  IRecordAccessRoleData
} from '@/ADempiere/modules/privateAccess'
// Get Instance for connection

/**
 * List Rol Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {string}  sessionUuid
 */
export function getRecordAccess(data: {
  tableName: string
  recordId: number
  recordUuid: string
}): Promise<IRecordAccessDataExtended> {
  const { tableName, recordUuid, recordId } = data
  return new Promise(resolve => {
    request({
      url: '/ui/record-access',
      method: 'get',
      params: {
        table_name: tableName,
        id: recordId,
        uuid: recordUuid
      }
    }).then(respose => {
      resolve(convertRecordAccess(respose))
    })
  })
}

/**
 * Update Access Record
 * @param {string}  tableName
 * @param {number}  recordId
 * @param {string}  recordUuid
 * @param {array}  listRol
 */
export function setRecordAccess(data: {
  recordId: number
  recordUuid: string
  tableName: string
  recordAccesses: IRecordAccessRoleData[]
}) {
  const { recordId, recordUuid, tableName, recordAccesses } = data
  return request({
    url: '/ui/set-record-access',
    method: 'post',
    data: {
      table_name: tableName,
      id: recordId,
      uuid: recordUuid,
      record_accesses: recordAccesses.map((access: IRecordAccessRoleData) => {
        return {
          role_id: access.roleId,
          role_uuid: access.roleUuid,
          role_name: access.roleName,
          is_active: access.isActive,
          is_exclude: access.isExclude,
          is_read_only: access.isReadOnly,
          is_dependent_entities: access.isDependentEntities
        }
      })
    }
  }).then(response => {
    return response
  })
}

/**
 * Convert stub from request
 * @param {Record Access} recordAccess
 * @returns
 */

function convertRecordAccess(recordAccess: any): IRecordAccessDataExtended {
  return {
    tableName: recordAccess.table_name,
    id: recordAccess.id,
    uuid: recordAccess.uuid,
    availableRoles: recordAccess.available_roles.map((role: any) => {
      return convertRecordAccessRole(role)
    }),
    currentRoles: recordAccess.current_roles.map((role: any) => {
      return convertRecordAccessRole(role)
    })
  }
}

/**
 * Convert role definition
 */
function convertRecordAccessRole(
  recordAccessRole: any
): IRecordAccessRoleData | undefined {
  if (recordAccessRole) {
    return {
      roleId: recordAccessRole.role_id,
      roleUuid: recordAccessRole.role_uuid,
      roleName: recordAccessRole.role_name,
      isActive: recordAccessRole.is_active,
      isExclude: recordAccessRole.is_exclude,
      isReadOnly: recordAccessRole.is_read_only,
      isDependentEntities: recordAccessRole.is_dependent_entities
    }
  }
  return undefined
}
