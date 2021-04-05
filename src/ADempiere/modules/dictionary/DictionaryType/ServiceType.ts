// Request API Services
export interface IDictionaryRequest {
    uuid: string
    id: number
}

export interface IDictionaryFieldRequest {
    uuid: string
    columnUuid?: string
    elementUuid?: string
    fieldUuid: string
    // TableName + ColumnName
    tableName?: string
    columnName?: string
    elementColumnName?: string
}
