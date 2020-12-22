import { IRootState } from '@/store'
import { ActionTree, ActionContext } from 'vuex'
import {
  IPanelData,
  ITabDataExtended,
  ITabsSequenceData,
  IWindowDataExtended,
  WindowDefinitionState
} from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import language from '@/lang'
import { generateField } from '@/ADempiere/shared/utils/DictionaryUtils'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import {
  requestWindowMetadata,
  IWindowData,
  ITabData,
  IProcessData
} from '@/ADempiere/modules/dictionary'

import {
  IContextActionData,
  WindowProcessAsociatedAction,
  WindowTabAssociatedAction
} from '@/ADempiere/modules/window'
import {
  ActionContextName,
  ActionContextType,
  PanelContextType
} from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import store from '@/ADempiere/shared/store'
import {
  IAdditionalAttributesData,
  IFieldDataExtendedUtils
} from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { IFieldData } from '@/ADempiere/modules/field'
import { getFieldTemplate } from '@/ADempiere/shared/utils/lookupFactory'

type WindowDefinitionActionTree = ActionTree<WindowDefinitionState, IRootState>
type WindowDefinitionActionContext = ActionContext<
    WindowDefinitionState,
    IRootState
>

export const actions: WindowDefinitionActionTree = {
  /**
     * Get Window metadata from server
     * @param {string} windowUuid
     * @param {number} windowId
     * @param {object} routeToDelete, route to close in tagView when fail
     */
  getWindowFromServer(
    context: WindowDefinitionActionContext,
    payload: {
            windowUuid: string
            windowId: number
            routeToDelete: string
        }
  ) {
    const { windowUuid, windowId, routeToDelete } = payload
    return requestWindowMetadata({
      uuid: windowUuid,
      id: windowId
    })
      .then((responseWindow: IWindowData) => {
        const firstTabTableName: string =
                    responseWindow.tabs[0].tableName
        const firstTabUuid: string = responseWindow.tabs[0].uuid
        const tabsListParent: ITabDataExtended[] = []
        const tabsListChildren: ITabDataExtended[] = []

        const tabsSequence: ITabsSequenceData[] = []

        // indexes related to visualization
        let tabParentIndex = 0
        let tabChildrenIndex = 0
        // TODO Add source tab on the server for tabs Translation and Sort
        const tabs: ITabDataExtended[] = responseWindow.tabs
          .filter((itemTab: ITabData) => {
            if (itemTab.isSortTab) {
              // TODO: Add convert tab as process function
              tabsSequence.push({
                uuid: itemTab.uuid,
                id: itemTab.id,
                parentUuid: windowUuid,
                containerUuid: itemTab.uuid,
                parentTabUuid: itemTab.parentTabUuid,
                panelType: PanelContextType.Window,
                type: ActionContextType.Sequence,
                isSortTab: itemTab.isSortTab,
                name: itemTab.name,
                description: itemTab.description,
                tableName: itemTab.tableName,
                sortOrderColumnName:
                                    itemTab.sortOrderColumnName, // order column
                sortYesNoColumnName: itemTab.sortYesNoColumnName // included column
              })
            }
            // TODO: Add support to isAdvancedTab and isHasTree
            return !itemTab.isTranslationTab
          })
          .map(
            (
              tabItem: ITabData,
              index: number,
              list: ITabData[]
            ) => {
              // let tab = tabItem
              const tab: ITabDataExtended = {
                ...tabItem,
                containerUuid: tabItem.uuid,
                parentUuid: windowUuid,
                windowUuid,
                tabGroup: tabItem.fieldGroup,
                firstTabUuid,
                // relations
                isParentTab: Boolean(
                  firstTabTableName === tabItem.tableName
                ),
                // app properties
                isAssociatedTabSequence: false, // show modal with order tab
                isShowedRecordNavigation: !tabItem.isSingleRow,
                isLoadFieldsList: false,
                index // this index is not related to the index in which the tabs are displayed
              }

              // action is dispatch used in vuex
              let actions: IContextActionData[] = []
              actions.push(
                {
                  // action to set default values and enable fields not isUpdateable
                  name: language.t('window.newRecord'),
                  processName: language
                    .t('window.newRecord')
                    .toString(),
                  type: ActionContextType.DataAction,
                  action: ActionContextName.SetDefaultValues,
                  parentUuid: windowUuid,
                  disabled:
                                        !tab.isInsertRecord || tab.isReadOnly
                },
                {
                  // action to delete record selected
                  name: language.t('window.deleteRecord'),
                  processName: language
                    .t('window.deleteRecord')
                    .toString(),
                  type: ActionContextType.DataAction,
                  action: ActionContextName.DeleteEntity,
                  parentUuid: windowUuid,
                  disabled: tab.isReadOnly
                },
                {
                  // action to undo create, update, delete record
                  name: language.t('data.undo'),
                  processName: language
                    .t('data.undo')
                    .toString(),
                  type: ActionContextType.DataAction,
                  action: ActionContextName.UndoModifyData,
                  parentUuid: windowUuid,
                  disabled: false
                },
                {
                  name: language.t('data.lockRecord'),
                  processName: language
                    .t('data.lockRecord')
                    .toString(),
                  type: ActionContextType.DataAction,
                  action: ActionContextName.LockRecord,
                  disabled: false,
                  hidden: true,
                  tableName: '',
                  recordId: null
                },
                {
                  name: language.t('data.unlockRecord'),
                  processName: language
                    .t('data.unlockRecord')
                    .toString(),
                  type: ActionContextType.DataAction,
                  action: ActionContextName.UnlockRecord,
                  disabled: false,
                  hidden: true,
                  tableName: '',
                  recordId: null
                }
              )

              if (tab.isSortTab) {
                const tabParent:
                                    | ITabData
                                    | undefined = list.find(
                                      (itemTab: ITabData) =>
                                        itemTab.tableName === tab.tableName &&
                                        !itemTab.isSortTab
                                    )
                if (tabParent) {
                  tab.associatedTab = {
                    tabUuid: tabParent.uuid,
                    tabName: tabParent.name
                  }
                }
              } else {
                // add tabs sequence associated as process in tab source
                const orderTabs: ITabsSequenceData[] = tabsSequence.filter(
                  (itemTab: ITabsSequenceData) =>
                    itemTab.tableName === tab.tableName
                )
                let orderTabsActions: WindowTabAssociatedAction[] = []
                if (orderTabs.length) {
                  orderTabsActions = orderTabs.map(
                    (itemTab: ITabsSequenceData) => {
                      return {
                        ...itemTab,
                        // appication attributes
                        // tabAssociatedUuid: tab.uuid, // tab source
                        // tabAssociatedName: tab.name, // tab source
                        processName: '',
                        associatedTab: {
                          tabName: tab.name,
                          tabUuid: tab.uuid
                        },
                        action:
                                                    ActionContextName.OrderSequence,
                        panelType:
                                                    PanelContextType.Window,
                        type:
                                                    ActionContextType.Application
                      }
                    }
                  )
                  actions = actions.concat(orderTabsActions)
                  tab.isAssociatedTabSequence = true
                  tab.tabsOrder = orderTabsActions
                }
              }

              // get processess associated in tab
              if (tabItem.processes) {
                const processList: WindowProcessAsociatedAction[] = tabItem.processes.map(
                  (
                    processItem: IProcessData
                  ): WindowProcessAsociatedAction => {
                    // TODO: No list of parameters
                    // add process associated in vuex store
                    // dispatch('addProcessAssociated', {
                    //   processToGenerate: processItem,
                    //   containerUuidAssociated: tabItem.uuid
                    // })
                    return {
                      id: processItem.id,
                      uuid: processItem.uuid,
                      name: processItem.name,
                      type: ActionContextType.Process,
                      panelType: PanelContextType.Process,
                      description:
                                                processItem.description,
                      help: processItem.help,
                      isReport: processItem.isReport,
                      isDirectPrint:
                                                processItem.isDirectPrint,
                      action: ActionContextName.Empty, // Not Found
                      associated: {
                        containerUuid: tabItem.uuid,
                        panelType:
                                                    PanelContextType.Window,
                        parentUuid: windowUuid
                      }
                    }
                  }
                )
                actions = actions.concat(processList)
              }
              //  Add process menu
              context.dispatch('setContextMenu', {
                containerUuid: tab.uuid,
                actions
              })

              if (tab.isParentTab) {
                tab.tabParentIndex = tabParentIndex
                tabParentIndex++
                tabsListParent.push(tab)
                return tab
              }
              if (!tab.isSortTab) {
                tab.tabChildrenIndex = tabChildrenIndex
                tabChildrenIndex++
                tabsListChildren.push(tab)
              }
              return tab
            }
          )

        const newWindow: IWindowDataExtended = {
          ...responseWindow,
          tabsList: tabs,
          currentTab: tabsListParent[0],
          tabsListParent,
          tabsListChildren,
          // app attributes
          currentTabUuid: tabsListParent[0].uuid,
          firstTab: tabsListParent[0],
          firstTabUuid,
          windowIndex: context.state.windowIndex + 1,
          // App properties
          isShowedTabsChildren: Boolean(tabsListChildren.length),
          isShowedRecordNavigation: undefined,
          isShowedAdvancedQuery: false
        }
        context.commit('addWindow', newWindow)
        return newWindow
      })
      .catch(error => {
        // router.push({
        //   path: '/dashboard'
        // }, () => {})
        context.dispatch('tagsView/delView', routeToDelete)
        showMessage({
          message: language.t('login.unexpectedError').toString(),
          type: 'error'
        })
        console.warn(
                    `Dictionary Window (State Window) - Error ${error.code}: ${error.message}.`
        )
      })
  },
  getFieldsFromTab(
    context: WindowDefinitionActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            // tabId,
            panelType: PanelContextType
            tabMetadata: ITabData
            isAdvancedQuery: boolean
        }
  ) {
    payload.tabMetadata = payload.tabMetadata || {}
    payload.panelType = payload.panelType || PanelContextType.Window
    payload.isAdvancedQuery = payload.isAdvancedQuery || false

    const {
      parentUuid,
      containerUuid,
      panelType,
      isAdvancedQuery
    } = payload
    let { tabMetadata } = payload
    return new Promise(resolve => {
      if (!tabMetadata) {
        tabMetadata = store.getters.getTab(parentUuid, containerUuid)
      }

      const additionalAttributes: IAdditionalAttributesData = {
        parentUuid,
        containerUuid,
        isShowedFromUser: true,
        panelType,
        //
        tableName: tabMetadata.tableName, // @deprecated
        tabTableName: tabMetadata.tableName,
        tabQuery: tabMetadata.query,
        tabWhereClause: tabMetadata.whereClause,
        //
        isReadOnlyFromForm: false,
        isAdvancedQuery,
        isEvaluateValueChanges: isAdvancedQuery
      }

      let isWithUuidField = false // indicates it contains the uuid field
      let fieldLinkColumnName = ''

      //  Convert and add to app attributes
      const fieldsList: IFieldDataExtendedUtils[] = tabMetadata.fields.map(
        (fieldItem: IFieldData, index: number) => {
          const generatedField: IFieldDataExtendedUtils = generateField(
            {
              fieldToGenerate: fieldItem,
              moreAttributes: {
                ...additionalAttributes,
                fieldsListIndex: index
              }
            }
          )

          if (
            !isWithUuidField &&
                        generatedField.columnName === 'UUID'
          ) {
            isWithUuidField = true
          }

          if (generatedField.isParent) {
            fieldLinkColumnName = generatedField.columnName
          }

          return generatedField
        }
      )

      let isTabsChildren = false
      if (!isAdvancedQuery) {
        const window: IWindowDataExtended = store.getters.getWindow(
          parentUuid
        )
        isTabsChildren = Boolean(window.tabsListChildren.length)
      }

      if (!isWithUuidField) {
        const fieldUuid: IFieldDataExtendedUtils = <
                    IFieldDataExtendedUtils
                >getFieldTemplate({
                  ...additionalAttributes,
                  isShowedFromUser: false,
                  name: 'UUID',
                  columnName: 'UUID',
                  componentPath: 'FieldText'
                })
        fieldsList.push(fieldUuid)
      }

      // panel for save on store
      const panel: IPanelData = {
        ...tabMetadata,
        containerUuid,
        isAdvancedQuery,
        fieldLinkColumnName,
        fieldsList,
        panelType,
        // app attributes
        isLoadFieldsList: true,
        isShowedTotals: false,
        isTabsChildren // to delete records assiciated
      }

      context.dispatch('addPanel', panel)
      resolve(panel)

      context.dispatch('changeTabAttribute', {
        tab: tabMetadata,
        // replace if is 'table_'
        parentUuid,
        containerUuid,
        attributeName: 'isLoadFieldsList',
        attributeValue: true
      })
    })
  },
  setCurrentTab(
    context: WindowDefinitionActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            window: IWindowDataExtended
            tab: ITabData
        }
  ) {
    const { parentUuid, containerUuid } = payload
    let { window, tab } = payload
    if (!window) {
      window = context.getters.getWindow(parentUuid)
    }
    if (!tab) {
      tab = window.tabsList.find(
        (itemTab: ITabData) => itemTab.uuid === containerUuid
      )!
    }

    context.commit('setCurrentTab', {
      window,
      tab
    })
  },
  changeWindowAttribute(
    context: WindowDefinitionActionContext,
    payload: {
            parentUuid: string
            window: IWindowDataExtended
            attributeName: string
            attributeNameControl: string
            attributeValue: string
        }
  ) {
    const {
      parentUuid,
      attributeName,
      attributeNameControl,
      attributeValue
    } = payload
    let { window } = payload
    if (!window) {
      window = context.getters.getWindow(parentUuid)
    }

    context.commit('changeWindowAttribute', {
      parentUuid,
      window,
      attributeName,
      attributeNameControl,
      attributeValue
    })
  },
  changeTabAttribute(
    context: WindowDefinitionActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            tab: ITabData
            attributeName: string
            attributeNameControl: string
            attributeValue: string
        }
  ) {
    const {
      parentUuid,
      containerUuid,
      attributeValue,
      attributeNameControl,
      attributeName
    } = payload
    let { tab } = payload
    if (!tab) {
      tab = context.getters.getTab(parentUuid, containerUuid)
    }
    context.commit('changeTabAttribute', {
      tab,
      attributeName,
      attributeValue,
      attributeNameControl
    })
  }
}
