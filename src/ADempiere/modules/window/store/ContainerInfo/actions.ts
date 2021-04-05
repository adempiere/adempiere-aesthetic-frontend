import { IRootState } from '@/store'
import { IResponseList } from '@/ADempiere/shared/utils/types'
import { ActionContext, ActionTree } from 'vuex'
import { requestListEntityLogs, requestListWorkflows, requestListWorkflowsLogs } from '../../WindowService'
import { ContainerInfoState, IListEntityLogsResponse, IListWorkflowsResponse, IWorkflowProcessData } from '../../WindowType'

type ContainerInfoActionContext = ActionContext<ContainerInfoState, IRootState>
type ContainerInfoActionTree = ActionTree<ContainerInfoState, IRootState>

export const actions: ContainerInfoActionTree = {
  listRecordLogs(context: ContainerInfoActionContext, payload: {
        tableName: string
        recordId: number
        recordUuid: string
      }) {
    const {
      tableName, recordId, recordUuid
    } = payload
    const pageSize = 0
    const pageToken = '0'
    return requestListEntityLogs({
      tableName,
      recordId,
      recordUuid,
      pageSize,
      pageToken
    })
      .then((response: IListEntityLogsResponse) => {
        const listRecord = {
          recordCount: response.recordCount,
          entityLogs: response.list
        }
        context.commit('addListRecordLogs', listRecord)
        return listRecord
      })
      .catch(error => {
        console.warn(`Error getting List Record Logs: ${error.message}. Code: ${error.code}.`)
      })
  },
  listWorkflowLogs(context: ContainerInfoActionContext, payload: {
        tableName: string
        recordId: number
        recordUuid: string
      }) {
    const { tableName, recordUuid, recordId } = payload
    const pageSize = 0
    const pageToken = '0'
    // context.dispatch('listWorkflows', tableName)
    return requestListWorkflowsLogs({
      tableName,
      recordId,
      recordUuid,
      pageSize,
      pageToken
    })
      .then((workflowLog: IResponseList<IWorkflowProcessData>) => {
        context.commit('addListWorkflow', workflowLog)
        return workflowLog
      })
      .catch(error => {
        console.warn(`Error getting List workflow: ${error.message}. Code: ${error.code}.`)
      })
  },
  listWorkflows(context: ContainerInfoActionContext, tableName: string) {
    const pageSize = 0
    const pageToken = '0'
    return requestListWorkflows({
      tableName,
      pageSize,
      pageToken
    })
      .then((responseWorkFlowList: IListWorkflowsResponse) => {
        context.commit('addListWorkflows', responseWorkFlowList.list)
        return responseWorkFlowList
      })
      .catch(error => {
        console.warn(`Error getting List workflow: ${error.message}. Code: ${error.code}.`)
      })
  }
}
