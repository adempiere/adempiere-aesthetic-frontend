import { IRootState } from '@/store'
import { state } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { Module } from 'vuex'
import { AccessRecordState } from '../../PrivateAccessType'

const namespaced = true

export const accessRecordModule: Module<AccessRecordState, IRootState> = {
  namespaced,
  actions,
  getters,
  mutations,
  state
}
