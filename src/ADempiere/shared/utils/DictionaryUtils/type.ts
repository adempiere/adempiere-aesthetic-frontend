import { IProcessDataExtended } from '@/ADempiere/modules/dictionary'
import { IFieldData } from '@/ADempiere/modules/field'
import VueI18n from 'vue-i18n'

/**
 * Generate field to app
 * @param {object}  fieldToGenerate
 * @param {object}  moreAttributes, additional attributes
 * @param {boolean} typeRange, indicate if this field is a range used as _To
 */
export interface IAdditionalAttributesData {
    parentUuid?: string
    processUuid: string
    processId: number
    processName: string
    containerUuid: string
    isEvaluateValueChanges: boolean
    isShowedFromUser?: boolean
    panelType: 'report' | 'process'
    isAdvancedQuery?: boolean
}

export interface IEvaluatedLogicsData {
    isDisplayedFromLogic: boolean
    isMandatoryFromLogic: boolean
    isReadOnlyFromLogic: boolean
}

export type IFieldDataExtendedUtils = IFieldData &
    IAdditionalAttributesData &
    IEvaluatedLogicsData & {
        columnNameTo?: string
        elementNameTo?: string
        isSOTrxMenu?: boolean
        // displayed attributes
        componentPath?: string
        isSupported?: boolean
        size?: {
            xs: number
            sm: number
            md: number
            lg: number
            xl: number
        }
        // TODO: Property 'displayColumn' is @depecated
        displayColumn?: string // link to value from selects and table
        displayColumnName?: string // key to display column
        // value attributes
        value?: string
        oldValue?: string
        valueTo?: string
        parsedDefaultValue?: string
        parsedDefaultValueTo?: string

        parentFieldsList?: string[]
        dependentFieldsList?: string[]
        // TODO: Add support on server
        // app attributes
        isShowedFromUser?: boolean
        isShowedFromUserDefault?: boolean // set this value when reset panel
        isShowedTableFromUser?: boolean
        isFixedTableColumn?: boolean
        valueType?: string // value type to convert with gGRPC
        isSQLValue?: boolean
        // Advanced query
        operator?: string // current operator
        oldOperator?: string // old operator
        defaultOperator?: string
        operatorsList?: string[]
        // popover's
        isComparisonField?: boolean
        isNumericField?: boolean
        isTranslatedField?: boolean
    }

//  Default Action
export interface IActionsUtils {
    name: VueI18n.TranslateResult
    processName: string
    type: string
    action: string
    uuid: string
    id: number
    description: string
    isReport: boolean
    isDirectPrint: boolean
    reportExportType?: string
    printFormatUuid?: string
}
export type IActionChildsUtils = IActionsUtils & {
    childs: IActionsUtils[]
}

export type IPrintFormatUtils = IActionChildsUtils & {
    option: string
    process: IProcessDataExtended
}
