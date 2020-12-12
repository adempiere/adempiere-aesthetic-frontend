import { IPanelDataExtended } from '@/ADempiere/modules/dictionary'

export interface IRangeAttributeData {
    columnName: string
    value: string
    isSQL: boolean
}

export interface PanelState {
    panel: IPanelDataExtended[]
}
