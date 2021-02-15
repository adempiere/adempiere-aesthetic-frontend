import evaluator from '@/ADempiere/shared/utils/evaluator'
import { parsedValueComponent } from '@/ADempiere/shared/utils/valueUtils'
import REFERENCES, {
  DEFAULT_SIZE,
  FIELDS_HIDDEN,
  IFieldReferencesType
} from '@/ADempiere/shared/utils/references'
import { FIELD_OPERATORS_LIST } from '@/ADempiere/shared/utils/dataUtils'
import language from '@/ADempiere/shared/lang'
import { IFieldData } from '@/ADempiere/modules/field'
import {
  parseContext,
  getPreference,
  getParentFields,
  getContext
} from '../contextUtils'
import {
  ActionContextName,
  ActionContextType,
  PanelContextType,
  PrintFormatOptions,
  ReportExportContextType
} from './ContextMenuType'
import {
  IActionAttributesData,
  IAdditionalAttributesData,
  IEvaluatedLogicsData,
  IFieldDataExtendedUtils
} from './type'
import { IReportExportTypeData } from '@/ADempiere/modules/dictionary/DictionaryType/DomainType'
import {
  IPrintFormatDataExtended,
  IProcessDataExtended
} from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import { IContextActionData } from '@/ADempiere/modules/window/WindowType/VuexType'
import {
  PrintFormatsAction,
  SummaryAction
} from '@/ADempiere/modules/dictionary/DictionaryType/ContextMenuType'

/**
 * Get parsed default value to set into field
 * @param {object}  field
 * @param {boolean} isSOTrxMenu
 */
export function getDefaultValue(field: {
    parentUuid: string
    containerUuid: string
    isSOTrxMenu: boolean
    columnName: string
    elementName: string
    componentPath: string
    displayType: number
    defaultValue: string
    isMandatory: boolean
    isKey: boolean
}) {
  const {
    defaultValue,
    parentUuid,
    containerUuid,
    isSOTrxMenu,
    columnName,
    isKey,
    isMandatory,
    elementName,
    componentPath,
    displayType
  } = field
  let parsedDefaultValue: string = defaultValue

  if (
    String(parsedDefaultValue).includes('@') &&
        String(parsedDefaultValue).trim() !== '-1'
  ) {
    parsedDefaultValue = parseContext({
      parentUuid,
      containerUuid,
      columnName,
      value: parsedDefaultValue,
      isSOTrxMenu
    }).value
  }

  if (
    !parsedDefaultValue &&
        !isKey &&
        String(parsedDefaultValue).trim() !== '-1'
  ) {
    parsedDefaultValue = getPreference({
      parentUuid,
      containerUuid,
      columnName
    })

    // search value preference with elementName
    if (elementName && !parsedDefaultValue) {
      parsedDefaultValue = getPreference({
        parentUuid,
        containerUuid,
        columnName: elementName
      })
    }
  }

  parsedDefaultValue = parsedValueComponent({
    columnName,
    componentPath,
    displayType,
    isMandatory,
    value: parsedDefaultValue
  })

  return parsedDefaultValue
}

/**
 * Evaluate by the ID and name of the reference to call the component type
 * @param {integer} displayTypeId, received from data
 * @param {boolean} isAllInfo
 * @return string type, assigned value to folder after evaluating the parameter
 */
export function evalutateTypeField(
  displayTypeId: number,
  isAllInfo?: boolean
): IFieldReferencesType | string {
  const newIsAllInfo = isAllInfo !== undefined ? isAllInfo : true
  const component: IFieldReferencesType = REFERENCES.find(
    reference => displayTypeId === reference.id
  )!

  if (newIsAllInfo) {
    return component!
  }

  return component!.valueType
}

/**
 * Evaluate logics to definition field
 * @param {object}
 */
export function getEvaluatedLogics(field: {
    parentUuid: string
    containerUuid: string
    isDisplayed?: boolean
    displayLogic: string
    mandatoryLogic: string
    readOnlyLogic: string
}) {
  field.isDisplayed =
        field.isDisplayed === undefined ? true : field.isDisplayed
  const {
    parentUuid,
    containerUuid,
    isDisplayed,
    displayLogic,
    mandatoryLogic,
    readOnlyLogic
  } = field
  // evaluate logics
  const commonParameters: {
        parentUuid: string
        containerUuid: string
        context: Function
    } = {
      parentUuid,
      containerUuid,
      context: getContext
    }

  let isDisplayedFromLogic: boolean = isDisplayed
  if (displayLogic) {
    isDisplayedFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: displayLogic
    })
  }

  let isMandatoryFromLogic = false
  if (mandatoryLogic) {
    isMandatoryFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: mandatoryLogic
    })
  }

  let isReadOnlyFromLogic = false
  if (readOnlyLogic) {
    isReadOnlyFromLogic = evaluator.evaluateLogic({
      ...commonParameters,
      logic: readOnlyLogic
    })
  }

  return {
    isDisplayedFromLogic,
    isMandatoryFromLogic,
    isReadOnlyFromLogic
  }
}

