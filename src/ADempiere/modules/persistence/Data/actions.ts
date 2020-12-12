import { RootState } from '@/ADempiere/shared/store/types'
import { parseContext } from '@/ADempiere/shared/utils/contextUtils'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { TABLE, TABLE_DIRECT } from '@/ADempiere/shared/utils/references'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import {
  extractPagingToken,
  typeValue
} from '@/ADempiere/shared/utils/valueUtils'
import { ActionContext, ActionTree } from 'vuex'
import { IValueData } from '../../core'
import { IPanelDataExtended } from '../../dictionary'
import {
  requestDefaultValue,
  requestGetContextInfoValue
} from '@/ADempiere/modules/ui'
import { requestGetEntity, requestListEntities } from '../PersistenceService'
import {
  BusinessDataState,
  IContextInfoValuesExtends,
  IEntityData,
  IEntityListData,
  IPrivateAccessDataExtended,
  IRecordObjectListFromCriteria,
  IRecordSelectionData,
  ISelectionToServerData,
  KeyValueData
} from '../PersistenceType'
import language from '@/lang'
import {
  requestGetPrivateAccess,
  requestLockPrivateAccess,
  requestUnlockPrivateAccess
  , IPrivateAccessData
} from '@/ADempiere/modules/privateAccess'

import { convertArrayKeyValueToObject } from '@/ADempiere/shared/utils/valueFormat'

type BusinessDataActionTree = ActionTree<BusinessDataState, RootState>
type BusinessDataActionContext = ActionContext<BusinessDataState, RootState>

