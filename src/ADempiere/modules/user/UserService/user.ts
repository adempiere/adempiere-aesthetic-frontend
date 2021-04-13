// Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import {
  IMenuData,
  IMenuParams,
  ISessionData,
  IUserInfoData,
  ILoginParams
} from '../UserType'
import { convertMenu, convertSession } from '@/ADempiere/modules/user'

/**
 * Make login by UserName and password, this function can return user data for show
 * @param {string} userName
 * @param {string} password
 */

export function login(data: ILoginParams) {
  const { userName, password, token, roleUuid, organizationUuid } = data
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username: userName,
      password,
      role_uuid: roleUuid,
      organization_uuid: organizationUuid,
      token
    }
  })
}

/**
 * Get User Info
 * @param {string} token or session UUID
 */

export function requestUserInfoFromSession(
  token: string
): Promise<IUserInfoData> {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
    .then((response: IUserInfoData) => {
      return response
    })
}

/**
 * Get session info
 * @param {string} token or session UUID
 */
export function requestSessionInfo(token: string): Promise<ISessionData> {
  return request({
    url: '/user/session',
    method: 'get',
    params: {
      token
    }
  })
    .then(responseSession => {
      const session = convertSession(responseSession)
      return session
    })
}

/**
 * Logout from server
 * @param {string} token or session UUID
 */
export function logout(token: string): Promise<any> {
  return request({
    url: '/user/logout',
    method: 'POST',
    data: {
      token
    }
  })
}

/**
 * Get User menu from server
 * @param {string} sessionUuid
 */
export function requestMenu(data: IMenuParams): Promise<IMenuData> {
  const { sessionUuid } = data
  return request({
    url: '/user/menu',
    method: 'get',
    params: {
      token: sessionUuid
    }
  })
    .then(response => {
      return convertMenu(response)
    })
}
