import { getParentFields } from './contextUtils'
import {
  evalutateTypeField,
  getDefaultValue,
  getEvaluatedLogics
} from './DictionaryUtils'
import {
  CHAR,
  DEFAULT_SIZE,
  IFieldReferencesType,
  ISizeData,
  TABLE_DIRECT
} from '@/ADempiere/shared/utils/references'
import {
  IAdditionalAttributesData,
  IFieldDataExtendedUtils
} from './DictionaryUtils/type'
import { PanelContextType } from './DictionaryUtils/ContextMenuType'
import store from '@/ADempiere/shared/store'
import { IFieldDataExtended } from '@/ADempiere/modules/dictionary'

export interface IOverwriteDefinitionData extends IAdditionalAttributesData {
    isShowedFromUser: boolean
    name: string
    columnName: string
    componentPath: string
    displayType?: number
    size?: ISizeData | number
    //
    index?: number
    isCustomField?: boolean
    isActiveLogics?: boolean
    defaultValue?: string
    sequenceFields?: string
    isDisplayed?: boolean
    //
    sequence?: number
    handleActionPerformed?: boolean
    isSendParentValues?: boolean
    popoverPlacement?: string
    handleActionKeyPerformed?: boolean
    handleContentSelection?: boolean
    isMandatory?: boolean
    displayLogic?: string
    validationCode?: string
    isReadOnly?: boolean
}

export type IFieldTemplateMetadataType = Partial<IFieldDataExtendedUtils> & {
  handleFocusGained: boolean
  handleFocusLost: boolean
  handleKeyPressed: boolean
  handleKeyReleased: boolean
  handleActionKeyPerformed: boolean
  handleActionPerformed: boolean
}

export type IFieldTemplateData = IFieldTemplateMetadataType & {
  isDisplayedFromLogic: boolean
  isMandatoryFromLogic: boolean
  isReadOnlyFromLogic: boolean
  parsedDefaultValue: string
  parsedDefaultValueTo: string
  parentFieldsList: string[]
}

export type IFieldReduced = Omit<IFieldDataExtendedUtils,
'isEncrypted'
| 'isQuickEntry'
| 'sortNo'
| 'isParent'
| 'isAlwaysUpdateable'
| 'isAllowCopy'
| 'fieldLength'
| 'isAllowLogging'
| 'isTranslated'
| 'isDisplayedGrid'
| 'isOrderBy'
| 'isinfoOnly'
| 'fieldDefinition'
| 'identifierSequence'
| 'isHeading'
| 'columnSQL'
>

