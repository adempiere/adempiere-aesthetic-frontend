import { MutationTree } from 'vuex'
import { AccessRecordState, IAccessRecordAttribute } from '../../PrivateAccessType'

type AccessRecordMutationTree = MutationTree<AccessRecordState>

export const mutations: AccessRecordMutationTree = {
  setListRecordAcces(state: AccessRecordState, listRecordAcces: any[]) {
    state.listRecordAcces = listRecordAcces
  },
  setAttribute(state: AccessRecordState, attribute: IAccessRecordAttribute) {
    state.attribute = attribute
  }
}
