import { GetterTree } from 'vuex'
import { IPrefrenceData, PreferenceState } from './state'
import { RootState } from '@/ADempiere/shared/store/types'
import { IPermissionState } from '@/store/modules/permission'

type PreferenceGetterTree = GetterTree<PreferenceState, RootState>

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
      }) => {
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
  getAllPreference: (state: PreferenceState) => {
    return state.preference
  },
  getPreferenceClientId: (state: PreferenceState): number => {
    return parseInt(state.preference['#AD_Client_ID'], 10)
  },
  getPreferenceOrgId: (state: PreferenceState): number => {
    return parseInt(state.preference['#AD_Org_ID'], 10)
  }
}
