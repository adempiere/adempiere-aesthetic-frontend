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

    isAllowHtmlView?: boolean
    isAllowInfoAccount?: boolean
    isAllowInfoAsset?: boolean
    isAllowInfoBusinessPartner?: boolean
    isAllowInfoCashJournal?: boolean
    isAllowInfoCrp: boolean
    isAllowInfoInOut?: boolean
    isAllowInfoInvoice?: boolean
    isAllowInfoMrp?: boolean
    isAllowInfoOrder?: boolean
    isAllowInfoPayment?: boolean
    isAllowInfoProduct?: boolean
    isAllowInfoResource?: boolean
    isAllowInfoSchedule?: boolean
    isAllowXlsView?: boolean
}

export interface IUserInfoData {
    id: number
    uuid: string
    name: string
    description: string
    comments: string
    image: string
}
export interface ISystemInfoData {
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

export interface ISessionData extends ISystemInfoData{
    id: number
    uuid: string
    name: string
    userInfo: any | IUserInfoData // IUserInfoData  needs convert
    role: IRoleData
    processed: boolean
    defaultContext: any // Map<string, ContextValue>
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

export interface ILoginParams {
    userName: string
    password: string
    token: string
}
