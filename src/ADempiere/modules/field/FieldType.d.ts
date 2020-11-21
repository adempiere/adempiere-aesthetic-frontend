import { IContextInfoData } from '@/ADempiere/modules/core'
import { IAttributeData } from '@/ADempiere/modules/persistence'

export interface IFieldGroupData {
    id?: number
    uuid?: string
    name?: string
    fieldGroupType?: string
    isActive?: boolean
    //
    groupName?: any // Not Found Type in proto
    groupType?: any // Not found Type in proto
}

export interface IZoomWindowData {
    id?: number
    uuid?: string
    name?: string
    description?: string
    isSalesTransaction?: boolean
    isActive?: boolean
}

export interface IReferenceData {
    tableName?: string
    keyColumnName?: string
    displayColumnName?: string
    query?: string
    directQuery?: string
    validationCode?: string
    zoomWindows?: IZoomWindowData[]
}

export interface IFieldConditionData {
    id?: number
    uuid?: string
    condition?: string
    stylesheet?: string
    isActive?: boolean
}

export interface IFieldDefinitionData {
    id?: number
    uuid?: string
    value?: string
    name?: string
    fieldGroupType?: string
    isActive?: boolean
    conditions?: IFieldConditionData[]
}

export interface IFieldData {
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

// Service API Types

export interface ICreateLocationAddressParams {
    attributesList: IAttributeData[]
}

export interface IGetLocationAddressParams {
    id: number
    uuid: string
}

export type IUpdateLocationAddressParams = IGetLocationAddressParams &
    ICreateLocationAddressParams
