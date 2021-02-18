import { ActionContext, ActionTree } from 'vuex'
import { IRootState } from '@/store'
import { UtilsState } from './type'

type UtilsActionContext = ActionContext<UtilsState, IRootState>
type UtilsActionTree = ActionTree<UtilsState, IRootState>

export const actions: UtilsActionTree = {
  setWidth(context: UtilsActionContext, width: number) {
    context.commit('setWidth', width)
  },
  setWidthLayout(context: UtilsActionContext, width: number) {
    context.commit('setWidthLayout', width)
  },
  setHeight(context: UtilsActionContext, height: number) {
    context.commit('setHeigth', height)
  },
  showMenuTable(context: UtilsActionContext, isShowedTable: boolean) {
    context.commit('showMenuTable', isShowedTable)
  },
  showContainerInfo(context: UtilsActionContext, isContainerInfo: boolean) {
    context.commit('showContainerInfo', isContainerInfo)
  },
  showMenuTabChildren(
    context: UtilsActionContext,
    isShowedTabChildren: boolean
  ) {
    context.commit('showMenuTabChildren', isShowedTabChildren)
  },
  setSplitHeight(context: UtilsActionContext, splitHeight: number) {
    context.commit('setSplitHeight', splitHeight)
  },
  setSplitHeightTop(context: UtilsActionContext, splitHeightTop: number) {
    context.commit('setSplitHeightTop', splitHeightTop)
  },
  setProcessTable(context: UtilsActionContext, recordTable: number) {
    context.commit('setProcessTable', recordTable)
  },
  setProcessSelect(context: UtilsActionContext, params: any[]) {
    context.commit('setProcessSelecetion', params)
  },
  setOpenRoute(context: UtilsActionContext, routeParameters: any) {
    context.commit('setOpenRoute', {
      ...routeParameters
    })
  },
  setReadRoute(
    context: UtilsActionContext,
    parameters: {
            parameters: any
        }
  ) {
    context.commit('setReadRoute', parameters)
  },
  setTempShareLink(
    context: UtilsActionContext,
    parameters: {
            processId: number
            href: any
        }
  ) {
    if (!parameters.href.includes(String(parameters.processId))) {
      context.commit('setTempShareLink', parameters.href)
    }
  },
  setReportTypeToShareLink(context: UtilsActionContext, value: any) {
    context.commit('setReportTypeToShareLink', value)
  },
  setOrder(context: UtilsActionContext, params: any[]) {
    context.commit('setOrder', params)
  },
  changeWidthRight(context: UtilsActionContext, newWidthRight: number) {
    context.commit('setSplitWidthRight', newWidthRight)
  },
  changeWidthLeft(context: UtilsActionContext, newWidthLeft: number) {
    context.commit('setSplitWidthLeft', newWidthLeft)
  },
  addParametersProcessPos(context: UtilsActionContext, params: any[]) {
    context.commit('parametersProcessPos', params)
  },
  updateOrderPos(context: UtilsActionContext, params: boolean) {
    context.commit('setUpdateOrder', params)
  }
}
