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
} from '@/ADempiere/modules/core';

interface IChargeData {
    uuid: string
    id: number
    name: string
    description: string
}

interface IOrderLineData {
    uuid: string
    orderUuid: string
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

interface IPointOfSalesData {
    id: number
    uuid: string
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

interface IOrderData {
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
interface IResourceReferenceData {
    resourceUuid: string
    fileName: string
    fileSize: number
    description: string
    textMsg: string
    contentType: string
}

interface IKeyData {
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

interface IKeyLayoutData {
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
    pageSize: number
    pageToken: string
}

export interface IListPointOfSalesResponse {
    nextPageToken: string
    recordCount: number
    sellingPointsList: IPointOfSalesData
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

interface IDeleteOrderParams {
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
    pageSize: number
    pageToken: string
}

export interface IListOrdersResponse {
    nextPageToken: string
    recordCount: number
    ordersList: IOrderData[]
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

interface IDeleteOrderLineParams {
    orderLineUuid: string
}

interface IListOrderLinesParams {
    orderUuid: string
    pageSize: number
    pageToken: string
}

interface IListOrderLinesResponse {
    nextPageToken: string
    recordCount: number
    orderLineList: IOrderLineData[]
}

interface IGetKeyLayoutParams {
    keyLayoutUuid: string
}

export interface IListProductPriceParams {
    searchValue: string
    priceListUuid: string
    businessPartnerUuid: string
    warehouseUuid: string
    validFrom: string
    // Query
    // criteria,
    pageSize: number
    pageToken: string
}

export interface IListProductPriceResponse {
    nextPageToken: string
    recordCount: number
    productPricesList: IProductPriceData[]
}

export interface IPrintOrderParams {
    orderUuid: string
}

export interface IGenerateInvoiceParams {
    posId: number
    posUuid: string
}
