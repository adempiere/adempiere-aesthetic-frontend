export interface IReportOutputData {
  uuid: string;
  name: string;
  description: string;
  fileName: string;
  output: string;
  mimeType: string;
  dataCols: number;
  dataRows: number;
  headerName: string;
  footerName: string;
  printFormatUuid: string;
  reportViewUuid: string;
  tableName: string;
  outputStream: any; // type byte
  // outputStreamAsB64
  outputStream_asB64: any; //Type not found in proto
  // outputStreamAsU8
  outputStream_asU8: any; ///Type not found in proto
  reportType: string;
}

export interface IPrintFormatData {
  id?: number;
  uuid: string;
  name: string;
  description: string;
  tableName: string;
  isDefault: boolean;
  reportViewUuid: string;
}

export interface IListPrintsFormatsData {
  recordCount: number;
  records: IPrintFormatData[];
  nextPageToken: string;
}

export interface IDrillTablesData {
  tableName: string;
  printName: string;
}

export interface IReportViewData {
  uuid: string;
  name: string;
  description: string;
  tableName: string;
  reportViewUuid?: string;
}
