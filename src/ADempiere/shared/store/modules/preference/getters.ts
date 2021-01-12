import { GetterTree } from 'vuex'
import { PreferenceState } from './state'
import { IRootState } from '@/store'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'

type PreferenceGetterTree = GetterTree<PreferenceState, IRootState>

export const getters: PreferenceGetterTree = {
  /**
     * @param  {string} parentUuid
     * @param  {string} containerUuid
     * @param  {string} columnName
     */
  getPreference: (state: PreferenceState) => (payload: {
        parentUuid?: string
        containerUuid?: string
        columnName: string
      }): any => {
    const { parentUuid, containerUuid, columnName } = payload
    let key = ''
    if (parentUuid) {
      key += parentUuid + '|'

      // context for window
      const keyParent: string = key + columnName
      const valueParent = state.preference[keyParent]
      if (valueParent) {
        return valueParent
      }
    }
    if (containerUuid) {
      key += containerUuid + '|'
    }
    key += columnName

    return state.preference[key]
  },
  getAllPreference: (state: PreferenceState): IKeyValueObject => {
    return state.preference
  },
  getPreferenceClientId: (state: PreferenceState): number => {
    return parseInt(state.preference['#AD_Client_ID'], 10)
  },
  getPreferenceOrgId: (state: PreferenceState): number => {
    return parseInt(state.preference['#AD_Org_ID'], 10)
  }
}
