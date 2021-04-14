// Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import {
  convertRole,
  convertSession
} from '@/ADempiere/modules/user/UserConvert'
import { IRoleData, ISessionData } from '../UserType'

export function requestRolesList(token: string): Promise<IRoleData[]> {
  return request({
    url: 'user/roles',
    method: 'get',
    params: {
      token
    }
  })
    .then(responseRoles => {
      const rolesList: IRoleData[] = responseRoles.map(
        (itemRole: any) => {
          return convertRole(itemRole)
        }
      )

      return rolesList
    })
}

/**
 * Change role of access
 * @param {string} roleUuid
 * @param {string} organizationUuid
 * @param {string} warehouseUuid
 */
export function requestChangeRole(params: {
    roleUuid: string
    organizationUuid: string
    warehouseUuid?: string
}): Promise<ISessionData> {
  const { roleUuid, warehouseUuid, organizationUuid } = params
  return request({
    url: 'user/change-role',
    method: 'post',
    data: {
      role: roleUuid,
      organization: organizationUuid,
      warehouse: warehouseUuid
    }
  })
    .then(responseChangeRole => {
      return convertSession(responseChangeRole)
    })
}
