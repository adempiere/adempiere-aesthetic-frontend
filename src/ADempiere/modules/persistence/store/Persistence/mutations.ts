import { IValueData } from '@/ADempiere/modules/core'
import { MutationTree } from 'vuex'
import { KeyValueData } from '@/ADempiere/modules/persistence'
import { PersistenceState } from './state'

type PersistenceMutationTree = MutationTree<PersistenceState>

export const mutations: PersistenceMutationTree = {
  resetStatepersistence(state: PersistenceState): void {
    state = {
      persistence: {}
    }
  },
  addChangeToPersistenceQueue(
    state: PersistenceState,
    payload: {
            containerUuid: string
            columnName: string
            // valueType,
            value: IValueData
        }
  ): void {
    const { containerUuid, columnName, value } = payload
    if (!state.persistence[containerUuid]) {
      state.persistence[containerUuid] = new Map<
                String,
                KeyValueData<IValueData>
            >()
    }
    // Set value
    state.persistence[containerUuid].set(columnName, {
      key: columnName,
      // valueType,
      value
    })
  }
}