export function generateField(data: {
    fieldToGenerate: IFieldData
    moreAttributes: IAdditionalAttributesData
    typeRange?: boolean // false
    isSOTrxMenu?: boolean
}): IFieldDataExtendedUtils {
  data.typeRange = data.typeRange || false
  const { fieldToGenerate, moreAttributes, typeRange, isSOTrxMenu } = data
  let isShowedFromUser = false
  let isSQLValue = false

  // verify if it no overwrite value with ...moreAttributes
  if (moreAttributes.isShowedFromUser) {
    isShowedFromUser = moreAttributes.isShowedFromUser
  }

  const componentReference: IFieldReferencesType = evalutateTypeField(
    fieldToGenerate.displayType
  ) as IFieldReferencesType

  let evaluatedLogics: IEvaluatedLogicsData = {
    isDisplayedFromLogic: fieldToGenerate.isDisplayed,
    isMandatoryFromLogic: false,
    isReadOnlyFromLogic: false
  }

  let parentFieldsList: string[] = []
  let parsedDefaultValue: string | undefined = fieldToGenerate.defaultValue
  let parsedDefaultValueTo: string | undefined =
        fieldToGenerate.defaultValueTo
  let operator = 'EQUAL'
  let isNumericField: boolean =
        componentReference.componentPath === 'FieldNumber'
  let isTranslatedField: boolean = fieldToGenerate.isTranslated
  let isComparisonField = false // to list operators comparison
  let operatorsList: any[] = []
  if (moreAttributes.isAdvancedQuery) {
    isNumericField = false
    isTranslatedField = false
    parsedDefaultValue = undefined
    parsedDefaultValueTo = undefined

    // set field operators list
    isComparisonField = ![
      'FieldBinary',
      'FieldButton',
      'FieldImage'
    ].includes(componentReference.componentPath)
    if (isComparisonField) {
      const operatorsField = FIELD_OPERATORS_LIST.find(item => {
        return item.componentPath === componentReference.componentPath
      })
      if (operatorsField) {
        operatorsList = operatorsField.operatorsList
      }
    }

    if (
      ['FieldText', 'FieldTextLong'].includes(
        componentReference.componentPath
      )
    ) {
      operator = 'LIKE'
    }
  } else {
    parsedDefaultValue = getDefaultValue({
      ...fieldToGenerate,
      parentUuid: moreAttributes.parentUuid
        ? moreAttributes.parentUuid
        : '',
      containerUuid: moreAttributes.containerUuid,
      componentPath: componentReference.componentPath,
      isSOTrxMenu: isSOTrxMenu || false
    })

    if (String(fieldToGenerate.defaultValue).includes('@SQL=')) {
      isShowedFromUser = true
      isSQLValue = true
    }

    // VALUE TO
    if (fieldToGenerate.isRange) {
      parsedDefaultValueTo = getDefaultValue({
        ...fieldToGenerate,
        parentUuid: moreAttributes.parentUuid
          ? moreAttributes.parentUuid
          : '',
        containerUuid: moreAttributes.containerUuid,
        componentPath: componentReference.componentPath,
        defaultValue: fieldToGenerate.defaultValueTo,
        columnName: `${fieldToGenerate.columnName}_To`,
        elementName: `${fieldToGenerate.elementName}_To`,
        isSOTrxMenu: isSOTrxMenu || false
      })
    }

    parentFieldsList = getParentFields(fieldToGenerate)

    // evaluate logics (diplayed, mandatory, readOnly)
    evaluatedLogics = getEvaluatedLogics({
      parentUuid: moreAttributes.parentUuid || '',
      containerUuid: moreAttributes.containerUuid,
      ...fieldToGenerate
    })
  }

  const field: IFieldDataExtendedUtils = {
    ...fieldToGenerate,
    ...moreAttributes,
    columnNameTo: undefined,
    elementNameTo: undefined,
    isSOTrxMenu,
    // displayed attributes
    componentPath: componentReference.componentPath,
    isSupported: componentReference.isSupported,
    size: componentReference.size || DEFAULT_SIZE,
    // TODO: Property 'displayColumn' is @depecated
    displayColumn: undefined, // link to value from selects and table
    displayColumnName: `DisplayColumn_${fieldToGenerate.columnName}`, // key to display column
    // value attributes
    value:
            String(parsedDefaultValue).trim() === ''
              ? undefined
              : parsedDefaultValue,
    oldValue: parsedDefaultValue,
    valueTo: parsedDefaultValueTo,
    parsedDefaultValue,
    parsedDefaultValueTo,
    // logics to app (isDisplayedFromLogic, isMandatoryFromLogic, isReadOnlyFromLogic)
    ...evaluatedLogics,
    //
    parentFieldsList,
    dependentFieldsList: [],
    // TODO: Add support on server
    // app attributes
    isShowedFromUser,
    isShowedFromUserDefault: isShowedFromUser, // set this value when reset panel
    isShowedTableFromUser: fieldToGenerate.isDisplayed,
    isFixedTableColumn: false,
    valueType: componentReference.valueType, // value type to convert with gGRPC
    isSQLValue,
    // Advanced query
    operator, // current operator
    oldOperator: undefined, // old operator
    defaultOperator: operator,
    operatorsList,
    // popover's
    isComparisonField,
    isNumericField,
    isTranslatedField
  }

  // Overwrite some values
  if (field.isRange) {
    field.operator = 'GREATER_EQUAL'
    field.columnNameTo = `${field.columnName}_To`
    field.elementNameTo = `${field.elementNameTo}_To`
    if (typeRange) {
      field.uuid = `${field.uuid}_To`
      field.columnName = field.columnNameTo
      field.elementName = field.elementNameTo
      field.name = `${field.name} To`
      field.value = parsedDefaultValueTo
      field.defaultValue = field.defaultValueTo
      field.parsedDefaultValue = field.parsedDefaultValueTo
      field.operator = 'LESS_EQUAL'
    }
  }

  // hidden field type button
  const notShowedField = FIELDS_HIDDEN.find(itemField => {
    return field.displayType === itemField.id
  })
  if (notShowedField) {
    field.isDisplayedFromLogic = false
    field.isDisplayed = false
  }

  return field
}

