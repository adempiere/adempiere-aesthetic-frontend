import { IRootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { ISettingsState } from '../SettingsType'

type SettingsActionContext = ActionContext<ISettingsState, IRootState>
type SettingsActionTree = ActionTree<ISettingsState, IRootState>

export const actions: SettingsActionTree = {
  ChangeSetting(
    context: SettingsActionContext,
    payload: { key: string, value: any }
  ) {
    context.commit('CHANGE_SETTING', payload)
  }
}
