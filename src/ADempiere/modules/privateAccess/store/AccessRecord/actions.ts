import { IRootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import {
  AccessRecordState,
  IAccessRecordAttribute
} from '../../PrivateAccessType'

type AccessRecordActionTree = ActionTree<AccessRecordState, IRootState>
type AccessRecordActionContext = ActionContext<AccessRecordState, IRootState>

export const actions: AccessRecordActionTree = {
  changeList(context: AccessRecordActionContext, listRecord: any[]) {
    const recordAccess: Partial<IAccessRecordAttribute> & {
      listRecord: any[]
    } = {
      recordId: context.state.attribute?.recordId,
      recordUuid: context.state.attribute?.recordUuid,
      tableName: context.state.attribute?.tableName,
      listRecord
    }
    context.commit('setListRecordAcces', recordAccess)
  },
  addAttribute(context: AccessRecordActionContext, params: IAccessRecordAttribute) {
    context.commit('setAttribute', params)
  }
}
