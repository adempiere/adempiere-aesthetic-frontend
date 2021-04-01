import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IValueData } from '../../core'
import { ApiRest as serviceApi } from '@/ADempiere/shared/services/instances'

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
  return serviceApi({
    url: '/ui/set-preference',
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
  return serviceApi({
    url: '/ui/delete-preference',
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
