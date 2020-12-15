import { ReportExportContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'

export interface UtilsState {
    width: number
    height: number
    splitHeight: number
    splitHeightTop: number
    widthLayout: number
    tempShareLink: string
    oldAction?: any
    reportType: ReportExportContextType | string
    isShowedTable: boolean
    isShowedTabChildren: boolean
    recordTable: number
    selectionProcess: any[]
    isContainerInfo: boolean
    documentAction: any[]
    openRoute: {
        path: string
        name: string
        route: {}
        params: {}
        definedParameters: {}
        query: {}
        isReaded: boolean
        isLoaded: boolean
    }
    splitWidthRight: number
    splitWidthLeft: number
}
