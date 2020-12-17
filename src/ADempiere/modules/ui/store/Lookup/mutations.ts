import { MutationTree } from 'vuex'
import {
  ILookupItemDataExtended,
  ILookupListExtended,
  LookupState
} from '@/ADempiere/modules/ui/UITypes'

type LookupMutationTree = MutationTree<LookupState>

export const mutations: LookupMutationTree = {
  addLoockupItem(state: LookupState, payload: ILookupItemDataExtended) {
    state.lookupItem.push(payload)
  },
  addLoockupList(state: LookupState, payload: ILookupListExtended) {
    state.lookupList.push(payload)
  },
  deleteLookupList(
    state: LookupState,
    payload: {
            lookupItem: ILookupItemDataExtended[]
            lookupList: ILookupListExtended[]
        }
  ) {
    state.lookupItem = payload.lookupItem
    state.lookupList = payload.lookupList
  },
  resetStateLookup(state: LookupState) {
    state = {
      lookupItem: [],
      lookupList: []
    }
  }
}
