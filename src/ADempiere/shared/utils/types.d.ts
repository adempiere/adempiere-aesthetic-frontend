interface IConfigData {
    server : { 
        host: string,
        port: number
    },
    adempiere: {
        api: {
            url: string,
            service: string
        },
        images: {
            url: string,
            service: string
        }
    }
}
  