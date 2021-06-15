import {
  convertDocumentType,
  convertBankAccount,
  convertBusinessPartner,
  convertPriceList,
  convertSalesRepresentative,
  convertDocumentStatus,
  convertProduct,
  convertTaxRate
} from '@/ADempiere/modules/core'
import { camelizeObjectKeys } from '@/ADempiere/shared/utils/transformObject'
import {
  IPointOfSalesData,
  IOrderData,
  IOrderLineData,
  IKeyLayoutData,
  IKeyData,
  IResourceReferenceData
} from '.'
import { IPaymentsData } from './POSType'

export function convertPointOfSales(pos: any): IPointOfSalesData {
  const convertedPos = camelizeObjectKeys(pos) as Partial<IPointOfSalesData>
  convertedPos.documentType = convertDocumentType(pos.document_type)
  convertedPos.cashBankAccount = convertBankAccount(pos.cash_bank_account)
  convertedPos.cashTransferBankAccount = convertBankAccount(pos.cash_transfer_bank_account)
  convertedPos.templateBusinessPartner = convertBusinessPartner(pos.template_business_partner)
  convertedPos.priceList = convertPriceList(pos.price_list)
  return convertedPos as IPointOfSalesData
}

export function convertOrder(order: any): IOrderData {
  const convertedOrder = camelizeObjectKeys(order) as Partial<IOrderData>
  convertedOrder.documentType = convertDocumentType(order.document_type)
  convertedOrder.salesRepresentative = convertSalesRepresentative(order.sales_representative)
  convertedOrder.documentStatus = convertDocumentStatus(order.document_status)
  convertedOrder.businessPartner = convertBusinessPartner(order.business_partner)
  return (convertedOrder as IOrderData)
}

export function convertOrderLine(orderLine: any): IOrderLineData {
  const convertedOrderLine = camelizeObjectKeys(orderLine) as Partial<IOrderLineData>
  convertedOrderLine.product = convertProduct(orderLine.product)
  convertedOrderLine.taxRate = convertTaxRate(orderLine.tax_rate)
  return convertedOrderLine as IOrderLineData
}

export function convertKeyLayout(keyLayout: any): IKeyLayoutData {
  const convertedKeyLayout = camelizeObjectKeys(keyLayout)
  convertedKeyLayout.keysList = keyLayout.keys.map((key: any) => convertKey(key))
  delete convertedKeyLayout.keys
  return convertedKeyLayout as IKeyLayoutData
}

export function convertKey(key: any): IKeyData {
  const convertedKey = camelizeObjectKeys(key) as Partial<IKeyData>
  convertedKey.resourceReference = convertResourceReference(key.resource_reference)
  return convertedKey as IKeyData
}

export function convertResourceReference(
  resourceReference: any
): IResourceReferenceData | undefined {
  if (!resourceReference) {
    return undefined
  }
  return camelizeObjectKeys(resourceReference) as IResourceReferenceData
}

export function paymentsMethod(payments: any): IPaymentsData | undefined {
  if (!payments) {
    return undefined
  }
  return camelizeObjectKeys(payments) as IPaymentsData
}
