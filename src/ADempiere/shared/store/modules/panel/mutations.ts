import { IPanelDataExtended } from '@/ADempiere/modules/dictionary'
import { MutationTree } from 'vuex'
import { PanelState } from './type'

type PanelMutationTree = MutationTree<PanelState>

export const mutations: PanelMutationTree = {
  addPanel(state: PanelState, payload: IPanelDataExtended) {
    state.panel.push(payload)
  },
  changePanelAttribute(state: PanelState, payload) {
    payload.panel[payload.attributeName] = payload.attributeValue
  },
  changeFieldAttribure(state: PanelState, payload) {
    payload.field[payload.attributeName] = payload.attributeValue
  },
  changeFieldLogic(state: PanelState, payload) {
    if (payload.isDisplayedFromLogic) {
      payload.field.isDisplayedFromLogic = Boolean(payload.isDisplayedFromLogic)
    }
    payload.field.isMandatoryFromLogic = Boolean(payload.isMandatoryFromLogic)
    payload.field.isReadOnlyFromLogic = Boolean(payload.isReadOnlyFromLogic)
    payload.field.parsedDefaultValue = payload.parsedDefaultValue
  },
  dictionaryResetCache(state: PanelState) {
    state.panel = []
  }
}
