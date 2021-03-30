import {
  IPanelDataExtended,
  ITabDataExtended
} from '@/ADempiere/modules/dictionary'
import { IReferenceData } from '@/ADempiere/modules/field'
import { IRootState } from '@/store'
import { parseContext } from '@/ADempiere/shared/utils/contextUtils'
import { fieldIsDisplayed } from '@/ADempiere/shared/utils/DictionaryUtils'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionTree, ActionContext } from 'vuex'
import {
  IContextInfoValuesExtends,
  IDataLog,
  IEntityData,
  IRecordObjectListFromCriteria,
  IRecordSelectionData,
  IReferenceDataExtended,
  IReferenceListDataExtended,
  IWindowOldRoute,
  KeyValueData,
  WindowState
} from '@/ADempiere/modules/persistence/PersistenceType'
import language from '@/ADempiere/shared/lang'
import { typeValue } from '@/ADempiere/shared/utils/valueUtils'
import {
  IContextInfoValuesResponse,
  IReferenceListData,
  requestReferencesList
} from '@/ADempiere/modules/ui'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import {
  requestCreateEntity,
  requestDeleteEntity,
  requestUpdateEntity,
  rollbackEntity
} from '@/ADempiere/modules/persistence/PersistenceService'
import { IValueData } from '@/ADempiere/modules/core'
import { convertObjectToKeyValue } from '@/ADempiere/shared/utils/valueFormat'
import { Route } from 'vue-router'
import { LOG_COLUMNS_NAME_LIST } from '@/ADempiere/shared/utils/dataUtils'
import router from '@/router'

type WindowActionTree = ActionTree<WindowState, IRootState>
type WindowActionContext = ActionContext<WindowState, IRootState>

