import { ContextMenuState, IContextActionData, IContextMenuData } from '@/ADempiere/modules/window/WindowType/VuexType'
import { RootState } from '@/ADempiere/shared/store/types'
import { ActionContext, ActionTree } from 'vuex'
import { requestListDocumentActions, requestListDocumentStatuses } from '@/ADempiere/modules/window/WindowService'
import { IListDocumentActionsResponse, IListDocumentStatusesResponse } from '@/ADempiere/modules/window/WindowType/ServiceType'

type ContextMenuActionTree = ActionTree<ContextMenuState, RootState>
type ContextMenuActionContext = ActionContext<ContextMenuState, RootState>

export const actions: ContextMenuActionTree = {
  /**
     * Sub menu associated with panel
     * @param {string} containerUuid
     * @param {array}  relations
     * @param {array}  actions
     * @param {array}  references
     */
  setContextMenu(
    context: ContextMenuActionContext,
    payload: IContextMenuData
  ): void {
    payload.actions = payload.actions || []
    payload.references = payload.references || []
    payload.relations = payload.relations || []

    const { containerUuid, relations, actions, references } = payload
    context.commit('setContextMenu', {
      containerUuid,
      relations,
      actions,
      references
    })
  },
  addAction(
    context: ContextMenuActionContext,
    newAction: IContextActionData[]
  ): void {
    context.state.contextMenu.map(m => m.actions).map(m => newAction.concat(m))
  },
  /**
     * TODO: Verify tableName params to change in constant
     * @param {number} recordId
     * @param {string} recordUuid
     */
  listDocumentActionStatus(
    context: ContextMenuActionContext,
    payload: {
            tableName: string
            recordId: number
            recordUuid: string
            documentAction: string
            documentStatus: string
        }
  ) {
    const { tableName, recordId, recordUuid, documentAction, documentStatus } = payload
    return new Promise(resolve => {
      requestListDocumentActions({
        tableName,
        recordId,
        recordUuid,
        documentAction,
        documentStatus,
        pageSize: 0,
        pageToken: ''
      })
        .then((responseDocumentActions: IListDocumentActionsResponse) => {
          const documentAction = {
            defaultDocumentAction:
                            responseDocumentActions.defaultDocumentAction,
            documentActionsList:
                            responseDocumentActions.documentActionsList,
            recordId,
            recordUuid
          }

          context.commit('listDocumentAction', documentAction)
          resolve(documentAction)
        })
        .catch(error => {
          console.warn(
                        `Error getting document action list. Code ${error.code}: ${error.message}.`
          )
        })
    })
  },
  listDocumentStatus(
    context: ContextMenuActionContext,
    payload: { tableName: string, recordId: number, recordUuid: string, documentAction: string, documentStatus: string }
  ) {
    const { tableName, recordUuid, recordId, documentStatus, documentAction } = payload
    return new Promise(resolve => {
      requestListDocumentStatuses({
        tableName,
        recordId,
        recordUuid,
        documentAction,
        documentStatus,
        pageSize: 0,
        pageToken: ''
      })
        .then((responseDocumentStatus: IListDocumentStatusesResponse) => {
          const documentStatus = {
            documentActionsList:
                            responseDocumentStatus.documentStatusesList,
            recordId,
            recordUuid
          }
          context.commit('addlistDocumentStatus', documentStatus)
          resolve(documentStatus)
        })
        .catch(error => {
          console.warn(
                        `Error getting document statuses list. Code ${error.code}: ${error.message}.`
          )
        })
    })
  }
}
