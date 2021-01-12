import { IValueData } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { KeyValueData } from '../../PersistenceType'
import { PersistenceState } from '@/ADempiere/modules/persistence'

type PersistenceGetterTree = GetterTree<PersistenceState, IRootState>

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
