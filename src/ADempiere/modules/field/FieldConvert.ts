import { convertContextInfo } from '@/ADempiere/modules/core'
import { camelizeObjectKeys, renameObjectKey } from '@/ADempiere/shared/utils/transformObject'
import {
  IFieldConditionData,
  IFieldData,
  IFieldDefinitionData,
  IFieldGroupData,
  IReferenceData,
  IZoomWindowData
} from '.'

export function convertField(field: any): IFieldData {
  const convertedField = camelizeObjectKeys(field)
  convertedField.fieldGroup = convertFieldGroup(field.Fieldgroup)
  delete convertedField.Fieldgroup
  convertedField.reference = convertReference(field.reference)
  convertedField.contextInfo = convertContextInfo(field.context_info)
  convertedField.fieldDefinition = convertFieldDefinition(field.Fielddefinition)
  delete convertedField.Fielddefinition
  convertedField.valueMin = field.value_max
  renameObjectKey(convertedField, 'columnSql', 'columnSQL')
  return (convertedField as IFieldData)
}

export function convertFieldGroup(fieldGroup: any): IFieldGroupData {
  if (!fieldGroup) {
    return {}
  }
  const convertedFieldGroup = (camelizeObjectKeys(fieldGroup) as IFieldGroupData)
  convertedFieldGroup.groupName = convertedFieldGroup.name
  convertedFieldGroup.groupType = convertedFieldGroup.fieldGroupType
  return convertedFieldGroup
}

export function convertReference(reference: any): IReferenceData {
  if (!reference) {
    return {
      zoomWindows: []
    }
  }
  const convertedReference = camelizeObjectKeys(reference) as Partial<IReferenceData>
  convertedReference.zoomWindows = reference.zoom_windows.map((zoomWindowItem: any) => convertZoomWindow(zoomWindowItem))
  return convertedReference as IReferenceData
}

export function convertZoomWindow(zoomWindowToConvert: any): IZoomWindowData {
  if (!zoomWindowToConvert) {
    return {}
  }
  const convertedwindow = (camelizeObjectKeys(zoomWindowToConvert) as IZoomWindowData)
  return convertedwindow
}

export function convertFieldDefinition(
  fieldDefinition: any
): IFieldDefinitionData {
  if (!fieldDefinition) {
    return { conditions: [] }
  }
  const convertedDefinition = camelizeObjectKeys(fieldDefinition)
  renameObjectKey(convertedDefinition, 'Value', 'value')
  convertedDefinition.conditions = fieldDefinition.conditions
    .map((itemCondition: any) => connvertFieldCondition(itemCondition))
  return convertedDefinition as IFieldDefinitionData
}

export function connvertFieldCondition(
  fieldConditionToConvert: any
): IFieldConditionData {
  if (!fieldConditionToConvert) {
    return {}
  }
  return camelizeObjectKeys(fieldConditionToConvert)
}
