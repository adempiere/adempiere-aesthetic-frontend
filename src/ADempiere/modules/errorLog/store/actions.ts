import { IRootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import { IErrorLog, IErrorLogState } from '../ErrorLogType'

type ErrorLogActionTree = ActionTree<IErrorLogState, IRootState>
type ErrorLogActionContext = ActionContext<IErrorLogState, IRootState>

export const actions: ErrorLogActionTree = {
  AddErrorLog(context: ErrorLogActionContext, log: IErrorLog) {
    context.commit('ADD_ERROR_LOG', log)
  },
  ClearErrorLog(context: ErrorLogActionContext) {
    context.commit('CLEAR_ERROR_LOG')
  }
}
