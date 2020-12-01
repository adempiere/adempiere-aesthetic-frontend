import { MutationTree } from 'vuex'
import Vue from 'vue'
import { IPrefrenceData, PreferenceState } from './state'

type PreferenceMutationTree = MutationTree<PreferenceState>

export const mutations: PreferenceMutationTree = {
  /**
     * Set context in state
     * @param {string} payload.parentUuid
     * @param {string} payload.containerUuid
     * @param {string} payload.columnName
     * @param {mixed} payload.value
     */
  setPreferenceContext(
    state: PreferenceState,
    payload: IPrefrenceData
  ): void {
    let key = ''
    if (payload.parentUuid) {
      key += payload.parentUuid + '|'

      // set context for window
      const keyParent: string = key + payload.columnName
      Vue.set(state.preference, keyParent, payload.value)
    }
    if (payload.containerUuid) {
      key += payload.containerUuid + '|'
    }
    key += payload.columnName
    // set property to object
    Vue.set(state.preference, key, payload.value)
  },
  setInitialContext(
    state: PreferenceState,
    objectContext: any
  ): void {
    Object.keys(objectContext).forEach((key: string) => {
      Vue.set(
        state.preference,
        key,
        objectContext[key]
      )
    })
  },
  setMultiplePreference(
    state: PreferenceState,
    preferenceToSet: IPrefrenceData
  ): void {
    if (state.preference) {
      // join and overwrite old values
      preferenceToSet = {
        ...state.preference,
        ...preferenceToSet
      }
    }

    state.preference = preferenceToSet
  },
  dictionaryResetCacheContext(state: PreferenceState): void {
    state.preference = {
      columnName: '',
      value: null
    }
  }
}