// Default template for injected fields
export function getFieldTemplate(
  overwriteDefinition: IOverwriteDefinitionData
): IFieldTemplateData {
  let displayType: number = CHAR.id // String reference (10)
  if (overwriteDefinition.displayType) {
    displayType = overwriteDefinition.displayType
  }

  const componentReference: IFieldReferencesType = <IFieldReferencesType>(
        evalutateTypeField(displayType)
    )
    // set size from displayed, max 24
  let size: ISizeData | number = DEFAULT_SIZE
  if (componentReference.size) {
    size = componentReference.size
  }
  // rewrite size default size field
  if (overwriteDefinition.size) {
    size = overwriteDefinition.size
    delete overwriteDefinition.size
    if (typeof size === 'number') {
      size = {
        xs: size,
        sm: size,
        md: size,
        lg: size,
        xl: size
      }
    }
  }

  const fieldTemplateMetadata: IFieldTemplateMetadataType = {
    elementName: '',
    // isEncrypted: false,
    // isQuickEntry: false,
    // sortNo: 1,
    // isParent: false,
    // isAlwaysUpdateable: false,
    // isAllowCopy: false,
    // fieldLength: 2,
    // isAllowLogging: false,
    // isTranslated: false,
    // isDisplayedGrid: false,
    // isOrderBy: false,
    // isinfoOnly: false,
    // fieldDefinition: {},
    // identifierSequence: 0,
    // isHeading: false,
    // columnSQL: '',

    ...overwriteDefinition,
    id: 0,
    uuid: '',
    name: overwriteDefinition.name || '',
    description: '',
    help: '',
    columnName: overwriteDefinition.columnName || '',
    displayColumnName: `DisplayColumn_${overwriteDefinition.columnName}`, // key to display column
    fieldGroup: {
      name: '',
      fieldGroupType: ''
    },
    displayType,
    componentPath:
            overwriteDefinition.componentPath ||
            componentReference.componentPath,
    size,
    isFieldOnly: false,
    isRange: false,
    isSameLine: false,
    sequence: 0,
    seqNoGrid: 0,
    isIdentifier: false,
    isKey: false,
    isSelectionColumn: false,
    isUpdateable: true,
    //
    formatPattern: '',
    vFormat: '',
    value: undefined,
    valueTo: undefined,
    defaultValue: '',
    parsedDefaultValue: undefined,
    defaultValueTo: '',
    parsedDefaultValueTo: undefined,
    valueType: componentReference.valueType, // value type to convert with gGRPC
    valueMin: '',
    valueMax: '',
    //
    isDisplayed: false,
    isActive: true,
    isMandatory: false,
    isReadOnly: false,
    isDisplayedFromLogic: false,
    isReadOnlyFromLogic: false,
    isMandatoryFromLogic: false,
    // browser attributes
    callout: '',
    isQueryCriteria: false,
    displayLogic: '',
    mandatoryLogic: '',
    readOnlyLogic: '',
    handleFocusGained: false,
    handleFocusLost: false,
    handleKeyPressed: false,
    handleKeyReleased: false,
    handleActionKeyPerformed: false,
    handleActionPerformed: false,
    dependentFieldsList: [],
    reference: {
      tableName: '',
      keyColumnName: '',
      query: '',
      directQuery: '',
      validationCode: '',
      zoomWindows: []
    },
    contextInfo: {},
    isShowedFromUser: overwriteDefinition.isShowedFromUser || false,
    isFixedTableColumn: false
  }

  // get parsed parent fields list
  const parentFieldsList: string[] = getParentFields({
    defaultValue: fieldTemplateMetadata.defaultValue!,
    displayLogic: fieldTemplateMetadata.displayLogic!,
    mandatoryLogic: fieldTemplateMetadata.mandatoryLogic!,
    readOnlyLogic: fieldTemplateMetadata.readOnlyLogic!,
    reference: fieldTemplateMetadata.reference!
  })

  // TODO: Add support to isSOTrxMenu
  const parsedDefaultValue: string = getDefaultValue({
    columnName: fieldTemplateMetadata.columnName!,
    componentPath: fieldTemplateMetadata.componentPath!,
    containerUuid: fieldTemplateMetadata.containerUuid!,
    defaultValue: fieldTemplateMetadata.defaultValue!,
    displayType: fieldTemplateMetadata.displayType!,
    elementName: fieldTemplateMetadata.elementName!,
    isKey: fieldTemplateMetadata.isKey!,
    isMandatory: fieldTemplateMetadata.isMandatory!,
    isSOTrxMenu: fieldTemplateMetadata.isSOTrxMenu!,
    parentUuid: fieldTemplateMetadata.parentUuid!
  })

  let parsedDefaultValueTo = ''
  if (fieldTemplateMetadata.isRange) {
    parsedDefaultValueTo = getDefaultValue({
      componentPath: fieldTemplateMetadata.componentPath!,
      containerUuid: fieldTemplateMetadata.containerUuid!,
      displayType: fieldTemplateMetadata.displayType!,
      isKey: fieldTemplateMetadata.isKey!,
      parentUuid: fieldTemplateMetadata.parentUuid!,
      isMandatory: fieldTemplateMetadata.isMandatory!,
      isSOTrxMenu: fieldTemplateMetadata.isSOTrxMenu!,
      defaultValue: fieldTemplateMetadata.defaultValueTo!,
      columnName: `${fieldTemplateMetadata.columnName}_To`,
      elementName: `${fieldTemplateMetadata.elementName}_To`
    })
  }

  // evaluate logics (diplayed, mandatory, readOnly)
  const evaluatedLogics = getEvaluatedLogics({
    containerUuid: fieldTemplateMetadata.containerUuid!,
    displayLogic: fieldTemplateMetadata.displayLogic!,
    isDisplayed: fieldTemplateMetadata.isDisplayed!,
    mandatoryLogic: fieldTemplateMetadata.mandatoryLogic!,
    parentUuid: fieldTemplateMetadata.parentUuid!,
    readOnlyLogic: fieldTemplateMetadata.readOnlyLogic!
  })

  return {
    ...fieldTemplateMetadata,
    ...evaluatedLogics,
    parsedDefaultValue,
    parsedDefaultValueTo,
    parentFieldsList
  }
}

