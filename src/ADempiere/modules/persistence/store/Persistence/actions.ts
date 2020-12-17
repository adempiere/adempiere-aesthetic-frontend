import { IValueData } from '@/ADempiere/modules/core'
import { RootState } from '@/ADempiere/shared/store/types'
import { ActionTree, ActionContext } from 'vuex'
import {
  KeyValueData,
  requestCreateEntity,
  requestUpdateEntity,
  PersistenceState
} from '@/ADempiere/modules/persistence'

type PersistenceActionTree = ActionTree<PersistenceState, RootState>
type PersistenceActionContext = ActionContext<PersistenceState, RootState>

export const actions: PersistenceActionTree = {
  flushPersistenceQueue(
    context: PersistenceActionContext,
    payload: {
            containerUuid: string
            tableName: string
            recordUuid: string
        }
  ) {
    const { containerUuid, tableName, recordUuid } = payload
    return new Promise((resolve, reject) => {
      let attributes:
                | KeyValueData<IValueData>[]
                | undefined = context.getters.getPersistenceAttributes(
                  containerUuid
                )
      if (attributes) {
        if (recordUuid) {
          // Update existing entity
          requestUpdateEntity({
            tableName,
            uuid: recordUuid,
            attributes
          })
            .then(response => {
              context.dispatch('listRecordLogs', {
                tableName: response.tableName,
                recordId: response.id,
                recordUuid: response.uuid
              })
              resolve(response)
            })
            .catch(error => reject(error))
        } else {
          attributes = attributes.filter(
            (itemAttribute: KeyValueData<IValueData>) =>
              itemAttribute.value
          )

          // Create new entity
          requestCreateEntity({
            tableName,
            attributesList: attributes
          })
            .then(response => resolve(response))
            .catch(error => reject(error))
        }
      }
    })
  }
}
