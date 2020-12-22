import {
  IBankAccountData,
  IBusinessPartnerData,
  IDocumentStatusData,
  IDocumentTypeData,
  IPriceListData,
  IProductData,
  IProductPriceData,
  ISalesRepresentativeData,
  ITaxRateData
} from '@/ADempiere/modules/core'

export interface IChargeData {
    uuid: string
    id: number
    name: string
    description: string
}

export interface IOrderLineData {
    uuid: string
    orderUuid: string
    help?: string
    line: string
    product: IProductData
    charge: IChargeData
    description: string
    lineDescription: string
    quantity: number
    price: number
    discountRate: number
    lineNetAmount: number
    taxRate: ITaxRateData
    warehouse: any // Warehouse proto
}

export interface IPointOfSalesData {
    id: number
    uuid?: string
    name: string
    description: string
    help: string
    isModifyPrice: boolean
    isPosRequiredPin: boolean
    isAisleSeller: boolean
    isSharedPos: boolean
    documentType?: IDocumentTypeData
    cashBankAccount?: IBankAccountData
    cashTransferBankAccount?: IBankAccountData
    salesRepresentative: ISalesRepresentativeData
    templateBusinessPartner: IBusinessPartnerData
    priceList: IPriceListData
    conversionTypeUuid: string
    keyLayoutUuid: string
}

export interface IOrderData {
    uuid: string
    id: number
    documentNo: string
    documentType?: IDocumentTypeData
    salesRepresentative: ISalesRepresentativeData
    documentStatus: IDocumentStatusData
    totalLines: number
    grandTotal: number
    dateOrdered: number
    businessPartner: IBusinessPartnerData
}
export interface IResourceReferenceData {
    resourceUuid: string
    fileName: string
    fileSize: number
    description: string
    textMsg: string
    contentType: string
}

export interface IKeyData {
    uuid: string
    id: number
    name: string
    description: string
    subKeyLayoutUuid: string
    color: string
    sequence: number
    spanX: number
    spanY: number
    productUuid: string
    quantity: number
    resourceReference?: IResourceReferenceData
}

export interface IKeyLayoutData {
    uuid: string
    id: number
    name: string
    description: string
    help: string
    layoutType: string
    columns: number
    color: string
    keysList: IKeyData[]
}

// serivce types

export interface IGetPointOfSalesParams {
    posUuid: string
}

export interface IListPointOfSalesParams {
    userUuid: string
    pageSize?: number
    pageToken?: string
}

export interface IListPointOfSalesResponse {
    nextPageToken: string
    recordCount: number
    list: IPointOfSalesData[]
}

export interface ICreateOrderParams {
    posUuid: string
    customerUuid: string
    documentTypeUuid: string
    salesRepresentativeUuid: string
}

export interface IUpdateOrderParams {
    orderUuid: string
    posUuid: string
    customerUuid: string
    description: string
}

export interface IDeleteOrderParams {
    posUuid: string
    customerUuid: string
    documentTypeUuid: string
    salesRepresentativeUuid: string
}

export interface IListOrdersParams {
    posUuid: string
    documentNo: string
    businessPartnerUuid: string
    grandTotal: number
    openAmount: number
    isPaid: boolean
    isProcessed: boolean
    isAisleSeller: boolean
    isInvoiced: boolean
    dateOrderedFrom: number
    dateOrderedTo: number
    salesRepresentativeUuid: string
    pageSize?: number
    pageToken: string
}

export interface IListOrdersResponse {
    nextPageToken: string
    recordCount: number
    list: IOrderData[]
}

export interface ICreateOrderLineParams {
    orderUuid: string
    warehouseUuid: string
    productUuid: string
    chargeUuid: string
    description: string
    quantity: number
    price: number
    discountRate: number
}

export interface UpdateOrderLineParams {
    orderLineUuid: string
    description: string
    quantity: number
    price: number
    discountRate: number
}

export interface IDeleteOrderLineParams {
    orderLineUuid: string
}

export interface IListOrderLinesParams {
    orderUuid: string
    pageSize?: number
    pageToken?: string
}

export interface IListOrderLinesResponse {
    nextPageToken: string
    recordCount: number
    orderLineList: IOrderLineData[]
}

export interface IGetKeyLayoutParams {
    keyLayoutUuid: string
}

export interface IListProductPriceParams {
    searchValue: string
    priceListUuid: string
    businessPartnerUuid: string
    warehouseUuid: string
    validFrom?: string
    // Query
    // criteria,
    pageSize?: number
    pageToken?: string
}

export interface IListProductPriceResponse {
    nextPageToken: string
    recordCount: number
    list: IProductPriceData[]
}

export interface IPrintOrderParams {
    orderUuid: string
}

export interface IGenerateInvoiceParams {
    posId: number
    posUuid: string
}

// VUEX

// PointOfSales Module
export interface IPOSData {
    userUuid?: string
    isLoaded: boolean
    isReload: boolean
    recordCount: number
    nextPageToken?: string
    list?: IPointOfSalesData[]
    currentPOS?: IPointOfSalesData
}
export interface PointOfSalesState {
    showPOSOptions: boolean
    showPOSKeyLayout: boolean
    showPOSCollection: boolean
    pointOfSales: IPOSData
}

// Collection Module
export interface CollectionState {
    paymentBox: any[]
    multiplyRate: number
    divideRate: number
}

// Key Layout Module
export interface IKeyLayoutDataExtended extends IKeyLayoutData {
    isLoaded: boolean
    isReload: boolean
    // token,
    // pageNumber
}

export interface KeyLayoutState {
    keyLayout: {
        isLoaded: boolean
        isReload: boolean
        recordCount: number
        nextPageToken?: string
        uuid?: string
        orderList?: any[]
    }
}

// Order Module
export interface OrderState {
    order?: IOrderData
    findOrder?: IOrderData
    listOrder: {
        list?: IOrderData[]
        posUuid?: string
        isLoaded: boolean
        isReload: boolean
        recordCount: number
        nextPageToken?: string
        isShowPopover: boolean
        pageNumber?: number
    }
    currentOrder?: IOrderData
}
// Order Lines Module
export interface IProductDataExtended extends IProductData {
    priceStandard: number
}

export interface IOrderLineDataExtended extends IOrderLineData {
    quantityOrdered: number
    priceActual: number
    discount: number
    product: IProductDataExtended
    taxIndicator: string
    grandTotal: number
    help?: string
}

export interface OrderLinesState {
    listOrderLine: IOrderLineDataExtended[]
}

export interface IListProductPriceItemData {
    isLoaded: boolean
    isReload: boolean
    recordCount: number
    nextPageToken?: string
    isShowPopoverField?: boolean
    isShowPopoverMenu?: boolean
    pageNumber?: number
    token?: string
    //
    list?: IProductPriceData[]
    businessPartnerUuid?: string
    warehouseUuid?: string
}
// List Product Price Module
export interface ListProductPriceState {
    productPrice: IListProductPriceItemData
}
