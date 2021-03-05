import { ReportExportContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { GetterTree } from 'vuex'
import { IRootState } from '@/store'
import { ISelectionProcessData, UtilsState } from './type'

type UtilsGetterTree = GetterTree<UtilsState, IRootState>

export const getters: UtilsGetterTree = {
  getWidth: (state: UtilsState): number => {
    return state.width
  },
  getProcessSelect: (state: UtilsState): Partial<ISelectionProcessData> => {
    return state.selectionProcess
  },
  getWidthLayout: (state: UtilsState, rootGetters): number => {
    if (rootGetters.toggleSideBar) {
      return state.width - 250
    }
    return state.width - 54
  },
  getHeigth: (state: UtilsState): number => {
    return state.height
  },
  getSplitHeightTop: (state: UtilsState): number => {
    return state.splitHeightTop
  },
  getRecordUuidMenu: (state: UtilsState): number => {
    return state.recordTable
  },
  getShowContextMenuTable: (state: UtilsState): boolean => {
    const menu = state.isShowedTable
    return menu
  },
  getShowContainerInfo: (state: UtilsState): boolean => {
    const showInfo = state.isContainerInfo
    return showInfo
  },
  getShowContextMenuTabChildren: (state: UtilsState): boolean => {
    const menu = state.isShowedTabChildren
    return menu
  },
  getSplitHeight: (state: UtilsState): number => {
    const split = state.splitHeight
    if (split !== 50) {
      return split
    }
    return 50
  },
  getTempShareLink: (state: UtilsState): string => {
    return state.tempShareLink
  },
  getReportType: (state: UtilsState): string | ReportExportContextType => {
    return state.reportType
  },
  getIsLoadedOpenRoute: (state: UtilsState): boolean => {
    return state.openRoute.isLoaded
  },
  getIsReadedOpenRoute: (state: UtilsState): boolean => {
    return state.openRoute.isReaded
  },
  getOrders: (state: UtilsState): any[] => {
    return state.documentAction
  },
  getWidthRight: (state: UtilsState): number => {
    return state.splitWidthRight
  },
  getWidthLeft: (state: UtilsState): number => {
    return state.splitWidthLeft
  },
  getPosParameters: (state: UtilsState): any[] => {
    return state.parametersProcessPos
  },
  getUpdateOrderPos: (state: UtilsState): boolean => {
    return state.updateOrder
  },
  getUpdatePaymentPos: (state: UtilsState): boolean => {
    return state.updatePayment
  }
}
