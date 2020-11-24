export interface IRoleData {
    id: number
    uuid: string
    name: string
    description: string
    clientId: number
    clientName: string
    isCanExport: boolean
    isCanReport: boolean
    isPersonalAccess: boolean
    isPersonalLock: boolean
}

export interface IUserInfoData {
    id: number
    uuid: string
    name: string
    description: string
    comments: string
    image: string
}

export interface ISessionData {
    id: number
    uuid: string
    name: string
    userInfo: any | IUserInfoData // IUserInfoData  needs convert
    role: IRoleData
    processed: boolean
    defaultContext: any // Map<string, ContextValue>
    // system info
    countryId: number
    costingPrecision: number
    countryCode: string
    countryName: string
    currencyIsoCode: string
    currencyName: string
    currencySymbol: string
    displaySequence: string
    language: string
    standardPrecision: number
}

export interface IMenuData {
    id: number
    uuid: string
    parentUuid: string
    name: string
    description: string
    sequence: string
    isReadOnly: boolean
    isSummary: boolean
    isSalesTransaction?: boolean
    action: string
    referenceUuid: string
    childs: IMenuData[]
    isActive: boolean
}

// service
export interface IMenuParams {
    sessionUuid: string
}
