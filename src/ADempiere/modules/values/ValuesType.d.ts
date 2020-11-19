export interface IReferenceData {
  uuid?: string
  tableName: string
  windowUuid: string
  displayName: string
  whereClause: string // Not found in proto
  recordCount: any // Not Found in proto
}

export interface IReferenceListData {
  recordCount: number
  referencesList: IReferenceData[]
  nextPageToken: string
}
