import { IContextInfoData } from '@/modules/core';

interface IFieldGroupData {
  id?: number
  uuid?: string
  name?: string
  fieldGroupType?: string
  isActive?: boolean
  //
  groupName?: any // Not Found Type in proto
  groupType?: any // Not found Type in proto
}

interface IZoomWindowData {
  id?: number
  uuid?: string
  name?: string
  description?: string
  isSalesTransaction?: boolean
  isActive?: boolean
}

interface IReferenceData {
  tableName?: string
  keyColumnName?: string
  displayColumnName?: string
  query?: string
  directQuery?: string
  validationCode?: string
  zoomWindows?: IZoomWindowData[]
}

interface IFieldConditionData {
  id?: number
  uuid?: string
  condition?: string
  stylesheet?: string
  isActive?: boolean
}

interface IFieldDefinitionData {
  id?: number
  uuid?: string
  value?: string
  name?: string
  fieldGroupType?: string
  isActive?: boolean
  conditions?: IFieldConditionData[]
}

interface IFieldData {
  // base attributes
  id: number
  uuid: string
  name: string
  description: string
  help: string
  columnName: string
  elementName: string
  isActive: boolean
  // displayed attributes
  fieldGroup: IFieldGroupData
  displayType: number
  isFieldOnly: boolean
  isRange: boolean
  isSameLine: boolean
  isEncrypted: boolean // passswords fields
  isQuickEntry: boolean
  sequence: number
  seqNoGrid: number
  sortNo: number
  identifierSequence: number
  // value attributes
  formatPattern: string
  vFormat: string
  defaultValue: string
  defaultValueTo: string
  fieldLength: number
  valueMin: string
  valueMax: string
  //
  isIdentifier: boolean
  isParent: boolean
  isKey: boolean
  isSelectionColumn: boolean
  isUpdateable: boolean
  isAlwaysUpdateable: boolean
  //
  isAllowCopy: boolean
  isHeading: boolean
  isAllowLogging: boolean
  isTranslated: boolean
  //
  columnSQL: string
  //
  isDisplayed: boolean
  isDisplayedGrid: boolean
  isMandatory: boolean
  isReadOnly: boolean
  // Smart Browser attributes
  isQueryCriteria: boolean
  isOrderBy: boolean
  isinfoOnly: boolean
  // logics
  callout: string
  displayLogic: string
  mandatoryLogic: string
  readOnlyLogic: string
  // External info
  reference: IReferenceData
  contextInfo: IContextInfoData
  fieldDefinition: IFieldDefinitionData
}
