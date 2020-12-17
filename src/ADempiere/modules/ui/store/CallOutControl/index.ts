import { Module } from 'vuex'
import { actions } from './actions'
import { RootState } from '@/ADempiere/shared/store/types'
import { CallOutControlState } from '../../UITypes'

const namespaced = true

export const callOutControlModule: Module<CallOutControlState, RootState> = {
  namespaced,
  actions
}
