import { OrderState } from '../../POSType'

export const state: OrderState = {
  order: {
    documentType: {
      description: '',
      name: '',
      id: 0,
      printName: '',
      uuid: ''
    },
    documentStatus: {
      description: '',
      value: '',
      name: ''
    },
    totalLines: 0,
    grandTotal: 0,
    salesRepresentative: {
      name: '',
      description: '',
      id: 0,
      uuid: ''
    },
    businessPartner: {
      description: '',
      duns: '',
      id: 0,
      lastName: '',
      naics: '',
      name: '',
      taxId: '',
      value: '',
      uuid: ''
    },
    uuid: ''
  },
  findOrder: undefined,
  listOrder: {
    isLoaded: false,
    isReload: true,
    recordCount: 0,
    nextPageToken: undefined,
    isShowPopover: false
  }
}
