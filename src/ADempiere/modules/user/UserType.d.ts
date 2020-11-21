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

interface IUserInfoData {
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
