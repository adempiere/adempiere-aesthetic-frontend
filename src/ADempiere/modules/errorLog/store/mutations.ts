import { MutationTree } from 'vuex'
import { IErrorLogState, IErrorLog } from '../ErrorLogType'

type ErrorLogMutationTree = MutationTree<IErrorLogState>

export const mutations: ErrorLogMutationTree = {
  ADD_ERROR_LOG(state: IErrorLogState, log: IErrorLog) {
    state.logs.push(log)
  },
  CLEAR_ERROR_LOG(state: IErrorLogState) {
    state.logs.splice(0)
  }
}