/**
 * Create a field, it assumed that you define all behavior from source code
 * TODO: Join with generateField function
 */

export function createFieldFromDefinition(params: {
  parentUuid?: string
  containerUuid: string
  columnName: string
  panelType?: PanelContextType
  definition?: any
}): IFieldTemplateData {
  const {
    parentUuid,
    containerUuid,
    columnName,
    panelType = params.panelType || PanelContextType.Form,
    definition = params.definition || {}
  } = params

  if (definition) {
    if (!definition.displayType) {
      definition.displayType = CHAR.id
    } else if (definition.displayType === TABLE_DIRECT.id &&
      !definition.tableName &&
      columnName.indexOf('_ID') > 0) {
      definition.tableName = columnName.replace('_ID', '')
    }
    if (!definition.isActive) {
      definition.isActive = true
    }
    if (!definition.isDisplayed) {
      definition.isDisplayed = true
    }
    if (!definition.isReadOnly) {
      definition.isReadOnly = false
    }

    if (!definition.isMandatory) {
      definition.isMandatory = false
    }
    if (!definition.sequence) {
      definition.sequence = 0
      if (definition.isDisplayed) {
        definition.sequence = 10
      }
    }
  }

  return getFieldTemplate({
    panelType,
    ...definition,
    isShowedFromUser: true,
    isCustomField: true,
    parentUuid,
    containerUuid,
    columnName
  })
}

// Convert field getted from server to factory
function getFactoryFromField(params: {
  containerUuid: string
  field: Partial<IFieldDataExtendedUtils>
  overwriteDefinition: IOverwriteDefinitionData
}): IFieldTemplateData {
  const { containerUuid, field, overwriteDefinition = params.overwriteDefinition || {} } = params

  const definition = {
    parentFieldsList: field.parentFieldsList || [],
    dependentFieldsList: field.dependentFieldsList || [],
    ...field,
    isDisplayed: true,
    // Overwrite definition
    ...overwriteDefinition
  }

  //  Convert it
  return createFieldFromDefinition({
    containerUuid,
    columnName: definition.columnName,
    definition
  })
}

// Create a Field from UUID based on server meta-data
export function createFieldFromDictionary(params: {
  containerUuid: string
  uuid?: string
  columnUuid?: string
  elementUuid?: string
  elementColumnName?: string
  tableName: string
  columnName: string
  overwriteDefinition: IOverwriteDefinitionData
}): Promise<IFieldTemplateData> {
  const { columnName, uuid, containerUuid, elementColumnName, elementUuid, tableName, columnUuid, overwriteDefinition } = params
  let field: any
  let valueToMatch: string
  if (uuid) {
    field = store.getters.getFieldFromUuid(uuid)
    valueToMatch = uuid
  } else if (columnUuid) {
    field = store.getters.getFieldFromColumnUuid(columnUuid)
    valueToMatch = columnUuid
  } else if (elementUuid) {
    field = store.getters.getFieldFromElementUuid(elementUuid)
    valueToMatch = elementUuid
  } if (elementColumnName) {
    field = store.getters.getFieldFromElementColumnName(elementColumnName)
    valueToMatch = elementColumnName
  } else if (tableName && columnName) {
    field = store.getters.getFieldFromElementColumnName({
      tableName,
      columnName
    })
    valueToMatch = columnName
  }

  if (!field) {
    return new Promise<IFieldTemplateData>(resolve => {
      store.dispatch('getFieldFromServer', {
        uuid,
        columnUuid,
        elementUuid,
        elementColumnName,
        tableName,
        columnName
      })
        .then((response: IFieldDataExtended) => {
          const newField = getFactoryFromField({
            containerUuid,
            field: response,
            overwriteDefinition
          })

          resolve(newField)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field (match: ${valueToMatch}) From Server (State) - Error ${error.code}: ${error.message}.`)

          const templateField: IFieldTemplateData = createFieldFromDefinition({
            containerUuid,
            columnName,
            definition: {
              uuid,
              columnUuid,
              elementUuid,
              elementColumnName,
              tableName,
              ...overwriteDefinition
            }
          })

          resolve(templateField)
        })
    })
  }
  return new Promise<IFieldTemplateData>(resolve => {
    const fieldWithStore = getFactoryFromField({
      containerUuid,
      field,
      overwriteDefinition
    })

    resolve(fieldWithStore)
  })
}
