import { camelizeObjectKeys, renameObjectKey } from '@/ADempiere/shared/utils/transformObject'
import {
  IDrillTablesData,
  IListPrintsFormatsData,
  IPrintFormatData,
  IReportOutputData,
  IReportViewData
} from '.'

export function convertListPrintFormats(
  printFormats: any
): IListPrintsFormatsData {
  const convertedPrintFormats = camelizeObjectKeys(printFormats) as Partial<IListPrintsFormatsData>
  convertedPrintFormats.list = printFormats.records.map((record: any) => convertPrintFormat(record))
  return convertedPrintFormats as IListPrintsFormatsData
}

export function convertPrintFormat(
  printFormat: any
): IPrintFormatData {
  return camelizeObjectKeys(printFormat) as IPrintFormatData
}

export function convertReportOutput(
  reportOutput: any
): IReportOutputData {
  const convertedReportOutput = camelizeObjectKeys(reportOutput) as Partial<IReportOutputData>
  renameObjectKey(convertedReportOutput, 'outputStreamAsB64', 'outputStream_asB64')
  renameObjectKey(convertedReportOutput, 'outputStreamAsU8', 'outputStream_asU8')
  return convertedReportOutput as IReportOutputData
}

export function convertDrillTables(
  drillTables: any
): IDrillTablesData {
  return camelizeObjectKeys(drillTables) as IDrillTablesData
}

export function convertReportView(reportView: any): IReportViewData {
  return camelizeObjectKeys(reportView) as IReportViewData
}
