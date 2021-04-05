import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import {
  ContainerInfoState,
  IEntityLogData,
  IListWorkflowsResponse,
  IWorkflowProcessData
} from '../../WindowType'

type ContainerInfoGetterTree = GetterTree<ContainerInfoState, IRootState>

export const getters: ContainerInfoGetterTree = {
  getWorkflow: (state: ContainerInfoState): IWorkflowProcessData[] => {
    return state.listworkflowLog.list
  },
  getNodeWorkflow: (state: ContainerInfoState): IListWorkflowsResponse => {
    return state.listWorkflows
  },
  getRecordLogs: (
    state: ContainerInfoState
  ): {
        recordCount: number
        entityLogs: IEntityLogData[]
    } => {
    return state.listRecordLogs
  }
}
