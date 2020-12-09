import { IValueData } from '@/ADempiere/modules/core'
import { KeyValueData } from '../../PersistenceType'

export interface PersistenceState {
    persistence: {
        [columnName: string]: Map<String, KeyValueData<IValueData>>
    }
}

export const state: PersistenceState = {
  persistence: {}
}
