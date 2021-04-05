import { IRootState } from '@/store'
import { Module } from 'vuex'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { IPermissionState } from '../PermissionType'

const namespaced = true

export const permission: Module<IPermissionState, IRootState> = {
  namespaced,
  actions,
  state,
  mutations
}
