import { camelizeObjectKeys } from '@/ADempiere/shared/utils/transformObject'
import { ISessionData, IRoleData, IMenuData } from '.'

export function convertSession(session: any): ISessionData {
  const convertedSession = camelizeObjectKeys(session) as Partial<ISessionData>
  convertedSession.role = convertRole(session.role)
  return convertedSession as ISessionData
}

export function convertRole(role: any): IRoleData {
  return camelizeObjectKeys(role) as IRoleData
}

export const convertMenu = (data: any): IMenuData => {
  return camelizeObjectKeys(data) as IMenuData
}
