import { RootState } from '@/ADempiere/shared/store/types'
import { GetterTree } from 'vuex'
import { IPointOfSalesData, KeyLayoutState } from '../../POSType'

type KeyLayoutGetterTree = GetterTree<KeyLayoutState, RootState>

export const getters: KeyLayoutGetterTree = {
  // current pos uuid
  getKeyLayoutUuidWithPOS: (state: KeyLayoutState, getters): string | undefined => {
    const currentPOS: IPointOfSalesData = getters.getCurrentPOS()
    if (!currentPOS) {
      return undefined
    }
    return currentPOS.keyLayoutUuid
  },
  getKeyLayout: (state: KeyLayoutState): {
        isLoaded: boolean
        isReload: boolean
        recordCount: number
        nextPageToken?: string
        uuid?: string
        orderList?: any[]
      } => {
    if (!state.keyLayout) {
      return {
        isLoaded: false,
        isReload: true,
        recordCount: 0,
        nextPageToken: undefined,
        //
        uuid: undefined,
        orderList: []
      }
    }
    return state.keyLayout
  }
}
