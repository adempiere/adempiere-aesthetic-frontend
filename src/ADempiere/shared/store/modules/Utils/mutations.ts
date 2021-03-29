import { ReportExportContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { MutationTree } from 'vuex'
import { ISelectionProcessData, UtilsState } from './type'

type UtilsMutationTree = MutationTree<UtilsState>

export const mutations: UtilsMutationTree = {
  setWidth(state: UtilsState, width: number) {
    state.width = width
  },
  setWidthLayout(state: UtilsState, width: number) {
    state.widthLayout = width
  },
  setHeigth(state: UtilsState, height: number) {
    state.height = height
  },
  setSplitHeight(state: UtilsState, splitHeight: number) {
    state.splitHeight = splitHeight
  },
  showMenuTable(state: UtilsState, isShowedTable: boolean) {
    state.isShowedTable = isShowedTable
  },
  showContainerInfo(state: UtilsState, isContainerInfo: boolean) {
    state.isContainerInfo = isContainerInfo
  },
  showMenuTabChildren(state: UtilsState, isShowedTabChildren: boolean) {
    state.isShowedTabChildren = isShowedTabChildren
  },
  setSplitHeightTop(state: UtilsState, splitHeightTop: number) {
    state.splitHeightTop = splitHeightTop
  },
  setProcessTable(state: UtilsState, recordTable: number) {
    state.recordTable = recordTable
  },
  setOrder(state: UtilsState, payload: any[]) {
    state.documentAction = payload
  },
  setProcessSelecetion(state: UtilsState, selectionProcess: ISelectionProcessData) {
    state.selectionProcess = selectionProcess
  },
  setTempShareLink(state: UtilsState, payload: string) {
    state.tempShareLink = payload
  },
  setReportTypeToShareLink(
    state: UtilsState,
    payload: ReportExportContextType
  ) {
    state.reportType = payload
  },
  setOpenRoute(state: UtilsState, payload: any) {
    state.openRoute = {
      ...state.openRoute,
      ...payload
    }
  },
  setReadRoute(
    state: UtilsState,
    payload: {
            parameters: any
        }
  ) {
    // Vue.set(state.openRoute, 'definedParameters', payload.parameters)
    // Vue.set(state.openRoute, 'isLoaded', true)
  },
  resetStateUtils(state: UtilsState) {
    state = {
      width: 0,
      height: 0,
      splitHeight: 50,
      splitHeightTop: 0,
      widthLayout: 0,
      tempShareLink: '',
      oldAction: undefined,
      reportType: '',
      isShowedTable: false,
      isShowedTabChildren: false,
      recordTable: 0,
      selectionProcess: {},
      isContainerInfo: false,
      documentAction: [],
      openRoute: {
        path: '',
        name: '',
        route: {},
        params: {},
        definedParameters: {},
        query: {},
        isReaded: false,
        isLoaded: false
      },
      splitWidthRight: 3,
      splitWidthLeft: 3,
      parametersProcessPos: [],
      updateOrder: false,
      updatePayment: false,
      createBusinessPartner: false
    }
  },
  setSplitWidthRight(state: UtilsState, splitWidthRight: number) {
    state.splitWidthRight = splitWidthRight
  },
  setSplitWidthLeft(state: UtilsState, splitWidthLeft: number) {
    state.splitWidthLeft = splitWidthLeft
  },
  parametersProcessPos(state: UtilsState, params: any[]) {
    state.parametersProcessPos = params
  },
  setUpdateOrder(state: UtilsState, order: boolean) {
    state.updateOrder = order
  },
  setUpdatePayment(state: UtilsState, payment: boolean) {
    state.updatePayment = payment
  },
  popoverCreateBusinessPartner(state: UtilsState, createBusinessPartner: boolean) {
    state.createBusinessPartner = createBusinessPartner
  }
}
