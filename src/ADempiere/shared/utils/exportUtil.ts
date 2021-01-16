import { exportJsonToExcel } from '@/ADempiere/shared/vendor/Export2Excel'
import { exportTxtToZip } from '@/ADempiere/shared/vendor/Export2Zip'
import language from '@/lang'
import XLSX from 'xlsx'

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
}): void {
  const { data, header, exportType } = json
  const Json: any[] = data.map((dataJson: any) => {
    Object.keys(dataJson).forEach(key => {
      if (typeof dataJson[key] === 'boolean') {
        dataJson[key] = dataJson[key]
          ? language.t('components.switchActiveText')
          : language.t('components.switchInactiveText')
      }
    })
    return dataJson
  })
  exportJsonToExcel({
    header: header,
    data: Json,
    filename: '',
    bookType: exportType
  })
}

export function exportFileZip(params: {
    header: any[]
    data: any[]
    title: string
}) {
  const { data, header, title } = params
  const Json = data.map(dataJson => {
    Object.keys(dataJson).forEach(key => {
      if (typeof dataJson[key] === 'boolean') {
        dataJson[key] = dataJson[key]
          ? language.t('components.switchActiveText')
          : language.t('components.switchInactiveText')
      }
    })
    return dataJson
  })
  exportTxtToZip(header, Json, title)
}
