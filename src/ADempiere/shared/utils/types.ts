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
