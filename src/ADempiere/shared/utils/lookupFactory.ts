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
  ISizeData
} from '@/ADempiere/shared/utils/references'
import {
  IAdditionalAttributesData,
  IFieldDataExtendedUtils
} from './DictionaryUtils/type'

interface IOverwriteDefinitionData extends IAdditionalAttributesData {
    isShowedFromUser: boolean
    name: string
    columnName: string
    componentPath: string
    displayType?: number
    size?: ISizeData
}

// Default template for injected fields
export function getFieldTemplate(
  overwriteDefinition: IOverwriteDefinitionData
) {
  let displayType: number = CHAR.id // String reference (10)
  if (overwriteDefinition.displayType) {
    displayType = overwriteDefinition.displayType
  }

  const componentReference: IFieldReferencesType = <IFieldReferencesType>(
        evalutateTypeField(displayType)
    )
    // set size from displayed, max 24
  let size: ISizeData = DEFAULT_SIZE
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

    type IFieldTemplateMetadataType = Partial<IFieldDataExtendedUtils> & {
        handleFocusGained: boolean
        handleFocusLost: boolean
        handleKeyPressed: boolean
        handleKeyReleased: boolean
        handleActionKeyPerformed: boolean
        handleActionPerformed: boolean
    }

    type IFieldReduced = Omit<IFieldDataExtendedUtils,
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
