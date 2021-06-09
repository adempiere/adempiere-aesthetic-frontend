import Vue, { AsyncComponent } from 'vue'
import language from '@/lang'

import { TranslateResult } from 'vue-i18n'
import { ComponentOptions } from 'vue/types/umd'

export interface IOptionItem {
    name: TranslateResult
    enabled: boolean
    svg: boolean
    icon: string
    componentRender: ComponentOptions<Vue> | AsyncComponent | typeof Vue
}

export const infoOptionItem: IOptionItem = {
  name: language.t('field.info'),
  enabled: true,
  svg: false,
  icon: 'el-icon-info',
  componentRender: () => import('@/ADempiere/shared/components/Field/ContextMenuField/ContextInfo')
}

/**
 * For operators in advanced query
 */
export const operatorOptionItem: IOptionItem = {
  name: language.t('operators.operator'),
  enabled: true,
  svg: false,
  icon: 'el-icon-rank',
  componentRender: () => import('@/ADempiere/shared/components/Field/FieldOptions/OperatorComparison')
}

/**
 * For lookup fields with context info
 */
export const zoomInOptionItem: IOptionItem = {
  name: language.t('table.ProcessActivity.zoomIn'),
  enabled: true,
  svg: false,
  icon: 'el-icon-files',
  componentRender: () => import('@/ADempiere/shared/components/Field/ContextMenuField/ContextInfo')
}

/**
 * Only when is translate option
 */
export const translateOptionItem: IOptionItem = {
  name: language.t('language'),
  enabled: true,
  svg: true,
  icon: 'language',
  componentRender: () => import('@/ADempiere/shared/components/Field/ContextMenuField/Translated')
}

/**
 * Displayed calculator option in numeric field
 */
export const calculatorOptionItem: IOptionItem = {
  name: language.t('field.calculator'),
  enabled: true,
  svg: false,
  icon: 'el-icon-s-operation',
  componentRender: () => import('@/ADempiere/shared/components/Field/ContextMenuField/Calculator')
}

export const preferenceOptionItem: IOptionItem = {
  name: language.t('field.preference'),
  enabled: true,
  svg: false,
  icon: 'el-icon-notebook-2',
  componentRender: () => import('@/ADempiere/shared/components/Field/FieldOptions/Preference')
}

export const logsOptionItem: IOptionItem = {
  name: language.t('field.logsField'),
  enabled: true,
  svg: true,
  icon: 'tree-table',
  componentRender: () => import('@/ADempiere/shared/components/Field/ContextMenuField/ChangeLogs')
}

/**
 * For document status field to workflow
 */
export const documentStatusOptionItem: IOptionItem = {
  name: language.t('window.documentStatus'),
  enabled: true,
  svg: false,
  icon: 'el-icon-set-up',
  componentRender: () => import('@/ADempiere/shared/components/Field/FieldOptions/DocumentStatus')
}

export const optionsListStandad: IOptionItem[] = [
  infoOptionItem,
  preferenceOptionItem,
  logsOptionItem
]

export const optionsListAdvancedQuery: IOptionItem[] = [
  infoOptionItem,
  operatorOptionItem
]
