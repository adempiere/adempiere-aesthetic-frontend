import { exportJsonToExcel } from '@/ADempiere/shared/vendor/Export2Excel'
import { exportTxtToZip } from '@/ADempiere/shared/vendor/Export2Zip'
import language from '@/ADempiere/shared/lang'
import XLSX from 'xlsx'
import { convertBooleanToTranslationLang } from './valueFormat'

export const reportFormatsList: string[] = [
  'ps',
  'xml',
  'pdf',
  'txt',
  'ssv',
  'csv',
  'xls',
  'xlsx',
  'arxml'
]

export const supportedTypes = {
  xlsx: language.t('report.ExportXlsx'),
  xls: language.t('report.ExportXls'),
  xml: language.t('report.ExporXml'),
  csv: language.t('report.ExporCsv'),
  txt: language.t('report.ExportTxt'),
  html: language.t('report.ExportHtml')
}

export function exportFileFromJson(json: {
    header?: any[]
    data: any[]
    exportType: XLSX.BookType
    fileName?: string
}): void {
  const { data, header, exportType, fileName = json.fileName || '' } = json
  const Json: any[] = data.map((row: any) => {
    Object.keys(row).forEach(column => {
      if (typeof row[column] === 'boolean') {
        row[column] = convertBooleanToTranslationLang(row[column])
      }
    })
    return row
  })
  exportJsonToExcel({
    header: header,
    data: Json,
    filename: fileName,
    bookType: exportType
  })
}

export function exportFileZip(params: {
    header: any[]
    data: any[]
    txtName?: string
    zipName?: string
}) {
  const { data, header } = params
  let { txtName, zipName } = params
  const Json = data.map(row => {
    Object.keys(row).forEach(column => {
      if (typeof row[column] === 'boolean') {
        row[column] = convertBooleanToTranslationLang(row[column])
      }
    })
    return row
  })

  if (!zipName) {
    zipName = txtName
  }

  if (!txtName) {
    txtName = zipName
  }

  exportTxtToZip(header, Json, txtName, zipName)
}
