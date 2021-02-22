import { MutationTree } from 'vuex'
import { ISettingsState } from '../SettingsType'

type SettingsMutationTree = MutationTree<ISettingsState>

export const mutations: SettingsMutationTree = {
  CHANGE_SETTING(state: ISettingsState, payload: { key: string, value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      (state as any)[key] = value
    }
  }
}