export const actions: WindowActionTree = {
  tableActionPerformed(
    context: WindowActionContext,
    payload: {
            field: IFieldDataExtendedUtils
        }
  ) {
    const { field } = payload
    if (fieldIsDisplayed(field) && field.isShowedFromUser) {
      // change action to advanced query on field value is changed in this panel
      if (context.rootState.route.query.action !== 'advancedQuery') {
        router.push({
          query: {
            ...router.currentRoute.query,
            action: 'advancedQuery'
          }
        })
      }
      const {
        parentUuid,
        containerUuid,
        tabTableName,
        tabQuery,
        tabWhereClause
      } = field
      let parsedQuery: string | undefined = tabQuery
      if (parsedQuery && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid: parentUuid!,
          containerUuid,
          value: tabQuery,
          isBooleanToString: true
        }).value
      }

      let parsedWhereClause: string | undefined = tabWhereClause
      if (parsedWhereClause && parsedWhereClause.includes('@')) {
        parsedWhereClause = parseContext({
          parentUuid: parentUuid!,
          containerUuid,
          value: tabWhereClause,
          isBooleanToString: true
        }).value
      }

      const conditionsList = context.rootGetters[Namespaces.Panel + '/' + 'getParametersToServer']({
        containerUuid,
        isEvaluateMandatory: false
      })

      context
        .dispatch(Namespaces.BusinessData + '/' + 'getObjectListFromCriteria', {
          parentUuid,
          containerUuid,
          tableName: tabTableName,
          query: parsedQuery,
          whereClause: parsedWhereClause,
          conditionsList
        }, { root: true })
        .catch(error => {
          console.warn(
            'Error getting Advanced Query (notifyFieldChange):',
            error.message + '. Code: ',
            error.code
          )
        })
    }
  },
  windowActionPerformed(
    context: WindowActionContext,
    payload: {
            field: IFieldDataExtendedUtils
            value: any // TODO: Verify Type
        }
  ) {
    const { field } = payload
    let { value } = payload
    const { parentUuid, containerUuid, columnName } = payload.field
    //  get value from store
    if (!value) {
      value = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
        parentUuid,
        containerUuid,
        columnName
      })
    }
    return new Promise((resolve, reject) => {
      // request callouts
      context
        .dispatch(Namespaces.CallOutControl + '/' + 'runCallout', {
          parentUuid,
          containerUuid,
          tableName: field.tableName,
          columnName,
          callout: field.callout,
          oldValue: field.oldValue,
          valueType: field.valueType,
          value
        }, { root: true })
        .then(() => {
          //  Context Info
          context.dispatch('reloadContextInfo', {
            field
          })
          //  Apply actions for server
          context
            .dispatch('runServerAction', {
              field,
              value
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    })
  },
  runServerAction(
    context: WindowActionContext,
    payload: {
            field: IFieldDataExtendedUtils
            value: any // TODO: Verify Type
        }
  ) {
    const { field, value } = payload
    return new Promise((resolve, reject) => {
      // For change options
      if (fieldIsDisplayed(field)) {
        context.commit(Namespaces.Persistence + '/' + 'addChangeToPersistenceQueue', {
          ...field,
          value
        }, { root: true })
        const emptyFields = context.rootGetters[Namespaces.Panel + '/' + 'getFieldsListEmptyMandatory'](
          {
            containerUuid: field.containerUuid,
            formatReturn: false
          }
        ).filter((itemField: any) => {
          return !LOG_COLUMNS_NAME_LIST.includes(itemField.columnName)
        }).map((itemField: any) => {
          return itemField.name
        })

        if (emptyFields) {
          showMessage({
            message:
                            language.t('notifications.mandatoryFieldMissing') +
                            emptyFields,
            type: 'info'
          })
        } else {
          const recordUuid = context.rootGetters[Namespaces.FieldValue + '/' + 'getUuidOfContainer'](
            field.containerUuid
          )
          context
            .dispatch(Namespaces.Persistence + '/' + 'flushPersistenceQueue', {
              containerUuid: field.containerUuid,
              tableName: field.tableName,
              recordUuid
            }, { root: true })
            .then(response => {
              resolve(response)
              if (!recordUuid) {
                const oldRoute: Route = router.currentRoute
                // const oldRoute: Route = router.app.$route // ._route
                router.push(
                  {
                    name: oldRoute.name!,
                    params: {
                      ...oldRoute.params
                    },
                    query: {
                      ...oldRoute.query,
                      action: response.uuid
                    }
                  }
                )
              }
            })
            .catch(error => reject(error))
        }
      }
    })
  },
  reloadContextInfo(
    context: WindowActionContext,
    payload: {
            field: IFieldDataExtendedUtils
        }
  ) {
    const { field } = payload
    //  get value from store
    const value = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
      parentUuid: field.parentUuid,
      containerUuid: field.containerUuid,
      columnName: field.columnName
    })
    // request context info field
    if (value && field.contextInfo && field.contextInfo.sqlStatement) {
      let isSQL = false
      let sqlStatement: string = field.contextInfo.sqlStatement
      if (sqlStatement.includes('@')) {
        if (sqlStatement.includes('@SQL=')) {
          isSQL = true
        }
        const sqlStatement2 = parseContext({
          parentUuid: field.parentUuid!,
          containerUuid: field.containerUuid,
          columnName: field.columnName,
          value: sqlStatement,
          isSQL
        }).value
        if (isSQL && typeValue(sqlStatement) === 'OBJECT') {
          sqlStatement = sqlStatement2.query
        }
      }
      const contextInfo: Promise<
                IContextInfoValuesExtends | IContextInfoValuesResponse
            > = context.dispatch(Namespaces.BusinessData + '/' + 'getContextInfoValueFromServer', {
              parentUuid: field.parentUuid,
              containerUuid: field.containerUuid,
              contextInfoId: field.contextInfo.id,
              contextInfoUuid: field.contextInfo.uuid,
              columnName: field.columnName,
              sqlStatement
            }, { root: true })

      contextInfo.then(response => {
        if (response && response.messageText) {
          field.contextInfo.isActive = true
                    field.contextInfo.messageText!.messageText =
                        response.messageText
                    field.contextInfo.messageText!.messageTip =
                        response.messageTip
        }
      })

      // if (contextInfo && contextInfo.messageText) {
      //   field.contextInfo.isActive = true
      //   field.contextInfo.messageText!.messageText = contextInfo.messageText
      //   field.contextInfo.messageText!.messageTip = contextInfo.messageTip
      // }
    }
  },
  undoPanelToNew(
    context: WindowActionContext,
    data: { containerUuid: string }
  ) {
    const { containerUuid } = data
    const oldAttributes: IKeyValueObject = context.rootGetters[Namespaces.Panel + '/' + 'getColumnNamesAndValues'](
      {
        containerUuid,
        propertyName: 'oldValue',
        isObjectReturn: true,
        isAddDisplayColumn: true
      }
    )
    context.dispatch(Namespaces.Panel + '/' + 'notifyPanelChange', {
      containerUuid,
      newValues: oldAttributes
    }, { root: true })
  },
  // createNewEntity({ commit, dispatch, getters, rootGetters }, {
  //   parentUuid,
  //   containerUuid
  // }) {
  //   return new Promise((resolve, reject) => {
  //     // exists some call to create new record with container uuid
  //     if (getters.getInCreate(containerUuid)) {
  //       return reject({
  //         error: 0,
  //         message: `In this panel (${containerUuid}) is a create new record in progress`
  //       })
  //     }
  //
  //     const { tableName, fieldsList } = rootGetters.getPanel(containerUuid)
  //     // delete key from attributes
  //     const attributesList = rootGetters.getColumnNamesAndValues({
  //       containerUuid,
  //       propertyName: 'value',
  //       isEvaluateValues: true,
  //       isAddDisplayColumn: false
  //     })
  //     commit('addInCreate', {
  //       containerUuid,
  //       tableName,
  //       attributesList
  //     })
  //     requestCreateEntity({
  //       tableName,
  //       attributesList
  //     })
  //       .then(createEntityResponse => {
  //         const newValues = createEntityResponse.values
  //         attributesList.forEach(element => {
  //           if (element.columnName.includes('DisplayColumn')) {
  //             newValues[element.columnName] = element.value
  //           }
  //         })
  //
  //         showMessage({
  //           message: language.t('data.createRecordSuccessful'),
  //           type: 'success'
  //         })
  //
  //         // update fields with new values
  //         dispatch('notifyPanelChange', {
  //           parentUuid,
  //           containerUuid,
  //           newValues,
  //           isSendToServer: false
  //         })
  //         dispatch('addNewRow', {
  //           parentUuid,
  //           containerUuid,
  //           isPanelValues: true,
  //           isEdit: false
  //         })
  //
  //         // set data log to undo action
  //         const fieldId = fieldsList.find(itemField => itemField.isKey)
  //         dispatch('setDataLog', {
  //           containerUuid,
  //           tableName,
  //           recordId: fieldId.value, // TODO: Verify performance with tableName_ID
  //           recordUuid: newValues.UUID,
  //           eventType: 'INSERT'
  //         })
  //
  //         const oldRoute = router.app._route
  //         router.push({
  //           name: oldRoute.name,
  //           params: {
  //             ...oldRoute.params
  //           },
  //           query: {
  //             ...oldRoute.query,
  //             action: createEntityResponse.uuid
  //           }
  //         })
  //         dispatch('tagsView/delView', oldRoute, true)
  //
  //         resolve({
  //           data: newValues,
  //           recordUuid: createEntityResponse.uuid,
  //           recordId: createEntityResponse.id,
  //           tableName: createEntityResponse.tableName
  //         })
  //       })
  //       .catch(error => {
  //         showMessage({
  //           message: error.message,
  //           type: 'error'
  //         })
  //         console.warn(`Create Entity error: ${error.message}.`)
  //         reject(error)
  //       })
  //       .finally(() => {
  //         commit('deleteInCreate', {
  //           containerUuid,
  //           tableName,
  //           attributesList
  //         })
  //       })
  //   })
  // },
  createEntityFromTable(
    context: WindowActionContext,
    data: {
            parentUuid: string
            containerUuid: string
            row: IKeyValueObject
        }
  ):
        | Promise<void | IEntityData>
        | {
              error: number
              message: string
          } {
    const { containerUuid, parentUuid } = data
    const { row } = data
    // exists some call to create new record with container uuid
    if (context.getters.getInCreate(containerUuid)) {
      return {
        error: 0,
        message: `In this panel (${containerUuid}) is a create new record in progress.`
      }
    }
    const { tableName, isParentTab } = <IPanelDataExtended>(
            context.rootGetters[Namespaces.Panel + '/' + 'getPanel'](containerUuid)
        )

    // TODO: Add support to Binary columns (BinaryData)
    const columnsToDontSend: string[] = [
      'BinaryData',
      'isEdit',
      'isNew',
      'isSendServer'
    ]

    // TODO: Evaluate peformance without filter using delete(prop) before convert object to array
    // attributes or fields
    const fieldsList = <IFieldDataExtendedUtils[]>(
            context.getters.getFieldsListFromPanel(containerUuid)
        )
    const attributesList: KeyValueData<IValueData>[] = []
    fieldsList.forEach((itemAttribute: IFieldDataExtendedUtils) => {
      if (
        columnsToDontSend.includes(itemAttribute.columnName) ||
                itemAttribute.columnName.includes('DisplayColumn')
      ) {
        return false
      }
      if (!row[itemAttribute.columnName]) {
        return false
      }

      attributesList.push({
        value: row[itemAttribute.columnName],
        key: itemAttribute.columnName,
        valueType: itemAttribute.valueType
      })
    })

    context.commit('addInCreate', {
      containerUuid,
      tableName,
      attributesList
    })

    let isError = false
    return requestCreateEntity({
      tableName,
      attributesList
    })
      .then((createEntityResponse: IEntityData) => {
        showMessage({
          message: language.t('data.createRecordSuccessful').toString(),
          type: 'success'
        })
        if (isParentTab) {
          // redirect to create new record
          const oldRoute: Route = context.rootState.route
          router.push(
            {
              name: oldRoute.name!,
              params: {
                ...oldRoute.params
              },
              query: {
                ...oldRoute.query,
                action: createEntityResponse.uuid
              }
            }
          )
        }
        return {
          // data: createEntityResponse.attributes, // It is Boilerplate
          ...createEntityResponse
        }
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error'
        })
        console.warn(
                    `Create Entity Table Error ${error.code}: ${error.message}.`
        )
        isError = true
      })
      .finally(() => {
        if (isError) {
          context.dispatch(Namespaces.BusinessData + '/' + 'addNewRow', {
            containerUuid,
            row
          }, { root: true })
        } else {
          // refresh record list
          context
            .dispatch('getDataListTab', {
              parentUuid,
              containerUuid
            })
            .catch(error => {
              console.warn(
                                `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
              )
            })
        }
        context.commit('deleteInCreate', {
          containerUuid,
          tableName,
          attributesList
        })
      })
  },
  // updateCurrentEntity({ dispatch, rootGetters }, {
  //   containerUuid,
  //   recordUuid = null
  // }) {
  //   const panel = rootGetters.getPanel(containerUuid)
  //   if (!recordUuid) {
  //     recordUuid = rootGetters.getUuidOfContainer(containerUuid)
  //   }
  //
  //   // TODO: Add support to Binary columns (BinaryData)
  //   const columnsToDontSend = ['Account_Acct']
  //
  //   // attributes or fields
  //   let finalAttributes = rootGetters.getColumnNamesAndValues({
  //     containerUuid: containerUuid,
  //     isEvaluatedChangedValue: true
  //   })
  //
  //   finalAttributes = finalAttributes.filter(itemAttribute => {
  //     if (columnsToDontSend.includes(itemAttribute.columnName) || itemAttribute.columnName.includes('DisplayColumn')) {
  //       return false
  //     }
  //     const field = panel.fieldsList.find(itemField => itemField.columnName === itemAttribute.columnName)
  //     if (!field || !field.isUpdateable || !field.isDisplayed) {
  //       return false
  //     }
  //     return true
  //   })
  //   return requestUpdateEntity({
  //     tableName: panel.tableName,
  //     recordUuid,
  //     attributesList: finalAttributes
  //   })
  //     .then(updateEntityResponse => {
  //       const newValues = updateEntityResponse.values
  //       // set data log to undo action
  //       // TODO: Verify performance with tableName_ID
  //       let recordId = updateEntityResponse.id
  //       if (isEmptyValue(recordId)) {
  //         recordId = newValues[`${panel.tableName}_ID`]
  //       }
  //       if (isEmptyValue(recordId)) {
  //         const fieldId = panel.fieldsList.find(itemField => itemField.isKey)
  //         recordId = fieldId.value
  //       }
  //
  //       if (isEmptyValue(recordUuid)) {
  //         recordUuid = updateEntityResponse.uuid
  //       }
  //       if (isEmptyValue(recordUuid)) {
  //         recordUuid = newValues.UUID
  //       }
  //
  //       dispatch('setDataLog', {
  //         containerUuid,
  //         tableName: panel.tableName,
  //         recordId,
  //         recordUuid,
  //         eventType: 'UPDATE'
  //       })
  //       if (rootGetters.getShowContainerInfo) {
  //         dispatch('listRecordLogs', {
  //           tableName: panel.tableName,
  //           recordId
  //         })
  //       }
  //       return newValues
  //     })
  //     .catch(error => {
  //       showMessage({
  //         message: error.message,
  //         type: 'error'
  //       })
  //       console.warn(`Update Entity Error ${error.code}: ${error.message}`)
  //     })
  // },
  updateCurrentEntityFromTable(
    context: WindowActionContext,
    payload: { containerUuid: string, row: IKeyValueObject<IValueData> }
  ): Promise<void | IEntityData> {
    const { containerUuid, row } = payload
    const { tableName, fieldsList } = <IPanelDataExtended>(
            context.rootGetters[Namespaces.Panel + '/' + 'getPanel'](containerUuid)
        )

    // TODO: Add support to Binary columns (BinaryData)
    const columnsToDontSend: string[] = [
      'BinaryData',
      'isEdit',
      'isNew',
      'isSendServer'
    ]
    columnsToDontSend.forEach((appAttribute: string) => {
      delete row[appAttribute]
    })

    // attributes or fields
    let finalAttributes: KeyValueData<
            IValueData
        >[] = convertObjectToKeyValue<IValueData>(row)

    finalAttributes = finalAttributes.filter(
      (itemAttribute: KeyValueData<IValueData>) => {
        const { key } = itemAttribute
        if (key.includes('DisplayColumn')) {
          return false
        }

        const field:
                    | IFieldDataExtendedUtils
                    | undefined = fieldsList.find(
                      (itemField: IFieldDataExtendedUtils) =>
                        itemField.columnName === key
                    )
        if (!field || !field.isUpdateable || !field.isDisplayed) {
          return false
        }
        return true
      }
    )

    return requestUpdateEntity({
      tableName,
      uuid: <string>row.UUID,
      attributes: finalAttributes
      // attributesList: finalAttributes
    })
      .then((response: IEntityData) => {
        return response
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error'
        })
        console.warn(
                    `Update Entity Table Error ${error.code}: ${error.message}.`
        )
      })
  },
  /**
     * Update record after run process associated with window
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {object} tab
     */
  updateRecordAfterRunProcess(
    context: WindowActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            tab: ITabDataExtended
        }
  ): void {
    const { parentUuid, containerUuid, tab } = payload
    const recordUuid = <string>(
            context.rootGetters[Namespaces.FieldValue + '/' + 'getUuidOfContainer'](containerUuid)
        )
        // get new values
    context
      .dispatch(Namespaces.BusinessData + '/' + 'getEntity', {
        parentUuid,
        containerUuid,
        tableName: tab.tableName,
        recordUuid
      }, { root: true })
      .then((response: KeyValueData<IValueData>[]) => {
        // update panel
        if (tab.isParentTab) {
          context.dispatch(Namespaces.Panel + '/' + 'notifyPanelChange', {
            parentUuid,
            containerUuid,
            newValues: response,
            isSendCallout: false,
            isSendToServer: false
          }, { root: true })
        }
        // update row in table
        context.dispatch(Namespaces.BusinessData + '/' + 'notifyRowTableChange', {
          parentUuid,
          containerUuid,
          row: response,
          isEdit: false
        }, { root: true })
      })
  },
  deleteEntity(
    context: WindowActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            recordUuid?: string
            recordId?: number
            row: IKeyValueObject<IValueData>
        }
  ) {
    const { parentUuid, containerUuid, row } = payload
    let { recordUuid, recordId } = payload

    return new Promise(resolve => {
      const panel = <IPanelDataExtended>(
                context.rootGetters[Namespaces.Panel + '/' + 'getPanel'](containerUuid)
            )
      if (row) {
        recordUuid = <string>row.UUID
        recordId = <number>row[`${panel.tableName}_ID`]
      }

      requestDeleteEntity({
        tableName: panel.tableName,
        uuid: recordUuid!,
        id: recordId
      })
        .then((responseDeleteEntity: any) => {
          // refresh record list
          context
            .dispatch('getDataListTab', {
              parentUuid,
              containerUuid
            })
            .then(responseDataList => {
              if (panel.isParentTab) {
                // if response is void, go to new record
                if (responseDataList.length <= 0) {
                  context.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
                    parentUuid,
                    containerUuid,
                    panelType: 'window',
                    isNewRecord: true
                  }, { root: true })
                } else {
                  const oldRoute: Route = context.rootState.route
                  // else display first record of table in panel
                  router.push(
                    {
                      name: oldRoute.name!,
                      params: {
                        ...oldRoute.params
                      },
                      query: {
                        ...oldRoute.query,
                        action: responseDataList[0].UUID
                      }
                    }
                  )
                }
              }
            })
            .catch(error => {
              console.warn(
                                `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
              )
            })
          showMessage({
            message: language.t('data.deleteRecordSuccessful').toString(),
            type: 'success'
          })

          if (!recordId) {
            // TODO: Verify performance with tableName_ID
            const fieldId:
                            | IFieldDataExtendedUtils
                            | undefined = panel.fieldsList.find(
                              (itemField: IFieldDataExtendedUtils) =>
                                itemField.isKey
                            )
            if (fieldId) {
              // recordId = fieldId.value
              recordId = Number(fieldId.value)
            }
          }
          // set data log to undo action
          context.dispatch('setDataLog', {
            containerUuid,
            tableName: panel.tableName,
            recordId,
            recordUuid,
            eventType: 'DELETE'
          })

          resolve(responseDeleteEntity)
        })
        .catch(error => {
          showMessage({
            message: language.t('data.deleteRecordError').toString(),
            type: 'error'
          })
          console.warn(
                        `Delete Entity - Error ${error.message}, Code: ${error.code}.`
          )
        })
    })
  },
  /**
     * Delete selection records in table
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} tableName
     * @param {boolean} isParentTab
     */
  deleteSelectionDataList(
    context: WindowActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            tableName?: string
            isParentTab?: boolean
        }
  ): void {
    let { tableName = payload.tableName || '', isParentTab } = payload
    const { parentUuid, containerUuid } = payload

    if (!tableName || !isParentTab) {
      const tab: ITabDataExtended = <ITabDataExtended>(
                context.rootGetters[Namespaces.WindowDefinition + '/' + 'getTab'](parentUuid, containerUuid)
            )
      tableName = tab.tableName
      isParentTab = tab.isParentTab
    }
    const allData: IRecordSelectionData = <IRecordSelectionData>(
            context.rootGetters[Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'](containerUuid)
        )
    let selectionLength = allData.selection.length

    allData.selection.forEach((record, index) => {
      // validate if the registry row has no uuid before sending to the server
      if (!record.UUID) {
        selectionLength = selectionLength - 1
        console.warn(
          'This row does not contain a record with UUID',
          record
        )
        // refresh record list
        context
          .dispatch('getDataListTab', {
            parentUuid,
            containerUuid
          })
          .catch(error => {
            console.warn(
                            `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
            )
          })
        return
      }
      requestDeleteEntity({
        tableName,
        uuid: record.UUID
      }).then(() => {
        if (isParentTab) {
          // redirect to create new record
          const oldRoute: Route = context.rootState.route
          if (record.UUID === oldRoute.query.action) {
            router.push(
              {
                name: oldRoute.name!,
                params: {
                  ...oldRoute.params
                },
                query: {
                  ...oldRoute.query,
                  action: 'create-new'
                }
              }
            )
            // clear fields with default values
            context.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
              parentUuid,
              containerUuid
            }, { root: true })
            // delete view with uuid record delete
            // context.dispatch('tagsView/delView', oldRoute, true)
            context.dispatch('tagsView/delView', oldRoute, {
              root: true
            })
          }
        }

        if (index + 1 >= selectionLength) {
          // refresh record list
          context
            .dispatch('getDataListTab', {
              parentUuid,
              containerUuid
            })
            .catch(error => {
              console.warn(
                                `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
              )
            })
          showMessage({
            message: language.t('data.deleteRecordSuccessful').toString(),
            type: 'success'
          })
        }
      })
    })
  },
  undoModifyData(
    context: WindowActionContext,
    payload: { containerUuid: string, recordUuid: string }
  ) {
    const { containerUuid, recordUuid } = payload
    return rollbackEntity(
      context.getters.getDataLog(containerUuid, recordUuid)
    )
      .then(response => {
        return response
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error'
        })
        console.warn(
                    `Rollback Entity error: ${error.message}. Code: ${error.code}.`
        )
      })
  },
  setDataLog(context: WindowActionContext, payload: IDataLog): void {
    const {
      containerUuid,
      tableName,
      recordUuid,
      recordId,
      eventType
    } = payload
    context.commit('setDataLog', {
      containerUuid,
      tableName,
      recordId,
      recordUuid,
      eventType
    })
  },
  /**
     * Get data to table in tab
     * @param {string}  parentUuid, window to search record data
     * @param {string}  containerUuid, tab to search record data
     * @param {string}  recordUuid, uuid to search
     * @param {boolean} isRefreshPanel, if main panel is updated with new response data
     * @param {boolean} isLoadAllRecords, if main panel is updated with new response data
     */
  getDataListTab(
    context: WindowActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            recordUuid?: string
            referenceWhereClause?: string
            columnName?: string
            value?: any
            criteria?: any
            isAddRecord?: boolean
            isLoadAllRecords?: boolean
            isRefreshPanel?: boolean
            isReference?: boolean
            isShowNotification?: boolean
        }
  ) {
    payload.referenceWhereClause = payload.referenceWhereClause || ''
    payload.isAddRecord = payload.isAddRecord || false
    payload.isLoadAllRecords = payload.isLoadAllRecords || false
    payload.isRefreshPanel = payload.isRefreshPanel || false
    payload.isReference = payload.isReference || false
    payload.isShowNotification = payload.isShowNotification || true

    const {
      parentUuid,
      containerUuid,
      isReference,
      recordUuid,
      referenceWhereClause,
      columnName,
      value,
      criteria,
      isLoadAllRecords,
      isRefreshPanel,
      isShowNotification
    } = payload
    let { isAddRecord } = payload
    const tab: ITabDataExtended = <ITabDataExtended>(
            context.rootGetters[Namespaces.WindowDefinition + '/' + 'getTab'](parentUuid, containerUuid)
        )

    let parsedQuery: string = tab.query
    if (parsedQuery && parsedQuery.includes('@')) {
      parsedQuery = parseContext({
        parentUuid,
        containerUuid,
        value: tab.query,
        isBooleanToString: true
      }).value
    }

    let parsedWhereClause: string = tab.whereClause
    if (parsedWhereClause && parsedWhereClause.includes('@')) {
      parsedWhereClause = parseContext({
        parentUuid,
        containerUuid,
        value: tab.whereClause,
        isBooleanToString: true
      }).value
    }

    if (isReference) {
      if (parsedWhereClause) {
        parsedWhereClause += ` AND ${referenceWhereClause}`
      } else {
        parsedWhereClause += referenceWhereClause
      }
    }

    if (criteria) {
      if (parsedWhereClause) {
        parsedWhereClause += ` AND ${criteria.whereClause}`
      } else {
        parsedWhereClause += criteria.whereClause
      }
    }

    const conditionsList: KeyValueData[] = []
    // TODO: evaluate if overwrite values to conditions
    if (!isLoadAllRecords && tab.isParentTab && tab.tableName && value) {
      conditionsList.push({
        // columnName,
        key: columnName!,
        value
      })
    }
    return context
      .dispatch(Namespaces.BusinessData + '/' + 'getObjectListFromCriteria', {
        parentUuid,
        containerUuid,
        tableName: tab.tableName,
        query: parsedQuery,
        whereClause: parsedWhereClause,
        orderByClause: tab.orderByClause,
        conditionsList,
        isParentTab: tab.isParentTab,
        isAddRecord,
        isShowNotification
      }, { root: true })
      .then((response: IRecordObjectListFromCriteria[]) => {
        if (
          isRefreshPanel &&
                    recordUuid &&
                    recordUuid !== 'create-new'
        ) {
          const newValues:
                        | IRecordObjectListFromCriteria
                        | undefined = response.find(
                        // (itemData) => itemData.UUID === recordUuid
                          (itemData: IRecordObjectListFromCriteria) =>
                            itemData.defaultValues.UUID === recordUuid
                        )
          if (newValues) {
            // update fields with values obtained from the server
            context.dispatch(Namespaces.Panel + '/' + 'notifyPanelChange', {
              parentUuid,
              containerUuid,
              newValues,
              isSendCallout: false,
              isSendToServer: false
            }, { root: true })
          } else {
            // this record is missing (Deleted or the query does not include it)
            context.dispatch(Namespaces.Panel + '/' + 'setDefaultValues', {
              parentUuid,
              containerUuid
            }, { root: true })
          }
        }
        return response
      })
      .catch(error => {
        return error
      })
      .finally(() => {
        const currentData: IRecordSelectionData = <IRecordSelectionData>context.rootGetters[Namespaces.BusinessData + '/' + 'getDataRecordAndSelection'](containerUuid)
        const {
          originalNextPageToken,
          pageNumber,
          recordCount
        } = currentData
        let nextPage = pageNumber
        const isAdd = isAddRecord
        if (originalNextPageToken && isAddRecord) {
          const pageInToken = originalNextPageToken.substring(
            originalNextPageToken.length - 2
          )
          if (pageInToken === '-1') {
            isAddRecord = false
          }
          if (pageNumber === 1 && recordCount > 50) {
            nextPage = nextPage + 1
            isAddRecord = true
          }
        } else {
          isAddRecord = false
        }
        if (recordCount <= 50) {
          isAddRecord = false
        }

        if (isAddRecord) {
          context.dispatch(Namespaces.BusinessData + '/' + 'setPageNumber', {
            parentUuid,
            containerUuid,
            pageNumber: nextPage,
            panelType: 'window',
            isAddRecord,
            isShowNotification: false
          }, { root: true })
        }
        if (isAdd && isAdd !== isAddRecord) {
          if (tab.isSortTab) {
            const record: any[] = context.rootGetters[Namespaces.BusinessData + '/' + 'getDataRecordsList'](
              containerUuid
            )
            const recordToTab = record
              .map((itemRecord: any) => {
                return {
                  ...itemRecord
                }
              })
              .sort((itemA, itemB) => {
                return (
                  itemA[tab.sortOrderColumnName] -
                                    itemB[tab.sortOrderColumnName]
                )
              })
            context.dispatch('setTabSequenceRecord', recordToTab)
          }
        }
      })
  },
  /**
     * Get references asociate to record
     * @param {string} parentUuid as windowUuid
     * @param {string} containerUuid
     * @param {string} tableName
     * @param {string} recordUuid
     */
  getReferencesListFromServer(
    context: WindowActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            tableName: string
            recordUuid: string
        }
  ) {
    const windowUuid = payload.parentUuid
    const { containerUuid, recordUuid } = payload
    let { tableName } = payload

    if (!tableName) {
      tableName = context.rootGetters[Namespaces.WindowDefinition + '/' + 'getTab'](windowUuid, containerUuid)
        .tableName
    }

    return new Promise(resolve => {
      requestReferencesList({
        windowUuid,
        tableName,
        recordUuid
      })
        .then((referenceResponse: IReferenceListData) => {
          const referencesList: IReferenceDataExtended[] = referenceResponse.list.map(
            (item: IReferenceData) => {
              return {
                ...item,
                recordUuid,
                type: 'reference'
              }
            }
          )
          const references: IReferenceListDataExtended = {
            ...referenceResponse,
            windowUuid,
            recordUuid,
            referencesList
          }

          context.commit('addReferencesList', references)
          resolve(referenceResponse)
        })
        .catch(error => {
          console.warn(`References Load Error ${error.code}: ${error.message}.`)
        })
    })
  },
  setWindowOldRoute(context: WindowActionContext, oldPath?: IWindowOldRoute) {
    if (!oldPath) {
      oldPath = {
        path: '',
        fullPath: '',
        query: {}
      }
    }
    context.commit('setWindowOldRoute', oldPath)
  },
  setTabSequenceRecord(context: WindowActionContext, record: any) {
    context.commit('setTabSequenceRecord', record)
  },
  /**
     * Update records in tab sort
     * @param {string} containerUuid
     * @param {string} parentUuid
     */
  updateSequence(
    context: WindowActionContext,
    payload: { parentUuid: string, containerUuid: string }
  ) {
    const { parentUuid, containerUuid } = payload
    const {
      tableName,
      sortOrderColumnName,
      sortYesNoColumnName,
      // tabAssociatedUuid,
      associatedTab
    } = <ITabDataExtended>(
            context.rootGetters[Namespaces.WindowDefinition + '/' + 'getTab'](parentUuid, containerUuid)
        )
    const listSequenceToSet: any[] = context.getters.getTabSequenceRecord
    const recordData: any[] = context.rootGetters[Namespaces.BusinessData + '/' + 'getDataRecordsList'](
      containerUuid
    )

    // scrolls through the logs and checks if there is a change to be sent to server
    recordData.forEach(itemData => {
      const dataSequence = listSequenceToSet.find(
        item => item.UUID === itemData.UUID
      )
      const currentSequence = itemData[sortOrderColumnName]
      const newSequence = dataSequence[sortOrderColumnName]
      const validateCurrentSequence = !currentSequence && newSequence <= 0
      const validateNewSequence = !newSequence && currentSequence <= 0
      if (currentSequence === newSequence || validateCurrentSequence || validateNewSequence) {
        return
      }
      const valuesToSend: KeyValueData[] = [
        {
          // columnName: sortOrderColumnName,
          key: sortOrderColumnName,
          value: newSequence
        }
      ]

      const currentYesNo = itemData[sortYesNoColumnName]
      const newYesNo = dataSequence[sortYesNoColumnName]
      const validateCurrentYesNo = !currentYesNo || currentYesNo === false
      const validateNewYesNo = !newSequence || newSequence <= 0

      if (validateCurrentYesNo && validateCurrentSequence) {
        return
      }

      if (
        currentYesNo !== newYesNo
      ) {
        valuesToSend.push({
          // columnName: sortYesNoColumnName,
          key: sortOrderColumnName,
          value: newYesNo
        })
      }

      const countRequest: number = context.state.totalRequest + 1
      context.commit('setTotalRequest', countRequest)

      const recordId = itemData[tableName + '_ID']
      requestUpdateEntity({
        tableName,
        id: recordId,
        uuid: itemData.UUID,
        attributes: valuesToSend
        // attributesList: valuesToSend
      })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(
                        `Update Entity Table Error ${error.code}: ${error.message}`
          )
        })
        .finally(() => {
          const countResponse: number =
                        context.state.totalResponse + 1
          context.commit('setTotalResponse', countResponse)
          if (
            context.state.totalResponse ===
                        context.state.totalRequest
          ) {
            showMessage({
              message: language.t(
                'notifications.updateSuccessfully'
              ).toString(),
              type: 'success'
            })
            context.dispatch(Namespaces.Process + '/' + 'setShowDialog', {
              type: 'window',
              action: undefined
            }, { root: true })
            context.commit('setTotalRequest', 0)
            context.commit('setTotalResponse', 0)

            context.dispatch(Namespaces.Window + '/' + 'setRecordSelection', {
              parentUuid,
              containerUuid,
              isLoaded: false
            }, { root: true })
            context.dispatch('setTabSequenceRecord', [])

            // refresh record list in table source
            context
              .dispatch('getDataListTab', {
                parentUuid,
                // containerUuid: tabAssociatedUuid
                containerUuid: associatedTab?.tabUuid
              })
              .catch(error => {
                console.warn(
                                    `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
                )
              })
          }
        })
    })
  }
}
