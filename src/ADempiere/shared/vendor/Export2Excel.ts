/* eslint-disable */
import { saveAs } from 'file-saver'
import XLSX, { BookType } from 'xlsx'
import { IKeyValueObject } from '../utils/types'

function generateArray(table: HTMLTableElement): (XLSX.Range[] | (string | null)[][])[] {
    var out = []
    var rows: NodeListOf<HTMLTableRowElement> = table.querySelectorAll('tr')
    var ranges: XLSX.Range[]  = []
    for (var R = 0; R < rows.length; ++R) {
        var outRow = []
        var row: HTMLTableRowElement = rows[R]
        var columns: NodeListOf<HTMLTableDataCellElement> = row.querySelectorAll('td')
        for (var C = 0; C < columns.length; ++C) {
            var cell: HTMLTableDataCellElement = columns[C]
            var colspan: string | null | number = cell.getAttribute('colspan')
            var rowspan: string | null | number = cell.getAttribute('rowspan')
            var cellValue: string = cell.innerText
            // if (cellValue !== '' && cellValue == +cellValue)
            //     cellValue = +cellValue

            //Skip ranges
            ranges.forEach((range: XLSX.Range) => {
                if (
                    R >= range.s.r &&
                    R <= range.e.r &&
                    outRow.length >= range.s.c &&
                    outRow.length <= range.e.c
                ) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i)
                        outRow.push(null)
                }
            })

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1
                colspan = colspan || 1
                ranges.push({
                    s: {
                        r: R,
                        c: outRow.length
                    },
                    e: {
                        r: R + Number(rowspan) - 1,
                        c: outRow.length + Number(colspan) - 1
                    }
                })
            }

            //Handle Value
            outRow.push(cellValue !== '' ? cellValue : null)

            //Handle Colspan
            if (colspan) for (var k = 0; k < Number(colspan) - 1; ++k) outRow.push(null)
        }
        out.push(outRow)
    }
    return [out, ranges]
}

function datenum(v: any, date1904?: boolean): number {
    if (date1904) v += 1462
    var epoch: number = Date.parse(String(v))
    return (epoch - Number(new Date(Date.UTC(1899, 11, 30)))) / (24 * 60 * 60 * 1000)
}

function sheet_from_array_of_arrays(data: any[][] | any[]): IKeyValueObject<string | XLSX.CellObject> {
    var ws: IKeyValueObject<string | XLSX.CellObject> = {}
    var range: XLSX.Range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    }
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R
            if (range.s.c > C) range.s.c = C
            if (range.e.r < R) range.e.r = R
            if (range.e.c < C) range.e.c = C
            var cell: Partial<XLSX.CellObject> = {
                v: data[R][C]
            }
            if (cell.v == null) continue
            var cell_ref: string = XLSX.utils.encode_cell({
                c: C,
                r: R
            })

            if (typeof cell.v === 'number') cell.t = 'n'
            else if (typeof cell.v === 'boolean') cell.t = 'b'
            else if (cell.v instanceof Date) {
                cell.t = 'n'
                // cell.z = XLSX.SSF._table[14]
                cell.z = XLSX.SSF.get_table()[14]
                cell.v = datenum(cell.v)
            } else cell.t = 's'

            ws[cell_ref] = <XLSX.CellObject>cell
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
    return ws
}

class Workbook implements XLSX.WorkBook {
    Sheets: { [sheet: string]: XLSX.WorkSheet } = {}
    SheetNames: string[] = []
    Props?: XLSX.FullProperties | undefined
    Custprops?: object | undefined
    Workbook?: XLSX.WBProps | undefined
    vbaraw?: any
}

function s2ab(s: any): ArrayBuffer {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
}

export function export_table_to_excel(id: string): void {
    var theTable: HTMLTableElement = <HTMLTableElement>document.getElementById(id)!
    var oo = generateArray(theTable)
    var ranges = oo[1]

    /* original data */
    var data = oo[0]
    var ws_name: string = 'SheetJS'

    var wb: XLSX.WorkBook = new Workbook()
    var ws: IKeyValueObject<any> = sheet_from_array_of_arrays(data)

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name)
    wb.Sheets[ws_name] = ws

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    })

    saveAs(
        new Blob([s2ab(wbout)], {
            type: 'application/octet-stream'
        }),
        'test.xlsx'
    )
}

export function export_json_to_excel(params: {
    multiHeader?: any[]
    header?: any[]
    data: any[]
    filename?: string
    merges?: any[]
    autoWidth?: boolean
    bookType?: BookType
}): void {
    /* original data */
    let { 
        multiHeader = params.multiHeader || [],
        header,
        data,
        filename = params.filename || 'excel-list',
        merges = params.merges || [],
        autoWidth = params.autoWidth || true,
        bookType = params.bookType || 'xlsx'
     } = params

    filename = filename || 'excel-list'
    data = [...data]
    data.unshift(header)

    for (let i = multiHeader.length - 1; i > -1; i--) {
        data.unshift(multiHeader[i])
    }

    var ws_name: string = 'SheetJS'
    var wb: Workbook = new Workbook(),
        ws: IKeyValueObject<any> = sheet_from_array_of_arrays(data)

    if (merges.length > 0) {
        if (!ws['!merges']) ws['!merges'] = []
        merges.forEach(item => {
            ws['!merges'].push(XLSX.utils.decode_range(item))
        })
    }

    if (autoWidth) {
        /*设置worksheet每列的最大宽度*/
        const colWidth: any[] | any[][] = data.map((row: any) =>
            row.map((val: any) => {
                /*先判断是否为null/undefined*/
                if (val == null) {
                    return {
                        wch: 10
                    }
                } else if (val.toString().charCodeAt(0) > 255) {
                /*再判断是否为中文*/
                    return {
                        wch: val.toString().length * 2
                    }
                } else {
                    return {
                        wch: val.toString().length
                    }
                }
            })
        )
        /*以第一行为初始值*/
        let result: XLSX.WorkSheet = colWidth[0]
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch'] < colWidth[i][j]['wch']) {
                    result[j]['wch'] = colWidth[i][j]['wch']
                }
            }
        }
        ws['!cols'] = result
    }

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name)
    wb.Sheets[ws_name] = ws

    var wbout = XLSX.write(wb, {
        bookType: bookType,
        bookSST: false,
        type: 'binary'
    })
    saveAs(
        new Blob([s2ab(wbout)], {
            type: 'application/octet-stream'
        }),
        `${filename}.${bookType}`
    )
}
