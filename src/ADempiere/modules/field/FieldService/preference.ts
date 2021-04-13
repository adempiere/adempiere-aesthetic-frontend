import { IValueData } from '../../core'
import { request } from '@/ADempiere/shared/utils/request'

export const setPreference = (data: {
  parentUuid: string
  attribute: IValueData
  value: any
  isForCurrentUser: IValueData
  isForCurrentClient: IValueData
  isForCurrentOrganization: IValueData
  isForCurrentContainer: IValueData
}): any => {
  const { parentUuid, attribute, value, isForCurrentClient, isForCurrentContainer, isForCurrentOrganization, isForCurrentUser } = data
  return request({
    url: '/ui/set-preference',
    method: 'POST',
    data: {
      container_uuid: parentUuid,
      column_name: attribute,
      value: value,
      is_for_current_user: isForCurrentUser,
      is_for_current_client: isForCurrentClient,
      is_for_current_organization: isForCurrentOrganization,
      is_for_current_container: isForCurrentContainer
    }
  })
}

export const deletePreference = (data: {
  parentUuid: string
  attribute: IValueData
  isForCurrentUser: IValueData
  isForCurrentClient: IValueData
  isForCurrentOrganization: IValueData
  isForCurrentContainer: IValueData
}) :Promise<any> => {
  const { parentUuid, attribute, isForCurrentClient, isForCurrentContainer, isForCurrentOrganization, isForCurrentUser } = data
  return request({
    url: '/ui/delete-preference',
    method: 'POST',
    data: {
      container_uuid: parentUuid,
      column_name: attribute,
      is_for_current_user: isForCurrentUser,
      is_for_current_client: isForCurrentClient,
      is_for_current_organization: isForCurrentOrganization,
      is_for_current_container: isForCurrentContainer
    }
  })
}
