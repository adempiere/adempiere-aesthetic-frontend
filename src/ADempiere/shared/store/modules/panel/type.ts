import { IPanelDataExtended } from '@/ADempiere/modules/dictionary'

export interface IPanelParameters {
    columnName: string
    operator: string
    // valueType: parameterItem.valueType,
    values?: any[]
    value: any
}

export interface IRangeAttributeData {
    columnName: string
    value: string
    isSQL: boolean
}

export interface PanelState {
    panel: IPanelDataExtended[]
}
