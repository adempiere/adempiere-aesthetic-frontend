// Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import {
  convertRole,
  convertSession
} from '@/ADempiere/modules/user/UserConvert'
import { IRoleData, ISessionData } from '../UserType'

export function requestRolesList(token: string): Promise<IRoleData[]> {
  return requestRest({
    url: 'user/roles',
    method: 'get',
    params: {
      token
    }
  })
    .then(evaluateResponse)
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
  return requestRest({
    url: 'user/change-role',
    method: 'post',
    data: {
      role: roleUuid,
      organization: organizationUuid,
      warehouse: warehouseUuid
    }
  })
    .then(evaluateResponse)
    .then(responseChangeRole => {
      return convertSession(responseChangeRole)
    })
}
