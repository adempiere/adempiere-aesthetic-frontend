import { IPanelDataExtended } from '@/ADempiere/modules/dictionary'
import { KeyValueData } from '@/ADempiere/modules/persistence'
import { specialColumns } from '@/ADempiere/shared/utils/contextUtils'
import { fieldIsDisplayed, getDefaultValue } from '@/ADempiere/shared/utils/DictionaryUtils'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { ActionContext, GetterTree } from 'vuex'
import { RootState } from '@/ADempiere/shared/store/types'
import { IPanelParameters, IRangeAttributeData, PanelState } from './type'
import { PanelContextType } from '@/ADempiere/shared/utils/DictionaryUtils/ContextMenuType'
import { parsedValueComponent } from '@/ADempiere/shared/utils/valueUtils'

type PanelGetterTree = GetterTree<PanelState, RootState>
type PanelActionContext = ActionContext<PanelState, RootState>

export const getters: PanelGetterTree = {
  getPanel: (state: PanelState) => (
    containerUuid: string
  ): IPanelDataExtended | undefined => {
    return state.panel.find((item: IPanelDataExtended) => {
      // uuid as containerUuid alias
      return item.containerUuid === containerUuid
    })
  },
  getFieldsListFromPanel: (state: PanelState, getters) => (
    containerUuid: string
  ): IFieldDataExtendedUtils[] => {
    const panel = <IPanelDataExtended | undefined>(
            getters.getPanel(containerUuid)
        )
    if (!panel) {
      return []
    }
    return panel.fieldsList
  },
  getParsedDefaultValues: (state: PanelState, getters) => (payload: {
        parentUuid: string
        containerUuid: string
        isGetServer?: boolean
        isSOTrxMenu: boolean
        fieldsList?: IFieldDataExtendedUtils[]
        formatToReturn?: string
    }): IRangeAttributeData[] | IKeyValueObject<String> => {
    payload.isGetServer = payload.isGetServer || true
    payload.fieldsList = payload.fieldsList || []
    payload.formatToReturn = payload.formatToReturn || 'array'
    const {
      containerUuid,
      parentUuid,
      isSOTrxMenu,
      isGetServer,
      formatToReturn
    } = payload
    let { fieldsList = payload.fieldsList || [] } = payload
    if (!fieldsList) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }
    const attributesRangue: IRangeAttributeData[] = []
    const attributesObject: IKeyValueObject<String> = {}

    let attributesList = fieldsList.map(
      (fieldItem: IFieldDataExtendedUtils) => {
        const { columnName, defaultValue } = fieldItem
        let isSQL = false
        let parsedDefaultValue: string = fieldItem.parsedDefaultValue
          ? fieldItem.parsedDefaultValue
          : ''
        const isSpeciaColumn: boolean =
                    specialColumns.includes(columnName) ||
                    specialColumns.includes(fieldItem.elementName)

        if (String(defaultValue).includes('@') || isSpeciaColumn) {
          parsedDefaultValue = getDefaultValue({
            // ...fieldItem,
            columnName: fieldItem.columnName,
            componentPath: fieldItem.componentPath!,
            containerUuid: fieldItem.containerUuid,
            defaultValue: fieldItem.defaultValue,
            displayType: fieldItem.displayType,
            elementName: fieldItem.elementName,
            isKey: fieldItem.isKey,
            isMandatory: fieldItem.isMandatory,
            parentUuid,
            isSOTrxMenu
          })
          if (String(defaultValue).includes('@SQL=') && isGetServer) {
            isSQL = true
          }
        }
        attributesObject[columnName] = parsedDefaultValue

        if (
          fieldItem.isRange &&
                    fieldItem.componentPath !== 'FieldNumber'
        ) {
          const {
            columnNameTo = fieldItem.columnNameTo || '',
            elementNameTo,
            defaultValueTo
          } = fieldItem
          let parsedDefaultValueTo: string = fieldItem.parsedDefaultValueTo!
          let isSQLTo = false
          if (
            String(defaultValueTo).includes('@') ||
                        isSpeciaColumn
          ) {
            if (
              String(defaultValueTo).includes('@SQL=') &&
                            isGetServer
            ) {
              isSQLTo = true
            }

            parsedDefaultValueTo = getDefaultValue({
              // ...fieldItem,
              componentPath: fieldItem.componentPath!,
              containerUuid: fieldItem.containerUuid,
              defaultValue: fieldItem.defaultValue,
              displayType: fieldItem.displayType,
              isKey: fieldItem.isKey,
              isMandatory: fieldItem.isMandatory,
              parentUuid,
              isSOTrxMenu,
              columnName: columnNameTo!,
              elementName: elementNameTo!
            })
          }

          attributesObject[columnNameTo] = parsedDefaultValueTo
          attributesRangue.push({
            columnName: columnNameTo,
            value: parsedDefaultValueTo,
            // valueType: fieldItem.valueType,
            isSQL: isSQLTo
          })
        }

        // add display column to default
        if (
          fieldItem.componentPath === 'FieldSelect' &&
                    fieldItem.value === parsedDefaultValue
        ) {
          if (
            fieldItem.displayColumnName &&
                        fieldItem.displayColumn
          ) {
            // TODO: Verify displayColumn attribute, or get dispay column to fieldValue store
            attributesObject[fieldItem.displayColumnName] =
                            fieldItem.displayColumn
          }
        }

        return {
          columnName,
          value: parsedDefaultValue,
          // valueType: fieldItem.valueType,
          isSQL
        }
      }
    )
    if (formatToReturn === 'array') {
      attributesList = attributesList.concat(attributesRangue)
      return attributesList
    }
    return attributesObject
  },
  /**
     * @param {string}  containerUuid, unique identifier of the panel to search your list of fields
     * @param {string}  propertyName, property name to return its value (value, oldValue)
     * @param {boolean} isObjectReturn, define if is an object to return, else arraylist return
     * @param {boolean} isEvaluateValues, define if evaluate emty values
     * @param {boolean} isAddDisplayColumn, define if return display columns
     * @param {boolean} isAddRangeColumn, define if return rangue columns_To
     * @param {array} withOut, define if return display columns
     * @param {array} isEvaluatedChangedValue, define if return only fields with values changes
     * @returns {array|object}
     */
  getColumnNamesAndValues: (state: PanelState, getters) => (payload: {
        containerUuid: string
        propertyName?: string
        isObjectReturn?: boolean
        isEvaluateValues?: boolean
        isAddDisplayColumn?: boolean
        isAddRangeColumn?: boolean
        withOut?: any[]
        isEvaluatedChangedValue?: boolean
        fieldsList?: IFieldDataExtendedUtils[]
    }): KeyValueData[] | IKeyValueObject => {
    const {
      containerUuid,
      propertyName = payload.propertyName || 'value',
      isObjectReturn = payload.isObjectReturn || false,
      isEvaluateValues = payload.isEvaluateValues || false,
      isAddDisplayColumn = payload.isAddDisplayColumn || false,
      isAddRangeColumn = payload.isAddRangeColumn || false,
      withOut = payload.withOut || [],
      isEvaluatedChangedValue = payload.isEvaluatedChangedValue || false
    } = payload

    let { fieldsList = payload.fieldsList || [] } = payload

    if (!fieldsList) {
      fieldsList = getters.getFieldsListFromPanel(containerUuid)
    }

    let attributesList: IFieldDataExtendedUtils[] = fieldsList
    let attributesListResult: KeyValueData[] = []
    const attributesObject: IKeyValueObject = {}
    const displayColumnsList: KeyValueData[] = []
    const rangeColumnsList: KeyValueData[] = []

    if (withOut.length || isEvaluatedChangedValue || isEvaluateValues) {
      attributesList = attributesList.filter(fieldItem => {
        // columns to exclude
        if (withOut.includes(fieldItem.columnName)) {
          return false
        }
        // if value is changed
        if (
          isEvaluatedChangedValue &&
                    fieldItem.value === fieldItem.oldValue
        ) {
          return false
        }
        // TODO: Evaluate valueTo for range
        if (isEvaluateValues && !fieldItem.value) {
          return false
        }
        return true
      })
    }

    attributesListResult = attributesList.map(
      (fieldItem: IFieldDataExtendedUtils) => {
        const objectField = <IKeyValueObject<any>>fieldItem
        const valueToReturn = objectField[propertyName]
        attributesObject[fieldItem.columnName] = valueToReturn

        // Add display columns if field has value
        if (objectField[propertyName] && fieldItem.displayColumn) {
          // TODO: Verify displayColumn attribute, or get dispay column to fieldValue store
          attributesObject[fieldItem.displayColumnName!] =
                        fieldItem.displayColumn
          displayColumnsList.push({
            key: fieldItem.displayColumnName!, // Key represents ColumnName
            value: fieldItem.displayColumn
          })
        }

        // add range columns
        if (isAddRangeColumn && fieldItem.isRange) {
          attributesObject[`${fieldItem.columnName}_To`] =
                        fieldItem.valueTo
          rangeColumnsList.push({
            key: `${fieldItem.columnName}_To`, // Key represents ColumnName
            value: fieldItem.valueTo
            // valueType: fieldItem.valueType
          })
        }

        return {
          key: fieldItem.columnName, // Key represents ColumnName
          value: valueToReturn
          // valueType: fieldItem.valueType
        }
      }
    )

    if (isAddDisplayColumn) {
      attributesListResult = attributesListResult.concat(
        displayColumnsList,
        rangeColumnsList
      )
    }

    if (isObjectReturn) {
      return attributesObject
    }

    return attributesListResult
  },
  /**
     * Getter converter selection params with value format
     * @param {String} containerUuid
     * @param {Object} row
     * @param {Array<Object>} fieldsList
     * @param {Array<String>} withOutColumnNames
     * @param {Boolean} isEvaluateMandatory, default value is true
     * @returns {Array<Object>} [{ columnName: name key, value: value to send, operator }]
     */
  getParametersToServer: (
    state: PanelState,
    context: PanelActionContext
  ) => (payload: {
        containerUuid: string
        row: IKeyValueObject
        fieldsList: IFieldDataExtendedUtils[]
        withOutColumnNames: string[]
        isEvaluateMandatory: boolean
    }): IPanelParameters[] => {
    const {
      containerUuid,
      row,
      withOutColumnNames = payload.withOutColumnNames || [],
      isEvaluateMandatory = payload.isEvaluateMandatory || true
    } = payload
    let { fieldsList = payload.fieldsList || [] } = payload

    if (!fieldsList) {
      fieldsList = context.getters.getFieldsListFromPanel(containerUuid)
    }
    const parametersRange: IPanelParameters[] = []

    // filter fields
    const parametersList: IFieldDataExtendedUtils[] = fieldsList.filter(fieldItem => {
      const { columnName } = fieldItem

      // columns to exclude
      if (withOutColumnNames.includes(columnName)) {
        return false
      }

      // exclude key column if is new
      if (row && row.isNew && fieldItem.isKey) {
        return false
      }

      const isMandatory = Boolean(
        fieldItem.isMandatory || fieldItem.isMandatoryFromLogic
      )
      // mandatory fields
      if (isEvaluateMandatory && fieldItem.panelType !== PanelContextType.Browser) {
        if (isMandatory && !fieldItem.isAdvancedQuery) {
          return true
        }
      }

      // evaluate displayed fields
      let isDisplayed: boolean | undefined = fieldItem.isShowedFromUser
      if (!fieldItem.isAdvancedQuery) {
        // window, process, browser, form
        isDisplayed =
                    fieldIsDisplayed(fieldItem) &&
                    (fieldItem.isShowedFromUser || isMandatory)
      }

      if (isDisplayed) {
        // from table
        if (row) {
          if (row[columnName]) {
            return true
          }
          return false
        }

        // from field value
        const value = context.rootGetters.getValueOfField({
          parentUuid: fieldItem.parentUuid,
          containerUuid,
          columnName
        })
        let valueTo
        if (
          fieldItem.isRange &&
                    fieldItem.componentPath !== 'FieldNumber'
        ) {
          valueTo = context.rootGetters.getValueOfField({
            parentUuid: fieldItem.parentUuid,
            containerUuid,
            columnName: fieldItem.columnNameTo
          })
        }
        if (
          (value) ||
                    (valueTo) ||
                    (fieldItem.isAdvancedQuery &&
                        ['NULL', 'NOT_NULL'].includes(fieldItem.operator!))
        ) {
          return true
        }
      }

      return false
    })

    // conever parameters
    const parameters: IPanelParameters[] = parametersList.map((parameterItem: IFieldDataExtendedUtils) => {
      const { columnName, isRange } = parameterItem
      let value
      let valueTo
      if (row) {
        value = row[columnName]
        valueTo = row[parameterItem.columnNameTo!]
      } else {
        value = context.rootGetters.getValueOfField({
          parentUuid: parameterItem.parentUuid,
          containerUuid,
          columnName: columnName
        })
      }

      let values: any[] = []
      if (
        parameterItem.isAdvancedQuery &&
                ['IN', 'NOT_IN'].includes(parameterItem.operator!)
      ) {
        if (Array.isArray(value)) {
          values = value.map(itemValue => {
            const isMandatory: boolean =
                            !parameterItem.isAdvancedQuery &&
                            (parameterItem.isMandatory ||
                                parameterItem.isMandatoryFromLogic)

            return parsedValueComponent({
              columnName,
              componentPath: parameterItem.componentPath!,
              displayType: parameterItem.displayType,
              isMandatory,
              value: itemValue
            })
          })
        } else {
          values.push(value)
        }
        value = undefined
      }

      let operator: string
      // set default operator of field
      if (
        parameterItem.isAdvancedQuery ||
                ['process', 'report'].includes(parameterItem.panelType)
      ) {
        operator = parameterItem.operator!
      }
      // only to fields type Time, Date and DateTime, and is range, with values
      // manage as Array = [value, valueTo]
      if (isRange && parameterItem.componentPath !== 'FieldNumber') {
        valueTo = context.rootGetters.getValueOfField({
          parentUuid: parameterItem.parentUuid,
          containerUuid,
          columnName: parameterItem.columnNameTo
        })
        operator = 'LESS_EQUAL' // operand to value is second position of array
        parametersRange.push({
          columnName: parameterItem.columnNameTo!,
          operator,
          // valueType: parameterItem.valueType,
          value: valueTo
        })
        operator = 'GREATER_EQUAL' // rewrite to assign first position of array
      }

      return {
        columnName,
        value,
        // valueType: parameterItem.valueType,
        values,
        operator: operator!
      }
    })

    // parametersList = parametersList.concat(parametersRange)
    parameters.concat(parametersRange)
    return parameters
  }
}
