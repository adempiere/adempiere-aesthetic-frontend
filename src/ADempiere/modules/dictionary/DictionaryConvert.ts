import { convertContextInfo } from '@/ADempiere/modules/core'
import { convertField, convertFieldGroup } from '@/ADempiere/modules/field'
import { camelizeObjectKeys } from '@/ADempiere/shared/utils/transformObject'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import {
  IProcessData,
  IReportExportTypeData,
  IBrowserData,
  IFormData,
  IWindowData,
  ITabData,
  IValidationRule
} from '.'

export function convertProcess(process: any): IProcessData {
  const convertedProcess = (camelizeObjectKeys(process) as Partial<IProcessData>)
  if (!isEmptyValue(process.parameters)) {
    convertedProcess.parameters = process.parameters.map((parameter: any) => convertField(parameter))
  }
  return convertedProcess as IProcessData
}

// Convert report export type
export function convertReportExportType(
  reportExportType: any
): IReportExportTypeData {
  return camelizeObjectKeys(reportExportType) as IReportExportTypeData
}

export function convertBrowser(browser: any): IBrowserData {
  const convertedBrowser = (camelizeObjectKeys(browser) as Partial<IBrowserData>)
  convertedBrowser.window = convertWindow(browser.window)
  if (!isEmptyValue(browser.process)) {
    convertedBrowser.process = convertProcess(browser.process)
  }
  convertedBrowser.fields = browser.fields.map((fieldItem: any) => convertField(fieldItem))

  return convertedBrowser as IBrowserData
}

export function convertForm(form: any): IFormData {
  return camelizeObjectKeys(form) as IFormData
}

export function convertWindow(window: any): IWindowData {
  const convertedWindow = (camelizeObjectKeys(window) as Partial<IWindowData>)
  convertedWindow.contextInfo = convertContextInfo(window.context_info)
  convertedWindow.tabs = window.tabs.map((tab: any) => convertTab(tab))
  return convertedWindow as IWindowData
}

// convert Tabs
export function convertTab(tab: any): ITabData {
  const convertedTab = (camelizeObjectKeys(tab) as Partial<ITabData>)
  convertedTab.contextInfo = convertContextInfo(tab.context_info)
  convertedTab.fieldGroup = convertFieldGroup(tab.field_group)
  convertedTab.processes = tab.processes.map((process: any) => convertProcess(process))
  convertedTab.fields = tab.fields.map((field: any) => convertField(field))
  return convertedTab as ITabData
}

//  Convert Validation Rule
export function convertValidationRule(
  validationRule: any
): IValidationRule {
  return camelizeObjectKeys(validationRule) as IValidationRule
}
