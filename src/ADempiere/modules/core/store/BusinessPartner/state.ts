import { BusinessPartnerState } from '../../CoreType'

export const state : BusinessPartnerState = {
  isLoaded: false,
  isReload: true,
  isShowList: false, // popover with records list
  isShowCreate: false, // popover with create form
  recordCount: 0,
  nextPageToken: undefined,
  businessPartnersList: [],

  pageNumber: 0,
  token: undefined
}
