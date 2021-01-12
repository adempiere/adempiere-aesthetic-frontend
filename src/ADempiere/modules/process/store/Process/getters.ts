import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { INotificationProcessData, ProcessState } from '@/ADempiere/modules/process/ProcessType'

type ProcessGetterTree = GetterTree<ProcessState, IRootState>

export const getters: ProcessGetterTree = {
  /**
     * Running processes that have not received a response from the server
     * @param {string} containerUuid
     */
  getInExecution: (state: ProcessState) => (containerUuid: string): any => {
    return state.inExecution.find(
      item => item.containerUuid === containerUuid
    )
  },
  /**
     * Process for send to server, or send without response
     */
  getAllInExecution: (state: ProcessState): any[] => {
    return state.inExecution
  },
  /**
     * Process send to server, with response from server
     */
  getAllFinishProcess: (state: ProcessState): INotificationProcessData[] => {
    return state.process
  },
  getNotificationProcess: (
    state: ProcessState
  ): INotificationProcessData[] => {
    return state.notificationProcess
  },
  /**
     * Process receibed from server associated whith this session
     */
  getAllSessionProcess: (state: ProcessState): any[] => {
    return state.sessionProcess
  },
  /**
     * Process request metadata from server filter form uuid process
     */
  getInRequestMetadata: (state: ProcessState) => (
    containerUuid: string
  ): any => {
    return state.inRequestMetadata.find(item => item === containerUuid)
  },
  getProcessResult: (state: ProcessState): any => {
    return state.reportObject
  },
  getCachedReport: (state: ProcessState) => (
    instanceUuid: string
  ): INotificationProcessData | undefined => {
    return state.reportList.find(
      (item: INotificationProcessData) =>
        item.instanceUuid === instanceUuid
    )
  }
}
