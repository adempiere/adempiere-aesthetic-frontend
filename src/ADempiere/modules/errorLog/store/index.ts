import { IRootState } from '@/store'
import { Module } from 'vuex'
import { IErrorLogState } from '../ErrorLogType'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'

const namespaced = true

export const errorLog: Module<IErrorLogState, IRootState> = {
  namespaced,
  actions,
  state,
  mutations
}
