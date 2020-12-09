import { IValueData } from '@/ADempiere/modules/core'
import { RootState } from '@/ADempiere/shared/store/types'
import { GetterTree } from 'vuex'
import { KeyValueData } from '../../PersistenceType'
import { PersistenceState } from './state'

type PersistenceGetterTree = GetterTree<PersistenceState, RootState>

export const getters: PersistenceGetterTree = {
  getPersistenceMap: (state: PersistenceState) => (tableName: string) => {
    return state.persistence[tableName]
  },
  getPersistenceAttributes: (state: PersistenceState) => (containerUuid: string): KeyValueData<IValueData>[] | undefined => {
    const attributesMap: Map<String, KeyValueData<IValueData>> = state.persistence[containerUuid]
    if (attributesMap) {
      return [
        ...attributesMap.values()
      ]
    }
    return undefined
  }
}
