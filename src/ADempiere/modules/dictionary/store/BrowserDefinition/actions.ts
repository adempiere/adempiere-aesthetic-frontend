import { generateField } from '@/ADempiere/shared/utils/DictionaryUtils'
import { ActionContextName, ActionContextType, PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { IRootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import { requestBrowserMetadata } from '../../DictionaryService'
import { BrowserDefinitionState, IBrowserData, IBrowserDataExtended } from '../../DictionaryType'
import language from '@/ADempiere/shared/lang'
import { WindowProcessAsociatedAction } from '@/ADempiere/modules/window'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { Route } from 'vue-router'

type BrowserDefinitionActionTree = ActionTree<BrowserDefinitionState, IRootState>
type BrowserDefinitionActionContext = ActionContext<BrowserDefinitionState, IRootState>

export const actions: BrowserDefinitionActionTree = {
  /**
     * Get Smart Browser metadata from server
     * @param {string} containerUuid
     * @param {number} browserId
     * @param {object} routeToDelete, route to close in tagView when fail
     */
  getBrowserFromServer(context: BrowserDefinitionActionContext, payload: {
        containerUuid: string
        browserId: number
        routeToDelete: any
      }) {
    const { containerUuid, browserId, routeToDelete } = payload
    return new Promise(resolve => {
      requestBrowserMetadata({
        uuid: containerUuid,
        id: browserId
      })
        .then((browserResponse: IBrowserData) => {
          const panelType: PanelContextType = PanelContextType.Browser
          const additionalAttributes = {
            containerUuid,
            panelType,
            isEvaluateValueChanges: true
          }
          const {
            query,
            whereClause,
            process
          } = browserResponse

          //  Convert from gRPC
          const fieldsRangeList: IFieldDataExtendedUtils[] = []
          let isShowedCriteria = false
          let awaitForValues = 0
          let fieldsList = browserResponse.fields.map((fieldItem, index) => {
            const someAttributes = {
              ...additionalAttributes,
              fieldsListIndex: index
            }
            const field: IFieldDataExtendedUtils = generateField({
              fieldToGenerate: fieldItem,
              moreAttributes: someAttributes,
              isSOTrxMenu: routeToDelete.meta.isSalesTransaction
            })
            // Add new field if is range number
            if (field.isRange && field.componentPath === 'FieldNumber') {
              const fieldRange = generateField({
                fieldToGenerate: fieldItem,
                moreAttributes: someAttributes,
                typeRange: true
              })
              if (fieldRange.value) {
                fieldRange.isShowedFromUser = true
              }
              fieldsRangeList.push(fieldRange)
            }

            // Only isQueryCriteria fields with values, displayed in main panel
            if (field.isQueryCriteria) {
              if (field.isSQLValue) {
                isShowedCriteria = true
                field.isShowedFromUser = true
                awaitForValues++
              }
              if (query.includes(`@${field.columnName}@`) ||
                    query.includes(`@${field.columnName}_To@`) ||
                    whereClause.includes(`@${field.columnName}@`) ||
                    whereClause.includes(`@${field.columnName}_To@`)) {
                field.isMandatory = true
                field.isMandatoryFromLogic = true
                field.isShowedFromUser = true
              }

              if (field.value) {
                // isMandatory params to showed search criteria
                if (field.isMandatory || field.isMandatoryFromLogic) {
                  isShowedCriteria = true
                }
              } else {
                // with value
                field.isShowedFromUser = true
              }
            }

            return field
          })
          fieldsList = fieldsList.concat(fieldsRangeList)

          // Panel for save on store
          const newBrowser: IBrowserDataExtended = {
            ...browserResponse,
            containerUuid,
            fieldsList,
            panelType,
            // app attributes
            awaitForValues, // control to values
            awaitForValuesToQuery: awaitForValues, // get values from request search
            isShowedCriteria,
            isShowedTotals: true
          }

          context.commit('addBrowser', newBrowser)
          context.dispatch(Namespaces.Panel + '/' + 'addPanel', newBrowser, { root: true })

          resolve(newBrowser)

          // Convert from gRPC process list
          const actions: WindowProcessAsociatedAction[] = []
          if (process) {
            actions.push({
              type: ActionContextType.Process,
              panelType: PanelContextType.Process,
              uuid: process.uuid,
              name: process.name,
              description: process.description,
              isReport: process.isReport,
              isDirectPrint: process.isDirectPrint,
              associated: {
                containerUuid: containerUuid,
                panelType: panelType
              },
              //
              action: ActionContextName.Empty,
              help: '',
              id: 0
              // containerUuidAssociated: containerUuid,
              // panelTypeAssociated: panelType
            })
            // TODO: No list of parameters
            // // add process associated in vuex store
            // dispatch('addProcessAssociated', {
            //   processToGenerate: process,
            //   containerUuidAssociated: containerUuid
            // })
          }
          // Add process menu
          context.dispatch(Namespaces.ContextMenu + '/' + 'setContextMenu', {
            containerUuid,
            actions
          }, { root: true })
        })
        .catch(error => {
          //   router.push({
          //     path: '/dashboard'
          //   }, () => {})
          context.dispatch('tagsView/delView', routeToDelete)
          showMessage({
            message: language.t('login.unexpectedError').toString(),
            type: 'error'
          })
          console.warn(`Dictionary Browser - Error ${error.code}: ${error.message}.`)
        })
    })
  },
  changeBrowserAttribute(context: BrowserDefinitionActionContext, payload: {
        containerUuid: string
        browser?: any
        attributeName: string
        attributeNameControl?: any
        attributeValue: any
      }): void {
    const { containerUuid, attributeName, attributeNameControl, attributeValue } = payload
    let { browser } = payload
    if (!browser) {
      browser = context.getters.getBrowser(containerUuid)
    }
    context.commit('changeBrowserAttribute', {
      browser,
      attributeName,
      attributeValue,
      attributeNameControl
    })
  }
}
