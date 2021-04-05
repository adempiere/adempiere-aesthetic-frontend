import { IResponseList } from '@/ADempiere/shared/utils/types'
import { MutationTree } from 'vuex'
import { IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType'
import { INotificationProcessData, IProcessLogData, ProcessState } from '@/ADempiere/modules/process/ProcessType'

type ProcessMutationTree = MutationTree<ProcessState>

export const mutations: ProcessMutationTree = {
  // Add process in execution
  addInExecution(state: ProcessState, payload) {
    state.inExecution.push(payload)
  },
  // Add process in notifation
  addNotificationProcess(state: ProcessState, payload: INotificationProcessData) {
    state.notificationProcess.push(payload)
  },
  // Delete process in execution afther some response from server
  deleteInExecution(state: ProcessState, payload: {
        containerUuid: string
      }) {
    state.inExecution = state.inExecution.filter(item => item.containerUuid !== payload.containerUuid)
  },
  // Add process in request metadata from server
  addInRequestMetadata(state: ProcessState, uuid: string) {
    state.inRequestMetadata.push(uuid)
  },
  // Delete process in request metadata
  deleteInRequestMetadata(state: ProcessState, uuid: string) {
    state.inRequestMetadata = state.inRequestMetadata.filter(item => item !== uuid)
  },
  addStartedProcess(state: ProcessState, payload: INotificationProcessData) {
    state.process.push(payload)
  },
  resetStateProcessControl(state: ProcessState) {
    state = {
      inExecution: [], // process not response from server
      isVisibleDialog: false,
      reportObject: {},
      reportList: [],
      metadata: {},
      process: [], // process to run finish
      sessionProcess: [],
      notificationProcess: [],
      inRequestMetadata: [],
      reportViewList: [],
      totalResponse: 0,
      totalRequest: 0,
      totalSelection: 0,
      errorSelection: 0,
      successSelection: 0
    }
  },
  /**
       *
       * @param {object} state
       * @param {boolean} payload, true or false value to change displayed dialog
       */
  setShowDialog(state: ProcessState, payload: boolean) {
    state.isVisibleDialog = payload
  },
  setMetadata(state: ProcessState, payload: IPanelDataExtended) {
    state.metadata = payload
  },
  setReportValues(state: ProcessState, payload: INotificationProcessData) {
    state.reportObject = payload
    if (state.reportList.some(report => report.instanceUuid === payload.instanceUuid)) {
      const reportIndex = state.reportList.findIndex(report => report.instanceUuid === payload.instanceUuid)
      state.reportList.splice(reportIndex, 1, payload)
    } else {
      state.reportList.push(payload)
    }
  },
  setSessionProcess(state: ProcessState, payload: IResponseList<IProcessLogData & {
        processUuid: string
    }>) {
    state.sessionProcess = payload.list
  },
  changeFormatReport(state: ProcessState, payload: any) {
    state.reportFormat = payload
  },
  setReportViewsList(state: ProcessState, payload) {
    state.reportViewList.push(payload)
  },
  setTotalResponse(state: ProcessState, payload: number) {
    state.totalResponse = payload
  },
  setTotalSelection(state: ProcessState, payload: number) {
    state.totalSelection = payload
  },
  setSuccessSelection(state: ProcessState, payload: number) {
    state.successSelection = payload
  },
  setErrorSelection(state: ProcessState, payload: number) {
    state.errorSelection = payload
  },
  setTotalRequest(state: ProcessState, payload: number) {
    state.totalRequest = payload
  }
}
