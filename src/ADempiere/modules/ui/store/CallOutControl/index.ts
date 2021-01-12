import { Module } from 'vuex'
import { actions } from './actions'
import { IRootState } from '@/store'
import { CallOutControlState } from '../../UITypes'

const namespaced = true

export const callOutControlModule: Module<CallOutControlState, IRootState> = {
  namespaced,
  actions
}
