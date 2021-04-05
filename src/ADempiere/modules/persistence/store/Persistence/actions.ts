import { IValueData } from '@/ADempiere/modules/core'
import { IRootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import {
  KeyValueData,
  requestCreateEntity,
  requestUpdateEntity,
  PersistenceState
} from '@/ADempiere/modules/persistence'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { LOG_COLUMNS_NAME_LIST } from '@/ADempiere/shared/utils/dataUtils'
import language from '@/ADempiere/shared/lang'
import { showMessage } from '@/ADempiere/shared/utils/notifications'

type PersistenceActionTree = ActionTree<PersistenceState, IRootState>
type PersistenceActionContext = ActionContext<PersistenceState, IRootState>

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
      let attributes: KeyValueData<IValueData>[] | undefined =
      context.getters.getPersistenceAttributes(containerUuid).filter((itemField: any) => {
        return !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
      })
      if (attributes) {
        if (recordUuid) {
          // Update existing entity
          requestUpdateEntity({
            tableName,
            uuid: recordUuid,
            attributes
          })
            .then(response => {
              context.dispatch(Namespaces.ContainerInfo + '/' + 'listRecordLogs', {
                tableName: response.tableName,
                recordId: response.id,
                recordUuid: response.uuid
              }, { root: true })
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
            .then(response => {
              showMessage({
                message: language.t('data.createRecordSuccessful').toString(),
                type: 'success'
              })

              resolve(response)
            })
            .catch(error => reject(error))
        }
      }
    })
  }
}
