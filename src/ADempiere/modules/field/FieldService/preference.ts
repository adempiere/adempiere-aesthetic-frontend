import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IValueData } from '../../core'
import { KeyValueData } from '../../persistence'

export const getPreference = (data: {
  parentUuid: string
  containerUuid: string
  panelType: PanelContextType
  attribute: IValueData
  value: any
  level: KeyValueData[]
}): any => {
  const { parentUuid, containerUuid, panelType, attribute, value, level } = data
  return getPreference({
    parentUuid,
    containerUuid,
    panelType,
    attribute,
    value,
    level
  })
}

export const updatePreference = (data: {
  parentUuid: string
  containerUuid: string
  panelType: PanelContextType
  attribute: IValueData
  value: any
  level: string
}): any => {
  const { parentUuid, containerUuid, panelType, attribute, value, level } = data
  return updatePreference({
    parentUuid,
    containerUuid,
    panelType,
    attribute,
    value,
    level
  })
}
