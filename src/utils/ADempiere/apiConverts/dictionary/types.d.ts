import { IFieldData, IFieldGroupData } from '../field/types'
import { IContextInfoData } from '../core/types'

interface IReportExportTypeData {
  name: string
  description: string
  type: string
}

interface IProcessData {
  accessLevel: number
  description: string
  help: string
  id: number
  isActive: boolean
  isDirectPrint: boolean
  isReport: boolean
  name: string
  parameters: IFieldData[]
  reportExportTypes: IReportExportTypeData[] // no convert content
  showHelp: string
  uuid: string
}

interface ITabData {
  id: number
  uuid: string
  name: string
  description: string
  help: string
  tableName: string
  sequence: number
  tabLevel: number
  isActive: boolean
  isSingleRow: boolean
  isAdvancedTab: boolean
  isHasTree: boolean
  isInfoTab: boolean
  isSortTab: boolean
  isTranslationTab: boolean
  isReadOnly: boolean
  isInsertRecord: boolean
  isView: boolean
  isDeleteable: boolean
  isDocument: boolean
  isChangeLog: boolean
  accessLevel: number
  linkColumnName: string
  sortOrderColumnName: string
  sortYesNoColumnName: string
  parentColumnName: string
  displayLogic: string
  commitWarning: string
  query: string
  whereClause: string
  orderByClause: string
  parentTabUuid: string
  contextInfo: IContextInfoData
  fieldGroup: IFieldGroupData
  processes: IProcessData[]
  fields: IFieldData[]
}

interface IWindowData {
  id: number
  uuid: string
  name: string
  description: string
  help: string
  isActive: boolean
  isSalesTransaction: boolean
  windowType: string
  contextInfo: IContextInfoData
  tabs: ITabData[]
}

interface IBrowserData {
  id: number
  uuid: string
  viewUuid: string
  //
  value: string
  name: string
  description: string
  help: string
  accessLevel: number
  isActive: boolean
  //
  isUpdateable: boolean
  isDeleteable: boolean
  isSelectedByDefault: boolean
  isCollapsibleByDefault: boolean
  isExecutedQueryByDefault: boolean
  isShowTotal: boolean
  // search query
  query: string
  whereClause: string
  orderByClause: string
  // External Reference
  window: IWindowData
  process: IProcessData
  //
  fields: IFieldData[]
}

interface IFormData {
  id: number
  uuid: string
  name: string
  description: string
  help: string
  accessLevel: number
  fileName: string
  isActive: boolean
}

interface IValidationRule {
  id: number
  uuid: string
  name: string
  description: string
  validationCode: string
  type: string
}
