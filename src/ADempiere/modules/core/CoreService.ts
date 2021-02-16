// Get Instance for connectionimport {
import {
  ApiRest as requestRest,
  evaluateResponse
} from '@/ADempiere/shared/services/instances'
import {
  convertBusinessPartner,
  convertConversionRate,
  convertCountry,
  convertLanguage,
  convertOrganization,
  convertProductPrice
} from '@/ADempiere/modules/core'
import {
  IProductPriceData,
  IGetProductPriceParams,
  ICountryData,
  IBusinessPartnerData,
  IConversionRateData,
  ICreateBusinessPartnerParams,
  IGetBusinessPartnerParams,
  IGetConversionRateParams,
  IGetCountryDefinitionParams,
  ILanguagesListParams,
  ILanguajesListResponse,
  IListBusinessPartnerParams,
  IListBusinessPartnerResponse,
  IOrganizationsListParams,
  IOrganizationsListResponse,
  IWarehousesListParams,
  IWarehousesListResponse
} from './CoreType'

// List Point of sales
export function requestGetProductPrice(
  data: IGetProductPriceParams
): Promise<IProductPriceData> {
  const {
    searchValue,
    upc,
    value,
    priceListUuid,
    businessPartnerUuid,
    warehouseUuid,
    validFrom
  } = data
  return requestRest({
    url: '/pos/get-product-price',
    data: {
      search_value: searchValue,
      upc,
      value,
      name,
      price_list_uuid: priceListUuid,
      business_partner_uuid: businessPartnerUuid,
      warehouse_uuid: warehouseUuid,
      valid_from: validFrom
    }
  })
    .then(evaluateResponse)
    .then(productPriceResponse => {
      return convertProductPrice(productPriceResponse)
    })
}

// Get Organization list from role
export function requestOrganizationsList(
  data: IOrganizationsListParams
): Promise<IOrganizationsListResponse> {
  const { roleId, roleUuid, pageSize, pageToken } = data
  return requestRest({
    url: '/core/list-organizations',
    data: {
      role_id: roleId,
      role_uuid: roleUuid
    },
    params: {
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(organizationsListResponse => {
      return {
        nextPageToken: organizationsListResponse.next_page_token,
        recordCount: organizationsListResponse.record_count,
        organizationsList: organizationsListResponse.records.map(
          (organization: any) => {
            return convertOrganization(organization)
          }
        )
      }
    })
}

// Get Warehouses of Organization
export function requestWarehousesList(
  data: IWarehousesListParams
): Promise<IWarehousesListResponse> {
  const { organizationId, organizationUuid, pageToken, pageSize } = data
  return requestRest({
    url: '/core/list-warehouses',
    data: {
      organization_id: organizationId,
      organization_uuid: organizationUuid
    },
    params: {
      // Page Data
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then(warehousesListResponse => {
      return {
        nextPageToken: warehousesListResponse.next_page_token,
        recordCount: warehousesListResponse.record_count,
        warehousesList: warehousesListResponse.records
      }
    })
}

export function requestGetCountryDefinition(
  data: IGetCountryDefinitionParams
): Promise<ICountryData> {
  const { id, uuid } = data
  return requestRest({
    url: '/core/country',
    method: 'get',
    params: {
      id,
      uuid
    }
  })
    .then(evaluateResponse)
    .then(countryResponse => {
      return convertCountry(countryResponse)
    })
}

export function requestLanguagesList(
  data: ILanguagesListParams
): Promise<ILanguajesListResponse> {
  const { pageToken, pageSize } = data
  return requestRest({
    url: '/core/list-languages',
    params: {
      pageToken,
      pageSize
    }
  })
    .then(evaluateResponse)
    .then((languagesListResponse: any) => {
      return {
        nextPageToken: languagesListResponse.next_page_token,
        recordCount: languagesListResponse.record_count,
        list: languagesListResponse.records.map(
          (language: any) => {
            return convertLanguage(language)
          }
        )
      }
    })
}

export function requestCreateBusinessPartner(
  data: ICreateBusinessPartnerParams
): Promise<IBusinessPartnerData> {
  const {
    value,
    taxId,
    duns,
    naics,
    name,
    lastName,
    description,
    contactName,
    eMail,
    phone,
    businessPartnerGroupUuid,
    // Location
    address1,
    address2,
    address3,
    address4,
    cityUuid,
    cityName,
    postalCode,
    regionUuid,
    regionName,
    countryUuid,
    posUuid
  } = data
  return requestRest({
    url: '/core/create-business-partner',
    data: {
      value,
      tax_id: taxId,
      duns,
      naics,
      name,
      last_name: lastName,
      description,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      business_partner_group_uid: businessPartnerGroupUuid,
      // Location
      address1,
      address2,
      address3,
      address4,
      city_uuid: cityUuid,
      city_name: cityName,
      postal_code: postalCode,
      region_uuid: regionUuid,
      region_name: regionName,
      country_uuid: countryUuid,
      pos_uuid: posUuid
    }
  })
    .then(evaluateResponse)
    .then(businessPartnerResponse => {
      return convertBusinessPartner(businessPartnerResponse)
    })
}

export function requestGetBusinessPartner(
  data: IGetBusinessPartnerParams
): Promise<IBusinessPartnerData> {
  const { searchValue } = data
  return requestRest({
    url: '/core/get-business-partner',
    method: 'get',
    params: {
      search_value: searchValue
    }
  })
    .then(evaluateResponse)
    .then(businessPartnerResponse => {
      return convertBusinessPartner(businessPartnerResponse)
    })
}

export function requestListBusinessPartner(
  data: IListBusinessPartnerParams
): Promise<IListBusinessPartnerResponse> {
  const {
    name,
    searchValue,
    value,
    contactName,
    eMail,
    postalCode,
    phone,
    pageSize,
    pageToken
  } = data
  return requestRest({
    url: '/core/list-business-partner',
    data: {
      search_value: searchValue,
      value,
      name,
      contact_name: contactName,
      e_mail: eMail,
      phone,
      // Location
      postal_code: postalCode
    },
    params: {
      page_size: pageSize,
      page_token: pageToken
    }
  })
    .then(evaluateResponse)
    .then(businessPartnerResponse => {
      return {
        nextPageToken: businessPartnerResponse.next_page_token,
        recordCount: businessPartnerResponse.record_count,
        list: businessPartnerResponse.records.map(
          (businessPartner: any) => {
            return convertBusinessPartner(businessPartner)
          }
        )
      }
    })
}

/**
 * TODO: Add uuid support
 * @param {string} conversionTypeUuid
 * @param {string} currencyFromUuid
 * @param {string} currencyToUuid
 * @param {date}   conversionDate
 * @returns {promise}
 */
export function requestGetConversionRate(
  data: IGetConversionRateParams
): Promise<IConversionRateData | Partial<IConversionRateData>> {
  const {
    // conversionDate,
    conversionTypeUuid,
    currencyFromUuid,
    currencyToUuid
  } = data
  return requestRest({
    url: '/core/get-conversion-rate',
    data: {
      conversion_type_uuid: conversionTypeUuid,
      currency_from_uuid: currencyFromUuid,
      currency_to_uuid: currencyToUuid
      // conversion_date: conversionDate
    }
  })
    .then(evaluateResponse)
    .then(conversionRateResponse => {
      return convertConversionRate(conversionRateResponse)
    })
}
