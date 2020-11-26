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
