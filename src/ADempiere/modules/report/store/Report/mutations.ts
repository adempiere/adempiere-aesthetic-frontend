import { MutationTree } from 'vuex'
import { IDrillTableItemData, IReportFormatItemData, IReportViewItemData, ReportState } from '../../ReportType'

type ReportMutationTree = MutationTree<ReportState>

export const mutations: ReportMutationTree = {
  setReportFormatsList(state: ReportState, payload: IReportFormatItemData) {
    state.reportFormatsList.push(payload)
  },
  setReportViewsList(state: ReportState, payload: IReportViewItemData) {
    state.reportViewsList.push(payload)
  },
  setDrillTablesList(state: ReportState, payload: IDrillTableItemData) {
    state.drillTablesList.push(payload)
  },
  setNewReportOutput(state: ReportState, payload) {
    state.reportOutput = payload
  },
  resetReportControl(state: ReportState) {
    state = {
      reportFormatsList: [],
      reportViewsList: [],
      drillTablesList: [],
      reportOutput: undefined
    }
  }
}
