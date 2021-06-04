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

export function convertPointOfSales(posToConvert: any): IPointOfSalesData {
  const { uuid, id, name, description, help } = posToConvert

  return {
    id,
    uuid,
    name,
    description,
    help,
    isModifyPrice: posToConvert.is_modify_price,
    isPosRequiredPin: posToConvert.is_pos_required_pin,
    isAisleSeller: posToConvert.is_aisle_seller,
    isSharedPos: posToConvert.is_shared_pos,
    documentType: convertDocumentType(posToConvert.document_type),
    cashBankAccount: convertBankAccount(posToConvert.cash_bank_account),
    cashTransferBankAccount: convertBankAccount(
      posToConvert.cash_transfer_bank_account
    ),
    salesRepresentative: posToConvert.sales_representative,
    templateBusinessPartner: convertBusinessPartner(
      posToConvert.template_business_partner
    ),
    priceList: convertPriceList(posToConvert.price_list),
    conversionTypeUuid: posToConvert.conversion_type_uuid,
    keyLayoutUuid: posToConvert.key_layout_uuid
  }
}

export function convertOrder(order: any): IOrderData {
  const convertedOrder = (camelizeObjectKeys(order) as Partial<IOrderData>)
  convertedOrder.documentType = convertDocumentType(order.document_type)
  convertedOrder.salesRepresentative = convertSalesRepresentative(order.sales_representative)
  convertedOrder.documentStatus = convertDocumentStatus(order.document_status)
  convertedOrder.businessPartner = convertBusinessPartner(order.business_partner)
  return (convertedOrder as IOrderData)
}

export function convertOrderLine(orderLineToConvert: any): IOrderLineData {
  return {
    uuid: orderLineToConvert.uuid,
    orderUuid: orderLineToConvert.order_uuid,
    line: orderLineToConvert.line,
    product: convertProduct(orderLineToConvert.product),
    charge: orderLineToConvert.charge,
    description: orderLineToConvert.description,
    lineDescription: orderLineToConvert.line_description,
    quantity: orderLineToConvert.quantity,
    price: orderLineToConvert.price,
    discountRate: orderLineToConvert.discount_rate,
    lineNetAmount: orderLineToConvert.line_net_amount,
    taxRate: convertTaxRate(orderLineToConvert.tax_rate),
    warehouse: orderLineToConvert.warehouse
  }
}

export function convertKeyLayout(keyLayoutToConvert: any): IKeyLayoutData {
  return {
    uuid: keyLayoutToConvert.uuid,
    id: keyLayoutToConvert.id,
    name: keyLayoutToConvert.name,
    description: keyLayoutToConvert.description,
    help: keyLayoutToConvert.help,
    layoutType: keyLayoutToConvert.layout_type,
    columns: keyLayoutToConvert.columns,
    color: keyLayoutToConvert.color,
    keysList: keyLayoutToConvert.keys.map((itemKey: any) => {
      return convertKey(itemKey)
    })
  }
}

export function convertKey(keyToConvert: any): IKeyData {
  return {
    uuid: keyToConvert.uuid,
    id: keyToConvert.id,
    name: keyToConvert.name,
    description: keyToConvert.description,
    subKeyLayoutUuid: keyToConvert.sub_key_layout_uuid,
    color: keyToConvert.color,
    sequence: keyToConvert.sequence,
    spanX: keyToConvert.span_x,
    spanY: keyToConvert.span_y,
    productValue: keyToConvert.product_value,
    quantity: keyToConvert.quantity,
    resourceReference: convertResourceReference(
      keyToConvert.resource_reference
    )
  }
}

export function convertResourceReference(
  resourceReferenceToConvert: any
): IResourceReferenceData | undefined {
  if (resourceReferenceToConvert) {
    return {
      resourceUuid: resourceReferenceToConvert.resource_uuid,
      fileName: resourceReferenceToConvert.file_name,
      fileSize: resourceReferenceToConvert.file_size,
      description: resourceReferenceToConvert.description,
      textMsg: resourceReferenceToConvert.text_msg,
      contentType: resourceReferenceToConvert.content_type
    }
  }
  return undefined
}

export function paymentsMethod(payments: any): IPaymentsData | undefined {
  if (payments) {
    return {
      amount: payments.amount,
      bankUuid: payments.bank_uuid,
      businessPartner: payments.business_partner,
      currencyUuid: payments.currency_uuid,
      description: payments.description,
      documentNo: payments.document_no,
      documentStatus: payments.document_status,
      id: payments.id,
      orderUuid: payments.order_uuid,
      paymentDate: payments.payment_date,
      referenceNo: payments.reference_no,
      tenderTypeCode: payments.tender_type_code,
      uuid: payments.uuid
    }
  }
  return undefined
}
