import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import {
  AccessRecordState,
  IAccessRecordAttribute
} from '../../PrivateAccessType'

type AccessRecordGetterTree = GetterTree<AccessRecordState, IRootState>

export const getters: AccessRecordGetterTree = {
  getListRecordAcces: (state: AccessRecordState): any[] => {
    return state.listRecordAcces
  },
  getAttribute: (
    state: AccessRecordState
  ): IAccessRecordAttribute | undefined => {
    return state.attribute
  }
}
