import { Module } from 'vuex'
import { actions } from './actions'
import { IRootState } from '@/store'
import { BrowserDefinitionState } from '@/ADempiere/modules/dictionary'

const namespaced = true

export const browserDefinitionModule: Module<BrowserDefinitionState, IRootState> = {
  namespaced,
  actions
}