export function generateProcess(data: {
    processToGenerate: IProcessDataExtended
    containerUuidAssociated?: string
}) {
  const { processToGenerate, containerUuidAssociated } = data
  const panelType: PanelContextType = processToGenerate.isReport
    ? PanelContextType.Report
    : PanelContextType.Process

  const additionalAttributes: IAdditionalAttributesData = {
    processUuid: processToGenerate.uuid,
    processId: processToGenerate.id,
    processName: processToGenerate.name,
    containerUuid: processToGenerate.uuid,
    isEvaluateValueChanges: true,
    panelType
  }

  //  Convert from gRPC
  let fieldDefinitionList: IFieldDataExtendedUtils[] = []
  if (processToGenerate.parameters) {
    const fieldsRangeList: IFieldDataExtendedUtils[] = []

    fieldDefinitionList = processToGenerate.parameters.map(
      (fieldItem: IFieldData) => {
        const field: IFieldDataExtendedUtils = generateField({
          fieldToGenerate: fieldItem,
          moreAttributes: additionalAttributes
        })
        // Add new field if is range number
        if (field.isRange && field.componentPath === 'FieldNumber') {
          const fieldRange: IFieldDataExtendedUtils = generateField({
            fieldToGenerate: fieldItem,
            moreAttributes: additionalAttributes,
            typeRange: true
          })
          if (fieldRange.value) {
            fieldRange.isShowedFromUser = true
          }
          fieldsRangeList.push(fieldRange)
        }

        // if field with value displayed in main panel
        if (field.value) {
          field.isShowedFromUser = true
        }

        return field
      }
    )
    fieldDefinitionList = fieldDefinitionList.concat(fieldsRangeList)
  }

  const actions: IContextActionData[] = []
  actions.push(
    {
      name: language.t('components.RunProcess'),
      processName: processToGenerate.name,
      type: ActionContextType.Action,
      action: ActionContextName.StartProcess,
      uuid: processToGenerate.uuid,
      id: processToGenerate.id,
      description: processToGenerate.description,
      isReport: processToGenerate.isReport,
      isDirectPrint: processToGenerate.isDirectPrint,
      reportExportType: ReportExportContextType.Html
    },
    {
      name: language.t('components.ChangeParameters'),
      processName: processToGenerate.name,
      type: ActionContextType.Process,
      action: ActionContextName.ChangeParameters,
      uuid: processToGenerate.uuid,
      id: processToGenerate.id,
      description: processToGenerate.description,
      isReport: processToGenerate.isReport,
      isDirectPrint: processToGenerate.isDirectPrint
    }
  )

  const summaryAction: SummaryAction = {
    name: language.t('components.RunProcessAs'),
    processName: processToGenerate.name,
    type: ActionContextType.Summary,
    action: ActionContextName.Empty,
    childs: [],
    uuid: processToGenerate.uuid,
    id: processToGenerate.id,
    description: processToGenerate.description,
    isReport: processToGenerate.isReport,
    isDirectPrint: processToGenerate.isDirectPrint
  }

  processToGenerate.reportExportTypes.forEach(
    (actionValue: IReportExportTypeData) => {
      // push values
      summaryAction.childs.push({
        name: `${language.t('components.ExportTo')} (${
                    actionValue.name
                })`,
        processName: processToGenerate.name,
        type: ActionContextType.Action,
        action: ActionContextName.StartProcess,
        uuid: processToGenerate.uuid,
        id: processToGenerate.id,
        description: actionValue.description,
        isReport: processToGenerate.isReport,
        isDirectPrint: processToGenerate.isDirectPrint,
        reportExportType: <ReportExportContextType>(
                    actionValue.type
                )
      })
    }
  )

  const printFormats: PrintFormatsAction = {
    name: language.t('views.printFormat'),
    processName: processToGenerate.name,
    type: ActionContextType.Summary,
    action: ActionContextName.Empty,
    childs: [],
    option: PrintFormatOptions.PrintFormat,
    uuid: processToGenerate.uuid,
    id: processToGenerate.id,
    description: processToGenerate.description,
    isReport: processToGenerate.isReport,
    isDirectPrint: processToGenerate.isDirectPrint,
    process: processToGenerate
  }

  processToGenerate.printFormatsAvailable.forEach(
    (actionValue: IPrintFormatDataExtended) => {
      //  Push values
      printFormats.childs.push({
        name: actionValue.name,
        processName: processToGenerate.name,
        type: ActionContextType.Action,
        action: ActionContextName.StartProcess,
        uuid: processToGenerate.uuid,
        id: processToGenerate.id,
        description: actionValue.description,
        isReport: processToGenerate.isReport,
        isDirectPrint: processToGenerate.isDirectPrint,
        reportExportType: undefined,
        printFormatUuid: actionValue.printFormatUuid
      })
    }
  )
  //  Add summary Actions
  actions.push(summaryAction)
  actions.push(printFormats)

  const processDefinition = {
    ...processToGenerate,
    ...additionalAttributes,
    isAssociated: Boolean(containerUuidAssociated),
    containerUuidAssociated,
    fieldsList: fieldDefinitionList
  }

  return {
    processDefinition,
    actions
  }
}

