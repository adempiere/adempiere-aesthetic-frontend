import { ActionContext, ActionTree } from 'vuex'
import {
  IProcessData,
  IProcessDataExtended,
  ProcessDefinitionState,
  requestProcessMetadata
} from '@/ADempiere/modules/dictionary'
import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { generateProcess } from '@/ADempiere/shared/utils/DictionaryUtils'
import language from '@/ADempiere/shared/lang'
import { Namespaces } from '@/ADempiere/shared/utils/types'

type ProcessDefinitionActionContext = ActionContext<
    ProcessDefinitionState,
    IRootState
>
type ProcessDefinitionActionTree = ActionTree<ProcessDefinitionState, IRootState>

export const actions: ProcessDefinitionActionTree = {
  /**
     * Get Process/Report metadata from server
     * @param {string} containerUuid
     * @param {number} processId
     * @param {object} routeToDelete, route to close in tagView when fail
     */
  getProcessFromServer(
    context: ProcessDefinitionActionContext,
    payload: {
            containerUuid: string
            processId: number
            routeToDelete: string
        }
  ) {
    const { containerUuid, processId, routeToDelete } = payload
    return new Promise(resolve => {
      requestProcessMetadata({
        uuid: containerUuid,
        id: processId
      })
        .then(async(responseProcess: IProcessData) => {
          let printFormatsAvailable: any = []
          if (responseProcess.isReport) {
            printFormatsAvailable = await context.dispatch(
              Namespaces.Report + '/' + 'getListPrintFormats',
              {
                processUuid: containerUuid
              },
              { root: true }
            )
          }

          const cont = generateProcess({
            processToGenerate: {
              ...responseProcess,
              printFormatsAvailable
            }
          })

          const { processDefinition, actions } = cont
          context.dispatch(Namespaces.Panel + '/' + 'addPanel', processDefinition, { root: true })
          context.commit('addProcess', processDefinition)
          resolve(processDefinition)

          //  Add process menu
          context.dispatch(Namespaces.ContextMenu + '/' + 'setContextMenu', {
            containerUuid,
            actions
          }, { root: true })
        })
        .catch(error => {
          // router.push(
          //     {
          //         path: '/dashboard'
          //     },
          //     () => {}
          // )
          context.dispatch('tagsView/delView', routeToDelete)
          showMessage({
            message: language.t('login.unexpectedError').toString(),
            type: 'error'
          })
          console.warn(`Dictionary Process - Error ${error.message}.`)
        })
    })
  },
  /**
     * Add process associated in window or smart browser
     * @param {object} processToGenerate
     */
  addProcessAssociated(
    context: ProcessDefinitionActionContext,
    payload: {
            processToGenerate: IProcessDataExtended
        }
  ) {
    const { processToGenerate } = payload
    return new Promise(resolve => {
      const { processDefinition, actions } = generateProcess({
        processToGenerate
      })

      context.dispatch(Namespaces.Panel + '/' + 'addPanel', processDefinition)
      context.commit('addProcess', processDefinition)
      resolve(processDefinition)

      //  Add process menu
      context.dispatch(Namespaces.ContextMenu + '/' + 'setContextMenu', {
        containerUuid: processDefinition.uuid,
        actions
      }, { root: true })
    })
  }
}
