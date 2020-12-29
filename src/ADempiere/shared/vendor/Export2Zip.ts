/* eslint-disable */
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export function export_txt_to_zip(th: any[], jsonData: any[], txtName?: string, zipName?: string) : void {
  const zip: JSZip = new JSZip()
  const txt_name: string = txtName || 'file'
  const zip_name: string = zipName || 'file'
  const data: any[] = jsonData
  let txtData: string = `${th}\r\n`
  data.forEach((row) => {
    let tempStr: string = ''
    tempStr = row.toString()
    txtData += `${tempStr}\r\n`
  })
  zip.file(`${txt_name}.txt`, txtData)
  zip.generateAsync({
    type: "blob"
  }).then((blob: Blob) => {
    saveAs(blob, `${zip_name}.zip`)
  }, (err: any) => {
    alert('导出失败')
  })
}
