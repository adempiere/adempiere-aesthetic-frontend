import { GetterTree } from 'vuex'
import {
  IProcessData,
  ProcessDefinitionState
} from '@/ADempiere/modules/dictionary'
import { RootState } from '@/ADempiere/shared/store/types'

type ProcessDefinitionGetterTree = GetterTree<ProcessDefinitionState, RootState>

export const getters: ProcessDefinitionGetterTree = {
  getProcess: (state: ProcessDefinitionState) => (processUuid: string): IProcessData | undefined => {
    return state.process.find(
      (item: IProcessData) => item.uuid === processUuid
    )
  },
  getProcessById: (state: ProcessDefinitionState) => (processId: string) => {
    return state.process.find(
      (item: IProcessData) => item.id === parseInt(processId)
    )
  }
}
