// Get Instance for connection
import { request } from '@/ADempiere/shared/utils/request'
import { convertProductPrice } from '@/ADempiere/modules/core'
import {
  convertKeyLayout,
  convertOrder,
  convertOrderLine,
  convertPointOfSales,
  paymentsMethod
} from './POSConvert'
import {
  ICreateOrderLineParams,
  ICreateOrderParams,
  IDeleteOrderLineParams,
  IDeleteOrderParams,
  IGenerateInvoiceParams,
  IGetKeyLayoutParams,
  IGetPointOfSalesParams,
  IKeyLayoutData,
  IListOrderLinesParams,
  IListOrderLinesResponse,
  IListOrdersParams,
  IListOrdersResponse,
  IListPointOfSalesParams,
  IListPointOfSalesResponse,
  IListProductPriceParams,
  IListProductPriceResponse,
  IOrderData,
  IOrderLineData,
  IPaymentsData,
  IPointOfSalesData,
  IPrintOrderParams,
  IUpdateOrderParams,
  UpdateOrderLineParams
} from './POSType'
import { AxiosPromise } from 'axios'
import { IConfigData, IResponseList } from '@/ADempiere/shared/utils/types'
import { getConfig } from '@/ADempiere/shared/utils/config'

const config: IConfigData = getConfig()

// List Point of sales
export function getPointOfSales(
  data: IGetPointOfSalesParams
): Promise<IPointOfSalesData> {
  const { posUuid } = data
  return request({
    url: `${config.pointOfSales.endpoint}/point-of-sales`,
    method: 'GET',
    params: {
      point_of_sales_uuid: posUuid
    }
  })
    .then(posResponse => {
      return convertPointOfSales(posResponse)
    })
}

