import { MutationTree } from 'vuex'
import { ProcessDefinitionState, IProcessData } from '@/ADempiere/modules/dictionary'

type ProcessMutationTree = MutationTree<ProcessDefinitionState>

export const mutations: ProcessMutationTree = {
  addProcess(state: ProcessDefinitionState, payload: IProcessData) {
    state.process.push(payload)
  },
  dictionaryResetCacheProcess(state: ProcessDefinitionState) {
    state.process = []
  }
}
