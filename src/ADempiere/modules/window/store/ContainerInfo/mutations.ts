import { IResponseList } from '@/ADempiere/shared/utils/types'
import { MutationTree } from 'vuex'
import { ContainerInfoState, IEntityLogData, IListWorkflowsResponse, IWorkflowProcessData } from '../../WindowType'

type ContainerInfoMutationTree = MutationTree<ContainerInfoState>

export const mutations: ContainerInfoMutationTree = {
  addListWorkflow(state: ContainerInfoState, payload: IResponseList<IWorkflowProcessData>) {
    state.listworkflowLog = payload
  },
  addListWorkflows(state: ContainerInfoState, payload: IListWorkflowsResponse) {
    state.listWorkflows = payload
  },
  addListRecordLogs(state: ContainerInfoState, payload: {
        recordCount: number
        entityLogs: IEntityLogData[]
      }): void {
    state.listRecordLogs = payload
  },
  resetStateContainerInfo(state: ContainerInfoState) {
    state = {
      listRecordLogs: {
        recordCount: 0,
        entityLogs: []
      },
      listWorkflows: {
        nextPageToken: '',
        list: [],
        recordCount: 0
      },
      listworkflowLog: {
        recordCount: 0,
        list: [],
        nextPageToken: ''
      }
    }
  }
}
