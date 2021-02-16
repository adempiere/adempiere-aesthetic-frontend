import { Namespaces } from '@/ADempiere/shared/utils/types'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IPointOfSalesData, KeyLayoutState } from '../../POSType'

type KeyLayoutGetterTree = GetterTree<KeyLayoutState, IRootState>

export const getters: KeyLayoutGetterTree = {
  // current pos uuid
  getKeyLayoutUuidWithPOS: (state: KeyLayoutState, getters, rootState, rootGetters): string | undefined => {
    const currentPOS: IPointOfSalesData = rootGetters[Namespaces.PointOfSales + '/' + 'getCurrentPOS']
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
