export interface IPrivateAccessData {
    tableName: string
    recordId: number
    recordUuid: string
    isLocked?: boolean
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

// Record Access type
export interface IRecordAccessRoleData {
    roleId: number
    roleUuid: string
    roleName: string
    isActive: boolean
    isExclude: boolean
    isReadOnly: boolean
    isDependentEntities: boolean
}

export interface IRecordAccessRoleDataExtended extends IRecordAccessRoleData {
    isLocked?: boolean
    isRoleConfig?: boolean
}

export interface IRecordAccessDataExtended extends IAccessRecordAttribute {
    id: number
    uuid: string
    tableName: string
    availableRoles: IRecordAccessRoleData[]
    currentRoles: IRecordAccessRoleData[]
  }