export const actions: BusinessDataActionTree = {
  setPageNumber(
    context: BusinessDataActionContext,
    parameters: {
            parentUuid: string
            containerUuid: string
            panelType: PanelContextType
            pageNumber: number
            isShowNotification: boolean
            isAddRecord: boolean
        }
  ) {
    const {
      parentUuid,
      containerUuid,
      panelType = PanelContextType.Window,
      pageNumber,
      isAddRecord = false,
      isShowNotification = true
    } = parameters

    const data:
            | IRecordSelectionData
            | undefined = context.state.recordSelection.find(
              (recordItem: IRecordSelectionData) => {
                return recordItem.containerUuid === containerUuid
              }
            )

    context.commit('setPageNumber', {
      data: data,
      pageNumber: pageNumber
    })

    // refresh list table with data from server
    if (panelType === PanelContextType.Window) {
      context
        .dispatch('getDataListTab', {
          parentUuid,
          containerUuid,
          isAddRecord,
          isShowNotification
        })
        .catch(error => {
          console.warn(
                        `Error getting data list tab. Message: ${error.message}, code ${error.code}.`
          )
        })
    } else if (panelType === 'browser') {
      if (!context.rootGetters.isNotReadyForSubmit(containerUuid)) {
        context.dispatch('getBrowserSearch', {
          containerUuid,
          isClearSelection: true
        })
      }
    }
  },
  /**
     * Insert new row bottom list table, used only from window
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {boolean} isPanelValues, define if used values form panel
     * @param {boolean} isEdit, define if used values form panel
     */
  async addNewRow(
    context: BusinessDataActionContext,
    payload: {
            parentUuid: string
            containerUuid: string
            isPanelValues: boolean
            isEdit: boolean
            isNew: boolean
            fieldsList: IFieldDataExtendedUtils[]
            row: any
        }
  ) {
    payload.isPanelValues = payload.isPanelValues || false
    payload.isEdit = payload.isEdit || true
    payload.isNew = payload.isNew || true
    const {
      parentUuid,
      containerUuid,
      isPanelValues,
      isEdit,
      isNew,
      row
    } = payload
    let { fieldsList } = payload

    const dataStore: any[] = context.getters.getDataRecordsList(
      containerUuid
    )
    let values: IKeyValueObject & {
            isNew?: boolean
            isEdit?: boolean
            isSendServer?: boolean
        } = {}
    const currentNewRow = dataStore.find(itemData => {
      return !itemData.UUID && itemData.isNew
    })

    if (currentNewRow) {
      values = currentNewRow
      return values
    }

    if (!row) {
      const tabPanel: IPanelDataExtended = context.rootGetters.getPanel(
        containerUuid
      )

      if (!fieldsList) {
        fieldsList = tabPanel.fieldsList
      }
      // add row with default values to create new record
      if (isPanelValues) {
        // add row with values used from record in panel
        values = <IKeyValueObject>(
                    context.rootGetters.getColumnNamesAndValues({
                      containerUuid,
                      propertyName: 'value',
                      isObjectReturn: true,
                      isAddDisplayColumn: true,
                      fieldsList
                    })
                )
      } else {
        values = <IKeyValueObject>(
                    context.rootGetters.getParsedDefaultValues({
                      parentUuid,
                      containerUuid,
                      fieldsList,
                      formatToReturn: 'object'
                    })
                )
      }
      values.isNew = isNew
      values.isEdit = isEdit
      values.isSendServer = false

      // get the link column name from the tab
      let linkColumnName = tabPanel.linkColumnName
      if (!linkColumnName) {
        // get the link column name from field list
        linkColumnName = tabPanel.fieldLinkColumnName
      }

      let valueObjectLink: IKeyValueObject | string
      let valueLink: number
      // get context value if link column exists and does not exist in row
      if (linkColumnName) {
        valueObjectLink = context.rootGetters.getContext({
          parentUuid,
          containerUuid,
          columnName: linkColumnName
        })
        if (valueObjectLink && typeof valueObjectLink === 'string') {
          valueLink = parseInt(valueObjectLink, 10)
        }
      }

      // get display column and/or sql value
      if (fieldsList.length) {
        fieldsList
        // TODO: Evaluate if is field is read only and FieldSelect
          .filter(itemField => {
            return (
              itemField.componentPath === 'FieldSelect' ||
                            typeValue(values[itemField.columnName]) ===
                                'OBJECT' ||
                            itemField.isSQLValue
            )
          })
          .map(async itemField => {
            const { columnName, componentPath } = itemField
            let valueGetDisplayColumn = values[columnName]

            if (typeValue(values[columnName]) === 'OBJECT') {
              if (componentPath === 'FieldSelect') {
                values[columnName] = ' '
                values[itemField.displayColumnName!] = ' '
              } else if (componentPath === 'FieldNumber') {
                values[columnName] = 0
              }
            }
            // overwrite value with column link
            if (linkColumnName && linkColumnName === columnName) {
              valueGetDisplayColumn = valueLink
              if (!values[columnName]) {
                values[columnName] = valueGetDisplayColumn
              }
            }

            // break this itineration if is empty
            if (!valueGetDisplayColumn) {
              return
            }
            // always the values for these types of fields are integers
            // Table (18) or Table Direct (19)
            if (
              [TABLE.id, TABLE_DIRECT.id].includes(
                itemField.displayType
              )
            ) {
              valueGetDisplayColumn = parseInt(
                valueGetDisplayColumn,
                10
              )
            } else {
              if (!isNaN(valueGetDisplayColumn)) {
                valueGetDisplayColumn = parseInt(
                  valueGetDisplayColumn,
                  10
                )
              }
            }

            if (
              valueGetDisplayColumn &&
                            typeValue(valueGetDisplayColumn) === 'OBJECT' &&
                            valueGetDisplayColumn.isSQL
            ) {
              // get value from Query
              valueGetDisplayColumn = await context.dispatch(
                'getValueBySQL',
                {
                  parentUuid,
                  containerUuid,
                  query: itemField.defaultValue
                }
              )
              values[columnName] = valueGetDisplayColumn
            }

            // break to next itineration if not select field
            if (componentPath !== 'FieldSelect') {
              return
            }

            // get label (DisplayColumn) from vuex store
            const options = context.rootGetters.getLookupAll({
              parentUuid,
              containerUuid,
              tableName: itemField.reference.tableName,
              query: itemField.reference.query,
              directQuery: itemField.reference.directQuery,
              value: valueGetDisplayColumn
            })

            const option = options.find(
              (itemOption: any) =>
                itemOption.key === valueGetDisplayColumn
            )
            // if there is a lookup option, assign the display column with the label
            if (option) {
              values[itemField.displayColumnName!] = option.label
              // if (isEmptyValue(option.label) && !itemField.isMandatory) {
              //   values[columnName] = undefined
              // }
              return
            }
            if (linkColumnName === columnName) {
              // get context value if link column exists and does not exist in row
              const nameParent = context.rootGetters.getContext({
                parentUuid,
                containerUuid,
                columnName: 'Name'
              })
              if (nameParent) {
                values[
                                    itemField.displayColumnName!
                ] = nameParent
                return
              }
            }
            // get value to displayed from server
            const { label } = await context.dispatch(
              'getLookupItemFromServer',
              {
                parentUuid,
                containerUuid,
                columnName: itemField.columnName,
                tableName: itemField.reference.tableName,
                directQuery: itemField.reference.directQuery,
                value: valueGetDisplayColumn
              }
            )
            values[itemField.displayColumnName!] = label
          })
      }

      // overwrite value with column link
      if (!values[linkColumnName]) {
        values[linkColumnName] = valueLink!
      }
    } else {
      values = row
    }

    context.commit('addNewRow', {
      values,
      data: dataStore
    })
  },
  /**
     * Is load context in true when panel is set context
     * @param {string}  containerUuid
     */
  setIsloadContext(
    context: BusinessDataActionContext,
    payload: { containerUuid: string }
  ) {
    const { containerUuid } = payload
    const dataStore = context.state.recordSelection.find(
      (recordItem: IRecordSelectionData) => {
        return recordItem.containerUuid === containerUuid
      }
    )
    if (dataStore) {
      context.commit('setIsloadContext', {
        data: dataStore,
        isLoadedContext: true
      })
    }
  },
  /**
     * Set record, selection, page number, token, and record count, with container uuid
     * @param {string}  parameters.containerUuid
     * @param {array}   parameters.record
     * @param {array}   parameters.selection
     * @param {integer} parameters.pageNumber
     * @param {integer} parameters.recordCount
     * @param {string}  parameters.nextPageToken
     * @param {string}  parameters.panelType
     */
  setRecordSelection(
    context: BusinessDataActionContext,
    parameters: {
            parentUuid?: string
            containerUuid: string
            record?: any[]
            selection?: IRecordSelectionData[]
            pageNumber?: number
            recordCount?: number
            nextPageToken: string
            panelType?: PanelContextType

            query?: string
            whereClause?: string
            orderByClause?: string
            originalNextPageToken?: string
            isAddRecord?: boolean
            isLoaded?: boolean
        }
  ) {
    const {
      parentUuid,
      containerUuid,
      panelType = parameters.panelType || PanelContextType.Window,
      record = parameters.record || [],
      query,
      whereClause,
      orderByClause,
      selection = parameters.selection || [],
      pageNumber = parameters.pageNumber || 1,
      recordCount = parameters.recordCount || 0,
      nextPageToken,
      originalNextPageToken,
      isAddRecord = false,
      isLoaded = true
    } = parameters

    const dataStore:
            | IRecordSelectionData
            | undefined = context.state.recordSelection.find(recordItem => {
              return recordItem.containerUuid === containerUuid
            })

    const newDataStore: IRecordSelectionData = {
      parentUuid,
      containerUuid,
      record,
      selection,
      pageNumber,
      recordCount,
      nextPageToken,
      originalNextPageToken,
      panelType,
      isLoaded,
      isLoadedContext: false,
      query,
      whereClause,
      orderByClause
    }

    if (dataStore) {
      if (isAddRecord) {
        newDataStore.record = dataStore.record.concat(
          newDataStore.record
        )
      }
      context.commit('setRecordSelection', {
        dataStore,
        newDataStore
      })
    } else {
      context.commit('addRecordSelection', newDataStore)
    }
  },
  /**
     * Set selection in data list associated in container
     * @param {string} containerUuid
     * @param {IRecordSelectionData[]} selection
     */
  setSelection(
    context: BusinessDataActionContext,
    parameters: {
            containerUuid: string
            selection?: IRecordSelectionData[]
        }
  ) {
    const {
      containerUuid,
      selection = parameters.selection || []
    } = parameters

    const recordSelection: IRecordSelectionData = context.getters.getDataRecordAndSelection(
      containerUuid
    )
    context.commit('setSelection', {
      newSelection: selection,
      data: recordSelection
    })
  },
  /**
     * Delete record result in container
     * @param {string}  viewUuid // As parentUuid in window
     * @param {array}   withOut
     * @param {boolean} isNew
     */
  deleteRecordContainer(
    context: BusinessDataActionContext,
    parameters: { viewUuid: string, withOut?: any[], isNew?: boolean }
  ) {
    const {
      viewUuid,
      withOut = parameters.withOut || [],
      isNew = parameters.isNew || false
    } = parameters

    const setNews: any[] = []
    const record: IRecordSelectionData[] = context.state.recordSelection.filter(
      (itemRecord: IRecordSelectionData) => {
        // ignore this uuid
        if (withOut.includes(itemRecord.containerUuid)) {
          return true
        }
        // remove window and tabs data
        if (itemRecord.parentUuid) {
          if (isNew) {
            setNews.push(itemRecord.containerUuid)
          }
          return itemRecord.parentUuid !== viewUuid
        }
        // remove browser data
        return itemRecord.containerUuid !== viewUuid
      }
    )
    context.commit('deleteRecordContainer', record)
    context.dispatch('setTabSequenceRecord', [])

    if (setNews.length) {
      setNews.forEach(uuid => {
        context.dispatch('setRecordSelection', {
          parentUuid: viewUuid,
          containerUuid: uuid
        })
      })
    }
  },
  /**
     * @param {string} tableName
     * @param {string} recordUuid
     * @param {number} recordId
     */
  getEntity(
    context: BusinessDataActionContext,
    parameters: { tableName: string, recordUuid: string, recordId: number }
  ) {
    const { tableName, recordId, recordUuid } = parameters

    return new Promise<KeyValueData<IValueData>[]>(resolve => {
      requestGetEntity({
        tableName,
        uuid: recordUuid,
        id: recordId
      })
        .then((responseGetEntity: IEntityData) => {
          resolve(responseGetEntity.attributes)
        })
        .catch(error => {
          console.warn(
                        `Error Get Entity ${error.message}. Code: ${error.code}.`
          )
        })
    })
  },
  /**
     * Request list to view in table
     * TODO: Join with getDataListTab action
     * @param {string} parentUuid, uuid from window
     * @param {string} containerUuid, uuid from tab
     * @param {string} tableName, table name to search record data
     * @param {string} query, criteria to search record data
     * @param {string} whereClause, criteria to search record data
     * @param {string} orderByClause, criteria to search record data
     * @param {array}  conditionsList, conditions list to criteria
     * @param {boolean} isShowNotification, show searching and response records
     * @param {boolean} isParentTab, conditions list to criteria
     * @param {boolean} isAddRecord, join store records with server records (used with sequence tab)
     * @param {boolean} isAddDefaultValues, add default fields values
     */
  getObjectListFromCriteria(
    context: BusinessDataActionContext,
    parameters: {
            parentUuid: string
            containerUuid: string
            tableName: string
            query: string
            whereClause: string
            orderByClause: string
            conditionsList?: any[]
            isShowNotification?: boolean
            isParentTab?: boolean
            isAddRecord?: boolean
            isAddDefaultValues?: boolean
        }
  ) {
    let { parentUuid, containerUuid } = parameters
    const {
      tableName,
      query,
      whereClause,
      orderByClause,
      conditionsList = parameters.conditionsList || [],
      isShowNotification = parameters.isShowNotification || true,
      isParentTab = parameters.isParentTab || true,
      isAddRecord = parameters.isAddRecord || false,
      isAddDefaultValues = parameters.isAddDefaultValues || true
    } = parameters

    if (isShowNotification) {
      showMessage({
        // title: language.t('notifications.loading').toString(),
        message: language.t('notifications.searching'),
        type: 'info'
      })
    }

    const replaceTable = (value: string): string => {
      return value.replace('table_', '')
    }

    parentUuid = replaceTable(parentUuid)
    containerUuid = replaceTable(containerUuid)

    const dataStore: IRecordSelectionData = context.getters.getDataRecordAndSelection(
      containerUuid
    )

    let nextPageToken = ''
    if (dataStore.nextPageToken) {
      nextPageToken = dataStore.nextPageToken + '-' + dataStore.pageNumber
    }

    let inEdited: any[] = []
    if (!isParentTab) {
      // TODO: Evaluate peformance to evaluate records to edit
      inEdited = dataStore.record.filter(itemRecord => {
        return itemRecord.isEdit && !itemRecord.isNew
      })
    }

    // gets the default value of the fields (including whether it is empty or undefined)
    let defaultValues: IKeyValueObject<String> = {}
    if (isAddDefaultValues) {
      defaultValues = <IKeyValueObject<String>>(
                context.rootGetters.getParsedDefaultValues({
                  parentUuid,
                  containerUuid,
                  formatToReturn: 'object',
                  isGetServer: false
                })
            )
    }

    return requestListEntities({
      tableName,
      query,
      whereClause,
      conditionsList,
      orderByClause,
      pageToken: nextPageToken
    })
      .then((dataResponse: IEntityListData) => {
        const recordsList: IRecordObjectListFromCriteria[] = dataResponse.recordsList.map(
          (record: IEntityData) => {
            const values: KeyValueData<IValueData>[] =
                            record.attributes
            let isEdit = false
            if (isAddDefaultValues) {
              if (
                inEdited.find(
                  // itemEdit => itemEdit.UUID === values.UUID
                  (itemEdit: any, index: number) =>
                    itemEdit.UUID === values[index].key
                )
              ) {
                isEdit = true
              }
            }

            // overwrite default values and sets the values obtained from the
            // server (empty fields are not brought from the server)
            return {
              defaultValues, // ...defaultValues,
              values, // ...values,
              // datatables attributes
              isNew: false,
              isEdit,
              isReadOnlyFromRow: false
            }
          }
        )

        const originalNextPageToken: string = dataResponse.nextPageToken
        let token: string = originalNextPageToken
        if (!token) {
          token = dataStore.nextPageToken!
        } else {
          token = extractPagingToken(token)
        }
        if (isShowNotification) {
          let searchMessage = 'searchWithOutRecords'
          if (recordsList.length) {
            searchMessage = 'succcessSearch'
          }
          showMessage({
            // title: language.t('notifications.succesful'),
            message: language.t(`notifications.${searchMessage}`),
            type: 'success'
          })
        }
        context.dispatch('setRecordSelection', {
          parentUuid,
          containerUuid,
          record: recordsList,
          selection: dataStore.selection,
          recordCount: dataResponse.recordCount,
          nextPageToken: token,
          originalNextPageToken,
          isAddRecord,
          pageNumber: dataStore.pageNumber,
          tableName,
          query,
          whereClause
        })

        return recordsList
      })
      .catch(error => {
        // Set default registry values so that the table does not say loading,
        // there was already a response from the server
        context.dispatch('setRecordSelection', {
          parentUuid,
          containerUuid
        })

        if (isShowNotification) {
          showMessage({
            // title: language.t('notifications.error'),
            message: error.message,
            type: 'error'
          })
        }
        console.warn(
                    `Error Get Object List ${error.message}. Code: ${error.code}.`
        )
      })
  },
  /**
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} query
     */
  getValueBySQL(
    context: BusinessDataActionContext,
    parameters: { parentUuid: string, containerUuid: string, query: string }
  ) {
    const { parentUuid, containerUuid } = parameters
    let { query } = parameters

    // TODO: Change to promise all
    return new Promise<IValueData>(resolve => {
      if (query.includes('@')) {
        query = parseContext({
          parentUuid,
          containerUuid,
          isSQL: true,
          value: query
        }).query!
      }

      requestDefaultValue(query)
        .then((defaultValueResponse: IValueData) => {
          resolve(defaultValueResponse)
        })
        .catch((error: any) => {
          console.warn(
                        `Error getting default value from server. Error code ${error.code}: ${error.message}.`
          )
        })
    })
  },
  /**
     * TODO: Add support to tab children
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {boolean}  isEdit, if the row displayed to edit mode
     * @param {boolean}  isNew, if insert data to new row
     * @param {objec}  row, new data to change
     */
  notifyRowTableChange(
    context: BusinessDataActionContext,
    parameters: {
            parentUuid: string
            containerUuid: string
            isEdit?: boolean
            isNew: boolean
            row: any
        }
  ) {
    const {
      parentUuid,
      containerUuid,
      isNew,
      isEdit = parameters.isEdit || true,
      row
    } = parameters

    let values: IKeyValueObject = {}
    if (row) {
      values = row
    } else {
      values = <IKeyValueObject>(
                context.rootGetters.getColumnNamesAndValues({
                  parentUuid,
                  containerUuid,
                  propertyName: 'value',
                  isObjectReturn: true,
                  isAddDisplayColumn: true
                })
            )
    }
    // if (Array.isArray(values)) {
    //     values = convertArrayKeyValueToObject({
    //         arrayToConvert: values
    //     })
    // }

    const currentRow: any = context.getters.getRowData({
      containerUuid,
      recordUuid: values.UUID
    })

    const newRow: IKeyValueObject & { isEdit: boolean } = {
      ...values,
      isEdit
    }

    context.commit('notifyRowTableChange', {
      isNew,
      newRow,
      row: currentRow
    })
  },
  notifyCellTableChange(
    context: BusinessDataActionContext,
    parameters: {
            parentUuid: string
            containerUuid: string
            field: any
            columnName: string
            rowKey: string
            keyColumn: string
            panelType?: PanelContextType
            isSendToServer?: boolean
            isSendCallout?: boolean
            newValue: any
            displayColumn: string
            withOutColumnNames?: any[]
        }
  ) {
    // dispatch('setPreferenceContext', {
    //   parentUuid,
    //   containerUuid,
    //   columnName,
    //   value: newValue
    // })
    const {
      containerUuid,
      panelType = parameters.panelType || PanelContextType.Window,
      isSendToServer = parameters.isSendToServer || true,
      isSendCallout = parameters.isSendCallout || true,
      withOutColumnNames = parameters.withOutColumnNames || [],
      field,
      keyColumn,
      rowKey,
      columnName,
      newValue,
      displayColumn,
      parentUuid
    } = parameters
    const recordSelection:
            | IRecordSelectionData
            | undefined = context.state.recordSelection.find(
              (recordItem: IRecordSelectionData) => {
                return recordItem.containerUuid === containerUuid
              }
            )
    let row: IKeyValueObject = {}
    if (field.tableIndex) {
      row = recordSelection!.record[field.tableIndex]
    } else {
      row = recordSelection!.record.find(
        (itemRecord: IKeyValueObject) => {
          return itemRecord[keyColumn] === rowKey
        }
      )
    }

    // the field has not changed, then the action is broken
    if (row[columnName] === newValue) {
      return
    }

    context.commit('notifyCellTableChange', {
      row,
      value: newValue,
      columnName,
      displayColumn
    })

    if (panelType === PanelContextType.Browser) {
      const rowSelection: IRecordSelectionData | undefined = recordSelection!.selection.find(
        (itemRecord) => {
          return itemRecord[keyColumn] === rowKey
        }
      )
      context.commit('notifyCellSelectionChange', {
        row: rowSelection,
        value: newValue,
        columnName,
        displayColumn
      })
    } else if (panelType === 'window') {
      // request callouts
      if (
        isSendCallout &&
                !withOutColumnNames.includes(field.columnName) &&
                newValue &&
                field.callout
      ) {
        withOutColumnNames.push(field.columnName)
        context.dispatch('runCallout', {
          parentUuid,
          containerUuid,
          tableName: field.tableName,
          columnName: field.columnName,
          callout: field.callout,
          value: newValue,
          valueType: field.valueType,
          withOutColumnNames,
          row,
          inTable: true
        })
      }

      if (isSendToServer) {
        const fieldNotReady = context.rootGetters.isNotReadyForSubmit(
          containerUuid,
          row
        )
        if (!fieldNotReady) {
          if (row.UUID) {
            context.dispatch('updateCurrentEntityFromTable', {
              parentUuid,
              containerUuid,
              row
            })
          } else {
            context.dispatch('createEntityFromTable', {
              parentUuid,
              containerUuid,
              row
            })
          }
        } else {
          const fieldsEmpty = context.rootGetters.getFieldsListEmptyMandatory(
            {
              containerUuid,
              row
            }
          )
          showMessage({
            message:
                            language.t('notifications.mandatoryFieldMissing') +
                            fieldsEmpty,
            type: 'info'
          })
        }
      }
    }
  },
  getContextInfoValueFromServer(
    context: BusinessDataActionContext,
    parameters: {
            contextInfoId: number
            contextInfoUuid: string
            sqlStatement: string
        }
  ) {
    const { contextInfoId, contextInfoUuid, sqlStatement } = parameters

    const contextInforField: IContextInfoValuesExtends = context.getters.getContextInfoField(
      contextInfoUuid,
      sqlStatement
    )
    if (contextInforField) {
      return contextInforField
    }
    return requestGetContextInfoValue({
      id: contextInfoId,
      uuid: contextInfoUuid,
      query: sqlStatement
    })
      .then(contextInfoResponse => {
        context.commit('setContextInfoField', {
          contextInfoUuid,
          sqlStatement,
          ...contextInfoResponse
        })
        return contextInfoResponse
      })
      .catch(error => {
        console.warn(
                    `Error ${error.code} getting context info value for field ${error.message}.`
        )
      })
  },
  getPrivateAccessFromServer(
    context: BusinessDataActionContext,
    parameters: { tableName: string, recordId: number, recordUuid: string }
  ): Promise<void | IPrivateAccessDataExtended> {
    const { tableName, recordId, recordUuid } = parameters
    return requestGetPrivateAccess({
      tableName,
      recordId,
      recordUuid
    })
      .then((privateAccessResponse: IPrivateAccessData) => {
        // TODO: Evaluate uuid record
        if (
          !privateAccessResponse.recordId ||
                    privateAccessResponse.recordId !== recordId
        ) {
          return {
            isLocked: false,
            tableName,
            recordId,
            recordUuid
          }
        }
        return {
          ...privateAccessResponse,
          isLocked: true
        }
      })
      .catch(error => {
        console.warn(
                    `Error get private access: ${error.message}. Code: ${error.code}.`
        )
      })
  },
  lockRecord(
    context: BusinessDataActionContext,
    parameters: { tableName: string, recordId: number, recordUuid: string }
  ): Promise<void | IPrivateAccessDataExtended | undefined> {
    const { tableName, recordUuid, recordId } = parameters
    return requestLockPrivateAccess({
      tableName,
      recordId,
      recordUuid
    })
      .then((privateAccessResponse: IPrivateAccessData) => {
        if (privateAccessResponse.recordId) {
          const recordLocked: IPrivateAccessDataExtended = {
            isPrivateAccess: true,
            isLocked: true,
            ...privateAccessResponse
          }
          showMessage({
            // title: language.t('notifications.succesful'),
            message: language.t('notifications.recordLocked'),
            type: 'success'
          })
          return recordLocked
        }
      })
      .catch(error => {
        showMessage({
          // title: language.t('notifications.error'),
          message: language.t('login.unexpectedError'),
          type: 'error'
        })
        console.warn(
                    `Error lock private access: ${error.message}. Code: ${error.code}.`
        )
      })
  },
  unlockRecord(
    context: BusinessDataActionContext,
    parameters: { tableName: string, recordId: number, recordUuid: string }
  ): Promise<void | IPrivateAccessDataExtended | undefined> {
    const { tableName, recordId, recordUuid } = parameters
    return requestUnlockPrivateAccess({
      tableName,
      recordId,
      recordUuid
    })
      .then((privateAccessResponse: IPrivateAccessData) => {
        if (privateAccessResponse.recordId) {
          const recordUnlocked: IPrivateAccessDataExtended = {
            isPrivateAccess: true,
            isLocked: false,
            ...privateAccessResponse
          }
          showMessage({
            // title: language.t('notifications.succesful'),
            message: language.t('notifications.recordUnlocked'),
            type: 'success'
          })
          return recordUnlocked
        }
      })
      .catch(error => {
        showMessage({
          // title: language.t('notifications.error'),
          message: language.t('login.unexpectedError'),
          type: 'error'
        })
        console.warn(
                    `Error unlock private access: ${error.message}. Code: ${error.code}.`
        )
      })
  },
  /**
     * Getter converter selection data record in format
     * @param {string} containerUuid
     * @param {array}  selection
     * [{
     *    selectionId: keyColumn Value,
     *    selectionValues: [{ columnName, value }]
     * }]
     */
  getSelectionToServer: (context: BusinessDataActionContext) => (parameters: {
        containerUuid: string
        selection?: IKeyValueObject[]
    }): ISelectionToServerData[] => {
    let { selection = parameters.selection || [] } = parameters
    const { containerUuid } = parameters
    const selectionToServer: ISelectionToServerData[] = []

    const withOut: string[] = ['isEdit', 'isSendToServer']

    if (selection.length <= 0) {
      selection = context.getters.getDataRecordSelection(containerUuid)
    }
    if (selection.length) {
      const { fieldsList, keyColumn } = <IPanelDataExtended>(
                context.rootGetters.getPanel(containerUuid)
            )
            // reduce list
      const fieldsListSelection: IFieldDataExtendedUtils[] = fieldsList.filter(
        (itemField: IFieldDataExtendedUtils) => {
          return itemField.isIdentifier || itemField.isUpdateable
        }
      )

      selection.forEach((itemRow: IKeyValueObject) => {
        const records: KeyValueData[] = []

        Object.keys(itemRow).forEach((key: string) => {
          if (
            !key.includes('DisplayColumn') &&
                        !withOut.includes(key)
          ) {
            // evaluate metadata attributes before to convert
            const field:
                            | IFieldDataExtendedUtils
                            | undefined = fieldsListSelection.find(
                              (itemField: IFieldDataExtendedUtils) =>
                                itemField.columnName === key
                            )
            if (field) {
              records.push({
                // columnName: key,
                key,
                value: itemRow[key]
              })
            }
          }
        })

        selectionToServer.push({
          selectionId: itemRow[keyColumn!],
          selectionValues: records
        })
      })
    }
    return selectionToServer
  },
  getRowData: (context: BusinessDataActionContext) => (data: {
        containerUuid: string
        recordUuid: string
        index: number
    }) => {
    const { recordUuid, containerUuid, index } = data
    const recordsList: any[] = context.getters.getDataRecordsList(
      containerUuid
    )
    if (index) {
      return recordsList[index]
    }
    return recordsList.find((itemData: any) => {
      if (itemData.UUID === recordUuid) {
        return true
      }
    })
  },
  resetStateBusinessData(context: BusinessDataActionContext) {
    const { commit } = context
    commit('resetStateContainerInfo')
    commit('setInitialContext', {})
    commit('resetStateTranslations')
    commit('resetStateBusinessData')
    commit('resetContextMenu')
    commit('resetStateTranslations')
    commit('resetStateLookup')
    commit('resetStateProcessControl')
    commit('resetStateUtils')
    commit('resetStateWindowControl')
  }
}