/**
 * Determinate if field is displayed
 * @param {boolean} isActive
 * @param {boolean} isDisplayed
 * @param {boolean} isDisplayedFromLogic
 * @param {boolean} isQueryCriteria
 * @param {string}  panelType
 * @returns {boolean}
 */
export function fieldIsDisplayed(data: {
    panelType: PanelContextType
    isActive: boolean
    isDisplayed: boolean
    isDisplayedFromLogic: boolean
    isQueryCriteria: boolean
}) {
  const {
    panelType,
    isActive,
    isDisplayed,
    isDisplayedFromLogic,
    isQueryCriteria
  } = data
  // Verify if field is active
  if (!isActive) {
    return false
  }

  // browser query criteria
  if (panelType === PanelContextType.Browser) {
    return isQueryCriteria
  }

  // window, table (advanced query), process and report, browser (table) result
  return isDisplayed && isDisplayedFromLogic
}

/**
 * Order the fields, then assign the groups to each field, and finally group
 * in an array according to each field group to show in panel (or table).
 * @param {array} arr
 * @param {string} orderBy
 * @param {string} type
 * @param {string} panelType
 * @returns {array}
 */
export function sortFields(params: {
    fieldsList: IFieldDataExtendedUtils[]
    orderBy?: string
    type?: string
}): IFieldDataExtendedUtils[] {
  params.orderBy = params.orderBy || 'sequence'
  params.type = params.type || 'asc'
  const { fieldsList, type, orderBy } = params

  if (type.toLowerCase() === 'asc') {
    fieldsList.sort((itemA, itemB) => {
      return itemA.sequence - itemB.sequence
      // return itemA[orderBy] - itemB[orderBy]
      // return itemA[orderBy] > itemB[orderBy]
    })
  } else {
    fieldsList.sort((itemA, itemB) => {
      return itemA.sequence + itemB.sequence
      // return itemA[orderBy] + itemB[orderBy]
      // return itemA[orderBy] > itemB[orderBy]
    })
  }
  // if (type.toLowerCase() === 'desc') {
  //   return fieldsList.reverse()
  // }
  return fieldsList
}

