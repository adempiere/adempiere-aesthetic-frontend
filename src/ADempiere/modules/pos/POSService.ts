// Get Instance for connection
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances';
import { convertProductPrice } from '@/ADempiere/modules/core';
import {
  convertKeyLayout,
  convertOrder,
  convertOrderLine,
  convertPointOfSales
} from './POSConvert';
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
  IPointOfSalesData,
  IPrintOrderParams,
  IUpdateOrderParams,
  UpdateOrderLineParams
} from './POSType';
import { AxiosPromise } from 'axios';

// List Point of sales
export function requestGetPointOfSales(
  data: IGetPointOfSalesParams
): Promise<IPointOfSalesData> {
  const { posUuid } = data;
  return requestRest({
    url: '/pos/get-point-of-sales',
    data: {
      point_of_sales_uuid: posUuid
    }
  })
    .then(evaluateResponse)
    .then(posResponse => {
      return convertPointOfSales(posResponse);
    });
}

export function requestListPointOfSales(
  data: IListPointOfSalesParams
): Promise<IListPointOfSalesResponse> {
  const { userUuid, pageToken, pageSize } = data;
  return requestRest({
    url: '/pos/list-point-of-sales',
    data: {
      user_uuid: userUuid
    },
    params: {
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(evaluateResponse)
    .then(posListResponse => {
      return {
        nextPageToken: posListResponse.next_page_token,
        recordCount: posListResponse.record_count,
        sellingPointsList: posListResponse.records.map((pos: any) => {
          return convertPointOfSales(pos);
        })
      };
    });
}

export function requestCreateOrder(
  data: ICreateOrderParams
): Promise<IOrderData> {
  const {
    posUuid,
    customerUuid,
    documentTypeUuid,
    salesRepresentativeUuid
  } = data;
  return requestRest({
    url: '/pos/create-order',
    data: {
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      document_type_uuid: documentTypeUuid,
      sales_representative_uuid: salesRepresentativeUuid
    }
  })
    .then(evaluateResponse)
    .then(createOrderResponse => {
      return convertOrder(createOrderResponse);
    });
}

// Update order from POS
export function requestUpdateOrder(
  data: IUpdateOrderParams
): Promise<IOrderData> {
  const { orderUuid, posUuid, customerUuid, description } = data;
  return requestRest({
    url: '/pos/update-order',
    data: {
      order_uuid: orderUuid,
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      description
    }
  })
    .then(evaluateResponse)
    .then(updateOrderResponse => {
      return convertOrder(updateOrderResponse);
    });
}

export function requestGetOrder(orderUuid: string): Promise<IOrderData> {
  return requestRest({
    url: '/pos/update-order',
    data: {
      order_uuid: orderUuid
    }
  })
    .then(evaluateResponse)
    .then(getOrderResponse => {
      return convertOrder(getOrderResponse);
    });
}

export function requestDeleteOrder(
  data: IDeleteOrderParams
): AxiosPromise<any> {
  const {
    posUuid,
    customerUuid,
    documentTypeUuid,
    salesRepresentativeUuid
  } = data;
  return requestRest({
    url: '/pos/delete-order',
    data: {
      pos_uuid: posUuid,
      customer_uuid: customerUuid,
      document_type_uuid: documentTypeUuid,
      sales_representative_uuid: salesRepresentativeUuid
    }
  }).then(evaluateResponse);
}

// List orders from pos uuid
export function requestListOrders(
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
  } = data;
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

  return requestRest({
    url: '/pos/list-orders',
    data: {
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
      date_ordered_from: dateOrderedFrom,
      date_ordered_to: dateOrderedTo
    },
    params: {
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(evaluateResponse)
    .then(ordersListResponse => {
      return {
        nextPageToken: ordersListResponse.next_page_token,
        recordCount: ordersListResponse.record_count,
        ordersList: ordersListResponse.records.map(
          (productPrice: any) => {
            return convertOrder(productPrice);
          }
        )
      };
    });
}

export function requestCreateOrderLine(
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
  } = data;
  return requestRest({
    url: '/pos/create-order-line',
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
    .then(evaluateResponse)
    .then(createOrderLineResponse => {
      return convertOrderLine(createOrderLineResponse);
    });
}

export function requestUpdateOrderLine(
  data: UpdateOrderLineParams
): Promise<IOrderLineData> {
  const { orderLineUuid, description, quantity, price, discountRate } = data;
  return requestRest({
    url: '/pos/update-order-line',
    data: {
      // is_add_quantity: true,
      order_line_uuid: orderLineUuid,
      description,
      quantity,
      price,
      discount_rate: discountRate
    }
  })
    .then(evaluateResponse)
    .then(createOrderLineResponse => {
      return convertOrderLine(createOrderLineResponse);
    });
}

export function requestDeleteOrderLine(
  data: IDeleteOrderLineParams
): Promise<any> {
  const { orderLineUuid } = data;
  return requestRest({
    url: '/pos/delete-order-line',
    data: {
      order_line_uuid: orderLineUuid
    }
  }).then(evaluateResponse);
}

export function requestListOrderLines(
  data: IListOrderLinesParams
): Promise<IListOrderLinesResponse> {
  const { orderUuid, pageSize, pageToken } = data;
  return requestRest({
    url: '/pos/list-order-lines',
    data: {
      order_uuid: orderUuid
    },
    params: {
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(evaluateResponse)
    .then(ordersLineListResponse => {
      return {
        nextPageToken: ordersLineListResponse.next_page_token,
        recordCount: ordersLineListResponse.record_count,
        orderLineList: ordersLineListResponse.records.map(
          (productPrice: any) => {
            return convertOrderLine(productPrice);
          }
        )
      };
    });
}

export function getKeyLayout(
  data: IGetKeyLayoutParams
): Promise<IKeyLayoutData> {
  const { keyLayoutUuid } = data;
  return requestRest({
    url: '/pos/get-key-layout',
    data: {
      key_layout_uuid: keyLayoutUuid
    }
  })
    .then(evaluateResponse)
    .then(keyLayoutResponse => {
      return convertKeyLayout(keyLayoutResponse);
    });
}

export function requestListProductPrice(
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
  } = data;
  return requestRest({
    url: '/pos/list-product-prices',
    data: {
      price_list_uuid: priceListUuid,
      search_value: searchValue,
      valid_from: validFrom,
      business_partner_uuid: businessPartnerUuid,
      warehouse_uuid: warehouseUuid
    },
    params: {
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(evaluateResponse)
    .then(productPriceListResponse => {
      return {
        nextPageToken: productPriceListResponse.next_page_token,
        recordCount: productPriceListResponse.record_count,
        productPricesList: productPriceListResponse.records.map(
          (productPrice: any) => {
            return convertProductPrice(productPrice);
          }
        )
      };
    });
}

export function requestPrintOrder(data: IPrintOrderParams) {
  const { orderUuid } = data;
  console.info(`Print order ${orderUuid}`);
}

export function requestGenerateImmediateInvoice(data: IGenerateInvoiceParams) {
  const { posUuid, posId } = data;
  console.info(
        `Generate imediate invoice with POS id ${posId}, and uuid ${posUuid}`
  );
}

export function requestCompletePreparedOrder(data: IPrintOrderParams) {
  const { orderUuid } = data;
  console.info(`Complete prepared order ${orderUuid}`);
}

export function requestReverseSalesTransaction(data: IPrintOrderParams) {
  const { orderUuid } = data;
  console.info(`Reverse sales transaction ${orderUuid}`);
}

export function requestCreateWithdrawal(data: IGenerateInvoiceParams) {
  const { posUuid, posId } = data;
  console.info(`Withdrall cash with POS id ${posId}, and uuid ${posUuid}`);
}

export function requestCreateNewCustomerReturnOrder(data: IPrintOrderParams) {
  const { orderUuid } = data;
  console.info(`New Customer Return Order ${orderUuid}`);
}

export function requestCashClosing(data: IGenerateInvoiceParams) {
  const { posUuid, posId } = data;
  console.info(`Cash closing with POS id ${posId}, and uuid ${posUuid}`);
}
