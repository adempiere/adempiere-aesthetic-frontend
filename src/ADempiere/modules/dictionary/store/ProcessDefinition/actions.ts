import { ActionContext, ActionTree } from 'vuex'
import {
  IProcessData,
  IProcessDataExtended,
  ProcessDefinitionState,
  requestProcessMetadata
} from '@/ADempiere/modules/dictionary'
import { RootState } from '@/ADempiere/shared/store/types'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import router from '@/router'
import { generateProcess } from '@/ADempiere/shared/utils/DictionaryUtils'
import language from '@/lang'

type ProcessDefinitionActionContext = ActionContext<
    ProcessDefinitionState,
    RootState
>
type ProcessDefinitionActionTree = ActionTree<ProcessDefinitionState, RootState>

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
          let printFormatsAvailable = []
          if (responseProcess.isReport) {
            printFormatsAvailable = await context.dispatch(
              'getListPrintFormats',
              {
                processUuid: containerUuid
              }
            )
          }

          const { processDefinition, actions } = generateProcess({
            processToGenerate: {
              ...responseProcess,
              printFormatsAvailable
            }
          })

          context.dispatch('addPanel', processDefinition)
          context.commit('addProcess', processDefinition)
          resolve(processDefinition)

          //  Add process menu
          context.dispatch('setContextMenu', {
            containerUuid,
            actions
          })
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

      context.dispatch('addPanel', processDefinition)
      context.commit('addProcess', processDefinition)
      resolve(processDefinition)

      //  Add process menu
      context.dispatch('setContextMenu', {
        containerUuid: processDefinition.uuid,
        actions
      })
    })
  }
}
