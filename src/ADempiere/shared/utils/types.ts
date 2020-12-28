export interface IConfigData {
    server: {
        host: string
        port: number
    }
    adempiere: {
        api: {
            url: string
            service: string
        }
        images: {
            url: string
            service: string
        }
    }
}

// Resource types

export interface ImagePathData {
    url: string
    urn: string
    uri: string
}

export interface IRequestImageData {
    file: string
    width: number
    height: number
    operation: string
}

export interface IKeyValueObject<T = any> {
    [key: string]: T
}

export interface IResponseList<T> {
    nextPageToken: string
    recordCount: number
    list: T[]
}

export enum Namespaces {
    System = 'systemModule',
    BusinessPartner = 'businessPartnerModule',
    Dashboard = 'dashboardModule',
    Field = 'fieldModule',
    FormDefinition = 'formDefinitionModule',
    ProcessDefinition = 'processDefinitionModule',
    Preference = 'preferenceModule',
    WindowDefinition = 'windowDefinitionModule',
    Language = 'languageModule',
    Persistence = 'persistenceModule',
    Window = 'windowModule',
    Event = 'eventModule',
    Utils = 'utilsModule',
    Lookup = 'lookupModule',
    CallOutControl = 'callOutControlModule',
    ChatEntries = 'chatEntriesModule',
    ContainerInfo = 'containerInfoModule',
    Report = 'reportModule',
    FieldValue = 'fieldValueModule',
    Process = 'processModule',
    PointOfSales = 'pointOfSalesModule',
    Collection = 'collectionModule',
    KeyLayout = 'keyLayoutModule',
    Order = 'orderModule',
    OrderLines = 'orderLinesModule',
    ListProductPrice = 'listProductPriceModule'
}
