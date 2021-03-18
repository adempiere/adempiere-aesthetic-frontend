import { IdentifierColumnsData, IPanelDataExtended } from '@/ADempiere/modules/dictionary'
import { assignedGroup } from '@/ADempiere/shared/utils/DictionaryUtils'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { ActionContext, ActionTree } from 'vuex'
import { IRootState } from '@/store'
import { IRangeAttributeData, PanelState } from './type'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { Route } from 'vue-router'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import language from '@/ADempiere/shared/lang'
import { IRecordSelectionData, KeyValueData } from '@/ADempiere/modules/persistence/PersistenceType'
import { convertIRangeAttributeDataToKeyValueData, convertObjectToKeyValue } from '@/ADempiere/shared/utils/valueFormat'
import { typeValue } from '@/ADempiere/shared/utils/valueUtils'
import evaluator from '@/ADempiere/shared/utils/evaluator'
import { getContext, parseContext } from '@/ADempiere/shared/utils/contextUtils'

type PanelActionContext = ActionContext<PanelState, IRootState>
type PanelActionTree = ActionTree<PanelState, IRootState>

export const actions: PanelActionTree = {
  addPanel(context: PanelActionContext, parameters: IPanelDataExtended): IPanelDataExtended {
    const {
      panelType,
      // isParentTab,
      // parentUuid,
      uuid: containerUuid
    } = parameters
    const params: Partial<IPanelDataExtended> = {
      ...parameters
    }
    let keyColumn = ''
    let selectionColumn: string[] = []
    let identifierColumns: IdentifierColumnsData[] = []
    let count = 0

    if (params.fieldsList) {
      params.fieldsList.forEach((itemField, index: number, listFields: any) => {
        if (itemField.isKey) {
          keyColumn = itemField.columnName
        }
        if (itemField.isSelectionColumn) {
          selectionColumn.push(itemField.columnName)
        }
        if (itemField.isIdentifier) {
          identifierColumns.push({
            columnName: itemField.columnName,
            identifierSequence: itemField.identifierSequence,
            componentPath: itemField.componentPath || ''
          })
        }
        if (panelType === PanelContextType.Table || params.isAdvancedQuery) {
          itemField.isShowedFromUser = false
          if (count < 2 && itemField.isSelectionColumn && itemField.sequence >= 10) {
            itemField.isShowedFromUser = true
            count++
          }
        }
        //  For all
        if ([PanelContextType.Browser, PanelContextType.Process, PanelContextType.Report, PanelContextType.Form, PanelContextType.Table].includes(panelType) ||
              (panelType === PanelContextType.Window && params.isParentTab)) {
          // TODO: Verity with updateValueOfField, setContext, setPreferenceContext
          // commit('updateValueOfField', {
          //   parentUuid,
          //   containerUuid,
          //   // isOverWriteParent: Boolean(isParentTab),
          //   columnName: itemField.columnName,
          //   value: itemField.value
          // })
        }
        //  Get dependent fields
        if (itemField.parentFieldsList && itemField.isActive) {
          itemField.parentFieldsList.forEach((parentColumnName: any) => {
            const parentField: IFieldDataExtendedUtils | undefined = listFields.find((parentFieldItem: any) => {
              return parentFieldItem.columnName === parentColumnName &&
                    parentColumnName !== itemField.columnName
            })
            if (parentField) {
                  parentField.dependentFieldsList!.push(itemField.columnName)
            }
          })
        }
      })

      let orderBy = 'sequence'
      if ((panelType === PanelContextType.Window && !params.isParentTab) || panelType === PanelContextType.Browser) {
        orderBy = 'seqNoGrid'
      }
      params.fieldsList = assignedGroup({
        fieldsList: params.fieldsList,
        orderBy
      })!
    }

    params.keyColumn = keyColumn
    if (params.isSortTab) {
      const panelParent: any = context.getters.getPanel(params.tabAssociatedUuid)
      selectionColumn = selectionColumn.concat(panelParent.selectionColumn)
      identifierColumns = identifierColumns.concat(panelParent.identifierColumns)
      params.fieldLinkColumnName = panelParent.fieldLinkColumnName
      params.keyColumn = panelParent.keyColumn
    }
    params.selectionColumn = selectionColumn
    params.identifierColumns = identifierColumns
      .sort((itemA, itemB) => {
        return itemA.identifierSequence - itemB.identifierSequence
      })

    params.recordUuid = null
    // show/hidden optionals columns to table
    params.isShowedTableOptionalColumns = false
    context.commit('addPanel', params)

    if (!['table'].includes(panelType)) {
      context.dispatch('setDefaultValues', {
        parentUuid: params.parentUuid,
        containerUuid,
        // isOverWriteParent: Boolean(isParentTab),
        panelType
      })
    }
    if (params.isCustomForm) {
      context.dispatch(Namespaces.FormDefinition + '/' + 'addForm', params, { root: true })
    }

    return <IPanelDataExtended>params
  },
  /**
   * Used by components/fields/filterFields
   */
  changeFieldShowedFromUser(context: PanelActionContext, params: {
    containerUuid: string
    isAdvancedQuery: boolean
    fieldsUser: any
    groupField: any
  }): void {
    const { containerUuid, isAdvancedQuery, fieldsUser, groupField } = params
    const panel: IPanelDataExtended = context.getters.getPanel(containerUuid)
    let isChangedDisplayedWithValue = false
    const fieldsList: IFieldDataExtendedUtils[] = panel.fieldsList.map(itemField => {
      const isShowedOriginal: boolean | undefined = itemField.isShowedFromUser
      // if (groupField === itemField.groupAssigned) {
      if (groupField === itemField.groupAssigned) {
        itemField.isShowedFromUser = false
        if (fieldsUser.includes(itemField.columnName)) {
          itemField.isShowedFromUser = true
        }
      }

      if (!isChangedDisplayedWithValue) {
        const value = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
          parentUuid: itemField.parentUuid,
          containerUuid: containerUuid,
          columnName: itemField.columnName
        })
        // if isShowedFromUser was changed, and field has some value, the SmartBrowser
        // or AdvancedQuery  must send the parameters to update the search result
        if ((isShowedOriginal !== itemField.isShowedFromUser && (value)) ||
          (isAdvancedQuery && ['NULL', 'NOT_NULL'].includes(itemField.operator!))) {
          isChangedDisplayedWithValue = true
        }
      }
      return itemField
    })

    context.commit('changePanelAttribute', {
      panel,
      attributeName: 'fieldsList',
      attributeValue: fieldsList
    })

    console.log('panel')
    console.log(panel)

    if (isChangedDisplayedWithValue) {
      // Updated record result
      if (panel.panelType === 'browser') {
        context.dispatch(Namespaces.Browser + '/' + 'getBrowserSearch', {
          containerUuid,
          isClearSelection: true
        })
      } else if (panel.panelType === 'table' || panel.isAdvancedQuery) {
        context.dispatch(Namespaces.BusinessData + '/' + 'getObjectListFromCriteria', {
          parentUuid: panel.parentUuid,
          containerUuid,
          tableName: panel.tableName,
          query: panel.query,
          whereClause: panel.whereClause,
          conditionsList: context.getters.getParametersToServer({
            containerUuid,
            isEvaluateMandatory: false
          })
        })
          .catch(error => {
            console.warn(`Error getting Advanced Query (changeFieldShowedFromUser): ${error.message}. Code: ${error.code}.`)
          })
      }
    }
  },
  /**
   * Change some attribute boolean from fields in panel
   * @param {string}  containerUuid
   * @param {string}  fieldsList
   * @param {string}  attribute
   * @param {boolean} valueAttribute
   * @param {array}   fieldsIncludes fields to set valueAttribute
   * @param {array}   fieldsExcludes fields to dont change
   */
  changeFieldAttributesBoolean(context: PanelActionContext, params: {
    containerUuid: string
    attribute: string
    valueAttribute: boolean
    fieldsIncludes?: any[]
    fieldsExcludes?: any[]
  }): void {
    const { containerUuid, attribute, valueAttribute, fieldsExcludes = params.fieldsExcludes || [], fieldsIncludes = params.fieldsIncludes || [] } = params
    const panel: IPanelDataExtended = context.getters.getPanel(containerUuid)

    const fieldsList: IFieldDataExtendedUtils[] = panel.fieldsList.map(itemField => {
      const { columnName } = itemField

      // not change exlude field
      if ((fieldsExcludes) && fieldsExcludes.includes(columnName)) {
        return itemField
      }

      const itemFieldAttributes = <IKeyValueObject>itemField
      // if it field is included to change value
      if ((fieldsIncludes) && fieldsIncludes.includes(columnName)) {
        itemFieldAttributes[attribute] = valueAttribute
        itemField = <IFieldDataExtendedUtils>itemFieldAttributes
        return itemField
      }
      // changed current value by opposite set value
      itemFieldAttributes[attribute] = !valueAttribute
      itemField = <IFieldDataExtendedUtils>itemFieldAttributes
      return itemField
    })

    context.commit('changePanelAttribute', {
      panel,
      attributeName: 'fieldsList',
      attributeValue: fieldsList
    })
  },
  /**
   * @param {string}  containerUuid
   * @param {array}   fieldsList
   */
  showOnlyMandatoryColumns(context: PanelActionContext, params: {
    containerUuid: string
    fieldsList?: IFieldDataExtendedUtils[]
  }) {
    const { containerUuid } = params
    let { fieldsList = params.fieldsList || [] } = params

    if (!(fieldsList)) {
      fieldsList = context.getters.getFieldsListFromPanel(containerUuid)
    }
    const fieldsIncludes: any[] = []
    fieldsList.forEach((fieldItem: IFieldDataExtendedUtils) => {
      const isMandatory = fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
      if (isMandatory) {
        fieldsIncludes.push(fieldItem.columnName)
      }
    })

    context.dispatch('changeFieldAttributesBoolean', {
      containerUuid,
      fieldsIncludes,
      attribute: 'isShowedTableFromUser',
      valueAttribute: true
    })
  },
  /**
   * @param {string}  containerUuid
   * @param {array}   fieldsList
   */
  showAllAvailableColumns(context: PanelActionContext, params: {
    containerUuid: string
    fieldsList?: IFieldDataExtendedUtils[]
  }): void {
    const { containerUuid } = params
    let { fieldsList = params.fieldsList || [] } = params
    if (!(fieldsList)) {
      fieldsList = context.getters.getFieldsListFromPanel(containerUuid)
    }
    const fieldsIncludes: any[] = []
    fieldsList.forEach((fieldItem: IFieldDataExtendedUtils) => {
      const isDisplayed = fieldItem.isDisplayed && fieldItem.isDisplayedFromLogic && !fieldItem.isKey
      // Verify for displayed and is active
      if (fieldItem.isActive && isDisplayed) {
        fieldsIncludes.push(fieldItem.columnName)
      }
    })

    context.dispatch('changeFieldAttributesBoolean', {
      containerUuid,
      fieldsIncludes,
      attribute: 'isShowedTableFromUser',
      valueAttribute: true
    })
  },
  // /**
  //  * Set default values to panel
  //  * @param {string}  parentUuid
  //  * @param {string}  containerUuid
  //  * @param {string}  panelType
  //  * @param {boolean} isNewRecord
  //  * @param {array}   fieldsList
  //  * TODO: Evaluate if it is necessary to parse the default values
  //  */
  setDefaultValues(context: PanelActionContext, params: {
    parentUuid: string
    containerUuid: string
    panelType?: PanelContextType
    isOverWriteParent?: boolean
    isNewRecord?: boolean
  }) {
    const { parentUuid, containerUuid, panelType = params.panelType || PanelContextType.Window, isOverWriteParent = params.isOverWriteParent || true, isNewRecord = params.isNewRecord || false } = params
    return new Promise(resolve => {
      const panel: IPanelDataExtended | undefined = context.getters.getPanel(containerUuid)
      if (!(panel)) {
        return
      }

      const defaultAttributes: IRangeAttributeData[] = context.getters.getParsedDefaultValues({
        parentUuid,
        containerUuid,
        isSOTrxMenu: context.rootState.route.meta.isSalesTransaction, // oldRoute.meta.isSalesTransaction,
        fieldsList: panel.fieldsList
      })

      if (panelType === 'window' && isNewRecord) {
        // redirect to create new record
        const oldRoute = context.rootState.route
        if (!(oldRoute.query && oldRoute.query.action === 'create-new')) {
          context.rootState.router.push({
            name: oldRoute.name!,
            params: {
              ...oldRoute.params
            },
            query: {
              ...oldRoute.query,
              action: 'create-new'
            }
          })
          // router.push({
          //   name: oldRoute.name!,
          //   params: {
          //     ...oldRoute.params
          //   },
          //   query: {
          //     ...oldRoute.query,
          //     action: 'create-new'
          //   }
          // })
        }
        showMessage({
          message: language.t('data.createNewRecord').toString(),
          type: 'info'
        })

        defaultAttributes.forEach(attribute => {
          context.commit(Namespaces.Persistence + '/' + 'addChangeToPersistenceQueue', {
            ...attribute,
            containerUuid
          }, { root: true })
        })
        // panel.fieldsList.forEach(fieldToBlank => {
        //   if (isEmptyValue(fieldToBlank.parsedDefaultValue)) {
        //     commit('changeFieldValueToNull', {
        //       field: fieldToBlank,
        //       value: undefined
        //     })
        //   }
        // })

        // if (panel.isTabsChildren) {
        //   // delete records tabs children when change record uuid
        //   dispatch('deleteRecordContainer', {
        //     viewUuid: parentUuid,
        //     withOut: [containerUuid],
        //     isNew: true
        //   })
        // }
      }
      const defaultAttributesParsed: KeyValueData[] = defaultAttributes.map((element: IRangeAttributeData) => {
        return convertIRangeAttributeDataToKeyValueData(element)
      })
      context.dispatch(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
        parentUuid,
        containerUuid,
        isOverWriteParent,
        attributes: defaultAttributesParsed
      }, { root: true })
        .then(() => {
          if ([PanelContextType.Browser, PanelContextType.Form, PanelContextType.Process, PanelContextType.Report].includes(panelType)) {
          // const fieldsUser = []
            panel.fieldsList.forEach(itemField => {
              if (!itemField.isAdvancedQuery || itemField.isActiveLogics) {
              // Change Dependents
                context.dispatch('changeDependentFieldsList', {
                  field: itemField
                })
              }
            // if (itemField.isShowedFromUserDefault || !isEmptyValue(itemField.value)) {
            //   fieldsUser.push(itemField.columnName)
            // }
            })

          // dispatch('changeFieldShowedFromUser', {
          //   containerUuid,
          //   fieldsUser,
          //   groupField: ''
          // })
          }
        })

      resolve(defaultAttributes)
    })
  },
  seekRecord(context: PanelActionContext, params: {
    parentUuid: string
    containerUuid: string
    recordUuid: string
  }): void {
    const { parentUuid, containerUuid, recordUuid } = params
    const recordAndSelection: IRecordSelectionData = context.getters.getDataRecordAndSelection(containerUuid)
    const recordRow = recordAndSelection.record.find(record => record.UUID === recordUuid)

    let attributes: KeyValueData<any>[] = []
    if (recordRow) {
      attributes = convertObjectToKeyValue({
        object: recordRow
      })
    }
    //  Change Value
    context.dispatch('notifyPanelChange', {
      parentUuid,
      containerUuid,
      attributes
    })
  },
  // Change all values of panel and dispatch actions for each field
  notifyPanelChange(context: PanelActionContext, params: {
    parentUuid?: string
    containerUuid: string
    attributes?: any[] | IKeyValueObject
  }) {
    const { parentUuid, containerUuid } = params
    const { attributes = params.attributes || [] } = params
    let attributesParsed: KeyValueData[] = []
    if (typeValue(attributes) === 'OBJECT') {
      attributesParsed = convertObjectToKeyValue({
        object: attributes
      })
    } else {
      attributesParsed = attributes.map((item: any) => {
        return convertIRangeAttributeDataToKeyValueData(item)
      })
    }

    // Update field
    context.dispatch(Namespaces.FieldValue + '/' + 'updateValuesOfContainer', {
      parentUuid,
      containerUuid,
      attributes: attributesParsed
    }, { root: true })
      .then(() => {
        const panel: IPanelDataExtended | undefined = context.getters.getPanel(containerUuid)
        if (panel && panel.isAdvancedQuery) {
          const fieldsList: IFieldDataExtendedUtils[] = panel.fieldsList
          fieldsList.forEach(field => {
            // Change Dependents
            context.dispatch('changeDependentFieldsList', {
              field,
              fieldsList
            })
          })
        }
      })

    // return new Promise(resolve => {
    //   if (isEmptyValue(fieldsList)) {
    //     fieldsList = getters.getFieldsListFromPanel(containerUuid)
    //   }
    //   let fieldsShowed = []
    //   // const promisessList = []
    //   fieldsList.map(async actionField => {
    //     if (actionField.isShowedFromUser) {
    //       fieldsShowed.push(actionField.columnName)
    //     }
    //
    //     // Evaluate with hasOwnProperty if exits this value
    //     if (!Object.prototype.hasOwnProperty.call(newValues, actionField.columnName)) {
    //       if (!isChangedAllValues || withOutColumnNames.includes(actionField.columnName)) {
    //         // breaks if this value does not exist or ignore with out column names
    //         return
    //       }
    //       // set empty value and continue
    //       newValues[actionField.columnName] = undefined
    //     }
    //
    //     if (isChangeFromCallout &&
    //       actionField.componentPath === 'FieldSelect' &&
    //       !Object.prototype.hasOwnProperty.call(newValues, actionField.displayColumnName)) {
    //       let lookup = rootGetters.getLookupItem({
    //         parentUuid,
    //         containerUuid,
    //         directQuery: actionField.reference.directQuery,
    //         tableName: actionField.reference.tableName,
    //         value: newValues[actionField.columnName]
    //       })
    //
    //       if (isEmptyValue(lookup) && !isEmptyValue(newValues[actionField.columnName])) {
    //         lookup = await dispatch('getLookupItemFromServer', {
    //           parentUuid,
    //           containerUuid,
    //           tableName: actionField.reference.tableName,
    //           directQuery: actionField.reference.parsedDirectQuery,
    //           value: newValues[actionField.columnName]
    //         })
    //       }
    //       if (!isEmptyValue(lookup)) {
    //         newValues[actionField.displayColumnName] = lookup.label
    //       }
    //     }
    //     //  Update field
    //     commit('updateValueOfField', {
    //       parentUuid,
    //       containerUuid,
    //       columnName: actionField.columnName,
    //       value: newValues[actionField.columnName]
    //     })
    //   })
    //   // show fields in query
    //   if (isShowedField && !isEmptyValue(newValues)) {
    //     // join column names without duplicating it
    //     fieldsShowed = Array.from(new Set([
    //       ...fieldsShowed,
    //       ...Object.keys(newValues)
    //     ]))
    //
    //     dispatch('changeFieldAttributesBoolean', {
    //       containerUuid,
    //       attribute: 'isShowedFromUser',
    //       valueAttribute: true,
    //       fieldsIncludes: fieldsShowed
    //     })
    //   }
    //   if (panelType === 'window') {
    //     dispatch('setIsloadContext', {
    //       containerUuid
    //     })
    //     if (isPrivateAccess) {
    //       const tableName = rootGetters.getTableNameFromTab(parentUuid, containerUuid)
    //       // TODO: Add current id and new id to comparison
    //       if (!isEmptyValue(newValues[`${tableName}_ID`])) {
    //         dispatch('getPrivateAccessFromServer', {
    //           tableName,
    //           recordId: newValues[`${tableName}_ID`],
    //           userUuid: rootGetters['user/getUserUuid']
    //         })
    //       }
    //     }
    //   }
    // })

    context.dispatch(Namespaces.BusinessData + '/' + 'setIsloadContext', {
      containerUuid
    }, { root: true })
  },
  /**
   * Handle all trigger for a field:
   * - Display Logic
   * - Mandatory Logic
   * - Read Only Logic
   * - Action for Custom panel from type
  */
  notifyFieldChange(context: PanelActionContext, params: {
  containerUuid: string
  columnName: string
  field?: IFieldDataExtendedUtils
  newValue: any
}) {
    const { newValue, columnName, containerUuid } = params
    let { field } = params
    return new Promise(resolve => {
    // get field
      let fieldsList: IFieldDataExtendedUtils[] = []
      if (!(field)) {
        fieldsList = context.getters.getFieldsListFromPanel(containerUuid)
        field = fieldsList.find(fieldItem => fieldItem.columnName === columnName)
      }

      let value
      if (!newValue) {
        value = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
          parentUuid: field!.parentUuid,
          containerUuid: field!.containerUuid,
          columnName: field!.columnName
        })
      } else {
        value = newValue
      }

      // const value = context.rootGetters[Namespaces.FieldValue + '/' + 'getValueOfField']({
      //   parentUuid: field!.parentUuid,
      //   containerUuid: field!.containerUuid,
      //   columnName: field!.columnName
      // })

      // if (!(panelType === 'table' || isAdvancedQuery)) {
      //   if (!['IN', 'NOT_IN'].includes(field.operator)) {
      //     value = parsedValueComponent({
      //       componentPath: field.componentPath,
      //       columnName: field.columnName,
      //       displayType: field.displayType,
      //       value,
      //       isIdentifier: field.columnName.includes('_ID')
      //     })
      //     if (field.isRange) {
      //       valueTo = parsedValueComponent({
      //         componentPath: field.componentPath,
      //         columnName: field.columnName,
      //         displayType: field.displayType,
      //         value: valueTo,
      //         isIdentifier: field.columnName.includes('_ID')
      //       })
      //     }
      //   }
      // }
      resolve({
        tableName: field!.tableName,
        field,
        value
      })

      // Run specific action
      context.dispatch(field!.panelType + 'Module/' + field!.panelType + 'ActionPerformed', {
        containerUuid: field!.containerUuid,
        field,
        value
      }, { root: true })
        .then(response => {
          if (response) {
            context.dispatch('notifyPanelChange', {
              containerUuid: field!.containerUuid,
              columnName: field!.columnName,
              attributes: response.attributes
            })
          }
          if (!field!.isAdvancedQuery) {
          // Change Dependents
            context.dispatch('changeDependentFieldsList', {
              field,
              fieldsList
            })
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`${field!.panelType}ActionPerformed error: ${error.message}.`)
        })
    })
  },
  /**
   * Change dependent fields (default value, logics displayed, mandatory and read only)
   * @param {object} field, definition and attributes
   * TODO: Not working with fields generated on lookupFactory
   */
  changeDependentFieldsList(context: PanelActionContext, params: {
    field: IFieldDataExtendedUtils
    fieldsList: IFieldDataExtendedUtils[]
  }) {
    let { field, fieldsList } = params
    if (!(field.dependentFieldsList)) {
      // breaks if there are no field dependencies
      return
    }
    //  Get all fields
    if (!(fieldsList)) {
      fieldsList = context.getters.getFieldsListFromPanel(field.containerUuid)
    }
    const dependentsList: IFieldDataExtendedUtils[] = fieldsList.filter(fieldItem => {
      return field.dependentFieldsList!.includes(fieldItem.columnName)
    })

    //  Iterate for change logic
    dependentsList.map(async fieldDependent => {
      //  isDisplayed Logic
      let isDisplayedFromLogic, isMandatoryFromLogic, isReadOnlyFromLogic, defaultValue
      if (fieldDependent.displayLogic) {
        isDisplayedFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          logic: fieldDependent.displayLogic
        })
      }
      //  Mandatory Logic
      if (fieldDependent.mandatoryLogic) {
        isMandatoryFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          logic: fieldDependent.mandatoryLogic
        })
      }
      //  Read Only Logic
      if (fieldDependent.readOnlyLogic) {
        isReadOnlyFromLogic = evaluator.evaluateLogic({
          context: getContext,
          parentUuid: field.parentUuid,
          containerUuid: field.containerUuid,
          logic: fieldDependent.readOnlyLogic
        })
      }
      //  Default Value
      if ((fieldDependent.defaultValue) &&
        fieldDependent.defaultValue.includes('@') &&
        !fieldDependent.defaultValue.includes('@SQL=')) {
        defaultValue = parseContext({
          parentUuid: field.parentUuid!,
          containerUuid: field.containerUuid,
          value: fieldDependent.defaultValue
        }).value
      }
      if (fieldDependent.defaultValue &&
        fieldDependent.defaultValue.includes('@SQL=')) {
        defaultValue = parseContext({
          parentUuid: field.parentUuid!,
          containerUuid: field.containerUuid,
          isSQL: true,
          value: fieldDependent.defaultValue
        }).query
        if (defaultValue !== fieldDependent.parsedDefaultValue) {
          const newValue = await context.dispatch(Namespaces.BusinessData + '/' + 'getValueBySQL', {
            parentUuid: field.parentUuid,
            containerUuid: field.containerUuid,
            query: defaultValue
          })
          //  Update values for field
          context.commit('updateValueOfField', {
            parentUuid: field.parentUuid,
            containerUuid: field.containerUuid,
            columnName: fieldDependent.columnName,
            value: newValue
          })

          // dispatch('notifyFieldChange', {
          //   parentUuid,
          //   containerUuid,
          //   isSendToServer,
          //   panelType: fieldDependent.panelType,
          //   columnName: fieldDependent.columnName,
          //   newValue
          // })
        }
      }

      context.commit('changeFieldLogic', {
        field: fieldDependent,
        isDisplayedFromLogic,
        isMandatoryFromLogic,
        isReadOnlyFromLogic,
        parsedDefaultValue: defaultValue
      })
    })
  },
  getPanelAndFields(context: PanelActionContext, payload: {
    parentUuid?: string
    containerUuid: string
    panelType: PanelContextType
    panelMetadata?: any
    tabMetadata?: any
    routeToDelete?: Route
    isAdvancedQuery?: boolean
  }) {
    const { isAdvancedQuery = payload.isAdvancedQuery || false, panelType, parentUuid, containerUuid, panelMetadata, routeToDelete, tabMetadata } = payload
    let executeAction: string
    switch (panelType) {
      case PanelContextType.Process:
      case PanelContextType.Report:
        executeAction = Namespaces.ProcessDefinition + '/' + 'getProcessFromServer'
        break
      case PanelContextType.Browser:
        executeAction = Namespaces.BrowserDefinition + '/' + 'getBrowserFromServer'
        break
      case PanelContextType.Form:
        executeAction = Namespaces.FormDefinition + '/' + 'getFormFromServer'
        break
      case PanelContextType.Window:
      case PanelContextType.Table:
      default:
        executeAction = Namespaces.WindowDefinition + '/' + 'getFieldsFromTab'
        break
    }

    return context.dispatch(executeAction, {
      parentUuid,
      containerUuid,
      panelType,
      panelMetadata,
      tabMetadata,
      isAdvancedQuery,
      routeToDelete
    }, { root: true })
      .then(panelResponse => {
        return panelResponse
      })
      .catch(error => {
        return {
          ...error,
          moreInfo: `Dictionary getPanelAndFields ${panelType} (State Panel).`
        }
      })
  },
  changePanelAttributesBoolean(context: PanelActionContext, params: {
    containerUuid: string
    attributeName: string
    attributeValue: any
  }) {
    const { containerUuid, attributeName } = params
    let { attributeValue } = params
    const panel = <IKeyValueObject>context.getters.getPanel(containerUuid)
    if (!(attributeValue)) {
      attributeValue = !panel[attributeName]
    }

    context.commit('changePanelAttribute', {
      panel,
      attributeName,
      attributeValue
    })
  },
  /**
   * Change a attribute in field state
   * @param {string} containerUuid
   * @param {string} columnName
   * @param {object} field
   * @param {string} attributeName
   * @param {mixed}  attributeValue
   */
  changeFieldAttribure(context: PanelActionContext, params: {
    containerUuid: string
    columnName: string
    field?: IFieldDataExtendedUtils
    attributeName: string
    attributeValue: any
  }): void {
    const { containerUuid, columnName, attributeValue, attributeName } = params
    let { field } = params
    if (!(field)) {
      field = context.getters.getFieldFromColumnName({
        containerUuid,
        columnName
      })
    }

    context.commit('changeFieldAttribure', {
      field,
      attributeName,
      attributeValue
    })
  },
  dictionaryResetCache(context: PanelActionContext): void {
    context.commit(Namespaces.Panel + '/' + 'dictionaryResetCache', undefined, { root: true })
    context.commit(Namespaces.Preference + '/' + 'dictionaryResetCacheContext', undefined, { root: true })
    context.commit(Namespaces.ContextMenu + '/' + 'dictionaryResetCacheContextMenu', undefined, { root: true })
    context.commit(Namespaces.WindowDefinition + '/' + 'dictionaryResetCacheWindow', undefined, { root: true })
    context.commit(Namespaces.ProcessDefinition + '/' + 'dictionaryResetCacheProcess', undefined, { root: true })
    context.commit(Namespaces.BrowserDefinition + '/' + 'dictionaryResetCacheBrowser', undefined, { root: true })
  }
}
