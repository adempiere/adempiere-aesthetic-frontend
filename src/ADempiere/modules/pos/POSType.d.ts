import {
  IBankAccountData,
  IBusinessPartnerData,
  IDocumentStatusData,
  IDocumentTypeData,
  IPriceListData,
  IProductData,
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