/**
 * [assignedGroup]
 * @param  {array} fieldsList Field of List with
 * @return {array} fieldsList
 */
export function assignedGroup(params: {
    fieldsList?: IFieldDataExtendedUtils[]
    groupToAssigned?: string
    orderBy?: string
}): IFieldDataExtendedUtils[] | undefined {
  let { fieldsList, groupToAssigned, orderBy } = params
  if (fieldsList === undefined || fieldsList.length <= 0) {
    return fieldsList
  }

  fieldsList = sortFields({
    fieldsList,
    orderBy
  })

  let firstChangeGroup = false
  let currentGroup = ''
  let typeGroup = ''

  fieldsList.forEach(fieldElement => {
    if (fieldElement.panelType !== PanelContextType.Window) {
      // fieldElement.groupAssigned = ''
      // fieldElement.typeGroupAssigned = ''
      fieldElement.fieldGroup.groupName = ''
      fieldElement.fieldGroup.groupType = ''
      return
    }

    // change the first field group, change the band
    if (!firstChangeGroup) {
      if (
        fieldElement.fieldGroup.name &&
                currentGroup !== fieldElement.fieldGroup.name &&
                fieldElement.isDisplayed
      ) {
        firstChangeGroup = true
      }
    }
    //  if you change the field group for the first time and it is different
    //  from 0, updates the field group, since it is another field group and
    //  assigns the following field items to the current field group whose
    //  field group is '' or null
    if (firstChangeGroup) {
      if (fieldElement.fieldGroup.name) {
        currentGroup = fieldElement.fieldGroup.name
        typeGroup = fieldElement.fieldGroup.fieldGroupType!
      }
    }

    // fieldElement.groupAssigned = currentGroup
    // fieldElement.typeGroupAssigned = typeGroup
    fieldElement.fieldGroup.groupName = currentGroup
    fieldElement.fieldGroup.groupType = typeGroup

    if (groupToAssigned !== undefined) {
      // fieldElement.groupAssigned = groupToAssigned
      fieldElement.fieldGroup.groupName = groupToAssigned
    }
  })

  return fieldsList
}

export function convertAction(action: any): IActionAttributesData {
  const actionAttributes: IActionAttributesData = {
    name: '',
    icon: '',
    hidden: false,
    isIndex: false,
    component: () => import('@/ADempiere/shared/views/Unsupported')
  }

  switch (action) {
    case 'B':
      actionAttributes.name = 'workbech'
      actionAttributes.icon = 'peoples'
      break
    case 'F':
      actionAttributes.name = 'workflow'
      actionAttributes.icon = 'example'
      break
    case 'P':
      actionAttributes.name = 'process'
      actionAttributes.icon = 'component'
      actionAttributes.component = () => import('@/ADempiere/modules/process/views/Process')
      break
    case 'R':
      actionAttributes.name = 'report'
      actionAttributes.icon = 'skill'
      actionAttributes.component = () => import('@/ADempiere/modules/process/views/Process')
      break
    case 'S':
      actionAttributes.name = 'browser'
      actionAttributes.icon = 'search'
      actionAttributes.component = () => import('@/ADempiere/modules/persistence/views/Browser')
      break
    case 'T':
      actionAttributes.name = 'task'
      actionAttributes.icon = 'size'
      break
    case 'W':
      actionAttributes.name = 'window'
      actionAttributes.icon = 'tab'
      actionAttributes.component = () => import('@/ADempiere/modules/window/views/Window')
      break
    case 'X':
      actionAttributes.name = 'form'
      actionAttributes.icon = 'form'
      actionAttributes.component = () => import('@/ADempiere/modules/dictionary/views/Form')
      break
    default:
      actionAttributes.name = 'summary'
      actionAttributes.icon = 'nested'
      // actionAttributes.hidden = true
      actionAttributes.isIndex = true
      actionAttributes.component = () => import('@/ADempiere/shared/views/Summary')
      break
  }
  return actionAttributes
}
