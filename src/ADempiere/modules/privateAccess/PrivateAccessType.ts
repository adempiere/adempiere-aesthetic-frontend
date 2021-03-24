export interface IPrivateAccessData {
    tableName: string
    recordId: number
    recordUuid: string
}

export interface IAccessRecordAttribute {
    recordId: number
    recordUuid: string
    tableName: string
}

export interface AccessRecordState {
    listRecordAcces: any[]
    attribute: IAccessRecordAttribute | undefined
}