export function listPointOfSales(
  data: IListPointOfSalesParams
): Promise<IListPointOfSalesResponse> {
  const { userUuid, pageToken, pageSize } = data
  return request({
    url: `${config.pointOfSales.endpoint}/selling-points`,
    method: 'GET',
    params: {
      user_uuid: userUuid,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(posListResponse => {
      return {
        nextPageToken: posListResponse.next_page_token,
        recordCount: posListResponse.record_count,
        list: posListResponse.records.map((pos: any) => {
          return convertPointOfSales(pos)
        })
      }
    })
}

export function createOrder(
  data: ICreateOrderParams
): Promise<IOrderData> {
  const {
    posUuid,
    customerUuid,
    documentTypeUuid,
    salesRepresentativeUuid
  } = data
  return request({
    url: `${config.pointOfSales.endpoint}/create-order`,
    method: 'POST',
    data: {
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      document_type_uuid: documentTypeUuid,
      sales_representative_uuid: salesRepresentativeUuid
    }
  })
    .then(createOrderResponse => {
      return convertOrder(createOrderResponse)
    })
}

// Update order from POS
export function updateOrder(
  data: IUpdateOrderParams
): Promise<IOrderData> {
  const { orderUuid, posUuid, customerUuid, description } = data
  return request({
    url: `${config.pointOfSales.endpoint}/update-order`,
    method: 'POST',
    data: {
      order_uuid: orderUuid,
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      description
    }
  })
    .then(updateOrderResponse => {
      return convertOrder(updateOrderResponse)
    })
}

export function getOrder(orderUuid: string): Promise<IOrderData> {
  return request({
    url: `${config.pointOfSales.endpoint}/order`,
    method: 'GET',
    params: {
      order_uuid: orderUuid
    }
  })
    .then(getOrderResponse => {
      return convertOrder(getOrderResponse)
    })
}

export function deleteOrder(
  data: IDeleteOrderParams
): AxiosPromise<any> {
  console.warn('change posUUid to orderUuid')
  const {
    posUuid
    // customerUuid,
    // documentTypeUuid,
    // salesRepresentativeUuid
  } = data
  return request({
    url: `${config.pointOfSales.endpoint}/delete-order`,
    method: 'POST',
    data: {
      pos_uuid: posUuid
      // customer_uuid: customerUuid,
      // document_type_uuid: documentTypeUuid,
      // sales_representative_uuid: salesRepresentativeUuid
    }
  }).then(response => {
    return response
  })
}

// List orders from pos uuid
export function listOrders(
  data: IListOrdersParams
): Promise<IListOrdersResponse> {
  const {
    posUuid,
    documentNo,
    businessPartnerUuid,
    grandTotal,
    openAmount,
    isPaid,
    isProcessed,
    isAisleSeller,
    isInvoiced,
    dateOrderedFrom,
    dateOrderedTo,
    salesRepresentativeUuid,
    pageSize,
    pageToken
  } = data
  /*
    const Criteria = require('@/utils/ADempiere/criteria.js')
    const criteria = new Criteria({
      tableName: 'C_Order'
    })

    criteria.addCondition({
      columnName: 'DocumentNo',
      value: documentNo
    }).addCondition({
      columnName: 'C_BPartner_ID_UUID',
      value: businessPartnerUuid
    }).addCondition({
      columnName: 'GrandTotal',
      value: grandTotal
    }).addCondition({
      columnName: 'OpenAmt',
      value: openAmount
    }).addCondition({
      columnName: 'IsPaid',
      value: isPaid
    }).addCondition({
      columnName: 'Processed',
      value: isProcessed
    }).addCondition({
      columnName: 'IsAisleSeller',
      value: isAisleSeller
    }).addCondition({
      columnName: 'IsInvoiced',
      value: isInvoiced
    }).addCondition({
      columnName: 'DateOrderedFrom',
      value: dateOrderedFrom
    }).addCondition({
      columnName: 'DateOrderedTo',
      value: dateOrderedTo
    }).addCondition({
      columnName: 'SalesRep_ID_UUID',
      value: salesRepresentativeId
    })
    */

  return request({
    url: `${config.pointOfSales.endpoint}/orders`,
    method: 'GET',
    params: {
      pos_uuid: posUuid,
      document_no: documentNo,
      business_partner_uuid: businessPartnerUuid,
      sales_representative_uuid: salesRepresentativeUuid,
      grand_total: grandTotal,
      open_amount: openAmount,
      is_paid: isPaid,
      is_processed: isProcessed,
      is_aisle_seller: isAisleSeller,
      is_invoiced: isInvoiced,
      page_size: pageSize,
      page_token: pageToken,
      date_ordered_from: dateOrderedFrom,
      date_ordered_to: dateOrderedTo
    }
  })
    .then(ordersListResponse => {
      return {
        nextPageToken: ordersListResponse.next_page_token,
        recordCount: ordersListResponse.record_count,
        list: ordersListResponse.records.map(
          (productPrice: any) => {
            return convertOrder(productPrice)
          }
        )
      }
    })
}

export function createOrderLine(
  data: ICreateOrderLineParams
): Promise<IOrderLineData> {
  const {
    orderUuid,
    warehouseUuid,
    productUuid,
    chargeUuid,
    description,
    quantity,
    price,
    discountRate
  } = data
  return request({
    url: `${config.pointOfSales.endpoint}/create-order-line`,
    method: 'POST',
    data: {
      order_uuid: orderUuid,
      product_uuid: productUuid,
      description,
      quantity,
      price,
      discount_rate: discountRate,
      charge_uuid: chargeUuid,
      warehouse_uuid: warehouseUuid
    }
  })
    .then(createOrderLineResponse => {
      return convertOrderLine(createOrderLineResponse)
    })
}

export function updateOrderLine(
  data: UpdateOrderLineParams
): Promise<IOrderLineData> {
  const { orderLineUuid, description, quantity, price, discountRate } = data
  return request({
    url: `${config.pointOfSales.endpoint}/update-order-line`,
    method: 'POST',
    data: {
      // is_add_quantity: true,
      order_line_uuid: orderLineUuid,
      description,
      quantity,
      price,
      discount_rate: discountRate
    }
  })
    .then(createOrderLineResponse => {
      return convertOrderLine(createOrderLineResponse)
    })
}

export function deleteOrderLine(
  data: IDeleteOrderLineParams
): Promise<any> {
  const { orderLineUuid } = data
  return request({
    url: `${config.pointOfSales.endpoint}/delete-order-line`,
    method: 'POST',
    data: {
      order_line_uuid: orderLineUuid
    }
  }).then(response => {
    return response
  })
}

export function listOrderLines(
  data: IListOrderLinesParams
): Promise<IListOrderLinesResponse> {
  const { orderUuid, pageSize, pageToken } = data
  return request({
    url: `${config.pointOfSales.endpoint}/order-lines`,
    method: 'GET',
    params: {
      order_uuid: orderUuid,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(ordersLineListResponse => {
      return {
        nextPageToken: ordersLineListResponse.next_page_token,
        recordCount: ordersLineListResponse.record_count,
        orderLineList: ordersLineListResponse.records.map(
          (productPrice: any) => {
            return convertOrderLine(productPrice)
          }
        )
      }
    })
}

export function getKeyLayout(
  data: IGetKeyLayoutParams
): Promise<IKeyLayoutData> {
  const { keyLayoutUuid } = data
  return request({
    url: `${config.pointOfSales.endpoint}/key-layout`,
    method: 'GET',
    params: {
      key_layout_uuid: keyLayoutUuid
    }
  })
    .then(keyLayoutResponse => {
      return convertKeyLayout(keyLayoutResponse)
    })
}

export function getProductPriceList(
  data: IListProductPriceParams
): Promise<IListProductPriceResponse> {
  const {
    priceListUuid,
    searchValue,
    validFrom,
    businessPartnerUuid,
    warehouseUuid,
    pageToken,
    pageSize
  } = data
  return request({
    url: `${config.pointOfSales.endpoint}/product-prices`,
    method: 'GET',
    params: {
      price_list_uuid: priceListUuid,
      search_value: searchValue,
      valid_from: validFrom,
      business_partner_uuid: businessPartnerUuid,
      warehouse_uuid: warehouseUuid,
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(productPriceListResponse => {
      return {
        nextPageToken: productPriceListResponse.next_page_token,
        recordCount: productPriceListResponse.record_count,
        list: productPriceListResponse.records.map(
          (productPrice: any) => {
            return convertProductPrice(productPrice)
          }
        )
      }
    })
}

export function printOrder(data: IPrintOrderParams) {
  const { orderUuid } = data
  console.info(`Print order ${orderUuid}`)
}

export function generateImmediateInvoice(data: IGenerateInvoiceParams) {
  const { posUuid, posId } = data
  console.info(
        `Generate imediate invoice with POS id ${posId}, and uuid ${posUuid}`
  )
}

export function completeOrder(data: IPrintOrderParams) {
  const { orderUuid } = data
  console.info(`Complete prepared order ${orderUuid}`)
}

export function reverseSalesTransaction(data: IPrintOrderParams) {
  const { orderUuid } = data
  console.info(`Reverse sales transaction ${orderUuid}`)
}

export function withdrawal(data: IGenerateInvoiceParams) {
  const { posUuid, posId } = data
  console.info(`Withdrall cash with POS id ${posId}, and uuid ${posUuid}`)
}

export function createNewReturnOrder(data: IPrintOrderParams) {
  const { orderUuid } = data
  console.info(`New Customer Return Order ${orderUuid}`)
}

export function cashClosing(data: IGenerateInvoiceParams) {
  const { posUuid, posId } = data
  console.info(`Cash closing with POS id ${posId}, and uuid ${posUuid}`)
}

// Create Payment

export function createPayment(data: {
  posUuid: string
  orderUuid: string
  invoiceUuid?: string
  bankUuid: string
  referenceNo: string
  description: string
  amount: number
  paymentDate: Date
  tenderTypeCode: any
  currencyUuid: string
}) {
  const { posUuid, orderUuid, invoiceUuid, bankUuid, referenceNo, description, amount, paymentDate, tenderTypeCode, currencyUuid } = data
  return request({
    url: `${config.pointOfSales.endpoint}/create-payment`,
    method: 'POST',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      invoice_uuid: invoiceUuid,
      bank_uuid: bankUuid,
      reference_no: referenceNo,
      description: description,
      amount: amount,
      payment_date: paymentDate,
      tender_type_code: tenderTypeCode,
      currency_uuid: currencyUuid
    }
  })
    .then(createPaymentResponse => {
      return createPaymentResponse
    })
}

// Update Payment

export function updatePayment(data: {
  paymentUuid: string
  bankUuid: string
  referenceNo: string
  description: string
  amount: number
  paymentDate: Date
  tenderTypeCode: any
}) {
  const { paymentDate, paymentUuid, bankUuid, referenceNo, description, amount, tenderTypeCode } = data
  return request({
    url: `${config.pointOfSales.endpoint}/update-payment`,
    method: 'POST',
    data: {
      payment_uuid: paymentUuid,
      bank_uuid: bankUuid,
      reference_no: referenceNo,
      description: description,
      amount: amount,
      payment_date: paymentDate,
      tender_type_code: tenderTypeCode
    }
  })
    .then(updatePaymentResponse => {
      return updatePaymentResponse
    })
}

// Delete Payment

export function deletePayment(data: {
  paymentUuid: string
}) {
  const { paymentUuid } = data
  return request({
    url: `${config.pointOfSales.endpoint}/delete-payment`,
    method: 'POST',
    data: {
      payment_uuid: paymentUuid
    }
  })
    .then(deletePaymentResponse => {
      return deletePaymentResponse
    })
}

// List Payments

export function getPaymentsList(data: {
  posUuid: string
  orderUuid: string
}):Promise<IResponseList<IPaymentsData>> {
  const { posUuid, orderUuid } = data
  return request({
    url: `${config.pointOfSales.endpoint}/payments`,
    method: 'GET',
    params: {
      pos_uuid: posUuid,
      order_uuid: orderUuid
    }
  })
    .then(listPaymentsResponse => {
      return {
        nextPageToken: listPaymentsResponse.next_page_token,
        recordCount: listPaymentsResponse.record_count,
        list: listPaymentsResponse.records.map((payments: any) => {
          return paymentsMethod(payments)
        })
      }
    })
}

/**
 * Process Order
 * This request allows process a draft order with payments
 *
 * req.query.token - user token
 * Body:
 * req.body.pos_uuid - POS UUID reference
 * req.body.order_uuid - Order UUID reference
 * req.body.create_payments - Optional create payments (if is true then hope payments array)
 * req.body.payments
 * [
 * invoice_uuid - Invoice UUID reference
 * bank_uuid - Bank UUID reference
 * reference_no - Reference no
 * description - Description for Payment
 * amount - Payment Amount
 * tender_type_code - Tender Type
 * payment_date - Payment Date (default now)
 * currency_uuid - Currency UUID reference
 * ]
 */
export function processOrder(data: {
  posUuid: string
  orderUuid: string
  createPayments: any
  payments: any[]
}): Promise<any> {
  const {
    posUuid,
    orderUuid,
    createPayments
  } = data
  let { payments } = data

  if (payments) {
    payments = payments.map(parameter => {
      return {
        invoice_uuid: parameter.invoiceUuid,
        bank_uuid: parameter.bankUuid,
        reference_no: parameter.referenceNo,
        description: parameter.description,
        amount: parameter.amount,
        tender_type_code: parameter.tenderTypeCode,
        payment_ate: parameter.paymentDate,
        currency_uid: parameter.currencyUuid
      }
    })
  }
  return request({
    url: `${config.pointOfSales.endpoint}/process-order`,
    method: 'POST',
    data: {
      pos_uuid: posUuid,
      order_uuid: orderUuid,
      create_payments: createPayments,
      payments: payments
    }
  })
    .then(processOrderResponse => {
      return processOrderResponse
    })
}

/**
 * Validate Ping
 * @param {string} posUuidd - POS UUID reference
 * @param {string} pin - User PIN
 * @returns {string}
 */
export function validatePin(data: {
  posUuid: string
  pin: string
}): Promise<string> {
  const { posUuid, pin } = data
  return request({
    url: `${config.pointOfSales.endpoint}/validate-pin`,
    method: 'post',
    data: {
      pos_uuid: posUuid,
      pin: pin
    }
  })
    .then(pinResponse => {
      return pinResponse
    })
}
