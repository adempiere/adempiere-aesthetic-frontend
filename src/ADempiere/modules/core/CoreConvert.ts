import { camelizeObjectKeys, renameObjectKey } from '@/ADempiere/shared/utils/transformObject'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'
import {
  IProductPriceData,
  IContextInfoData,
  IMessageTextData,
  ICriteriaData,
  IBankAccountData,
  IBusinessPartnerData,
  ICountryData,
  ICurrencyData,
  IDocumentStatusData,
  IDocumentTypeData,
  ILanguageData,
  IOrganizationData,
  IPriceListData,
  IProductData,
  ISalesRepresentativeData,
  ITaxRateData,
  IConversionRateData
} from '.'

export function convertContextInfo(
  contextInfo: any
): IContextInfoData {
  if (!contextInfo) {
    return { messageText: {} }
  }
  const convertedContextInfo = camelizeObjectKeys(contextInfo)
  const messageText = contextInfo.message_text ? camelizeObjectKeys(contextInfo.message_text) : {}
  convertedContextInfo.messageText = messageText
  return convertedContextInfo as IContextInfoData
}

export function convertMessageText(
  messageTextToConvert: any
): IMessageTextData {
  if (messageTextToConvert) {
    return {
      id: messageTextToConvert.id,
      // uuid: messageText.uuid,
      value: messageTextToConvert.value,
      messageType: messageTextToConvert.message_type,
      messageText: messageTextToConvert.message_text,
      messageTip: messageTextToConvert.message_tip,
      isActive: messageTextToConvert.is_active
    }
  }
  return {
    id: undefined,
    uuid: undefined,
    value: undefined,
    messageType: undefined,
    messageText: undefined,
    messageTip: undefined,
    isActive: undefined
  }
}

export function convertOrganization(
  organization: any
): IOrganizationData {
  return camelizeObjectKeys(organization) as IOrganizationData
}

export function convertLanguage(language: any): ILanguageData {
  const convertedLanguage = camelizeObjectKeys(language)
  renameObjectKey(convertedLanguage, 'languageIso', 'languageISO')
  return convertedLanguage as ILanguageData
}

export function convertCountry(country: any): ICountryData {
  const convertedCountry = camelizeObjectKeys(country)
  renameObjectKey(convertedCountry, 'isPostCodeLookup', 'isPostcodeLookup')
  convertedCountry.currency = convertCurrency(country.currency)
  return (convertedCountry as ICountryData)
}

export function convertCurrency(currency: any): ICurrencyData {
  if (isEmptyValue(currency)) {
    return {
      id: 0,
      uuid: '',
      iSOCode: '',
      curSymbol: '',
      description: '',
      standardPrecision: 0,
      costingPrecision: 0
    }
  }
  const convertedCurrency = camelizeObjectKeys(currency)
  renameObjectKey(convertedCurrency, 'isoCode', 'iSOCode')
  renameObjectKey(convertedCurrency, 'currencySymbol', 'curSymbol')
  return convertedCurrency as ICurrencyData
}

export function convertBusinessPartner(
  businessPartner: any
): IBusinessPartnerData {
  return camelizeObjectKeys(businessPartner) as IBusinessPartnerData
}

export function convertSalesRepresentative(
  salesRepresentative: any
): ISalesRepresentativeData {
  return (camelizeObjectKeys(salesRepresentative) as ISalesRepresentativeData)
}

export function convertBankAccount(
  bankAccount: any
): IBankAccountData | undefined {
  if (!bankAccount) {
    return undefined
  }

  const convertedBankAccount = camelizeObjectKeys(bankAccount) as Partial<IBankAccountData>
  convertedBankAccount.currency = convertCurrency(bankAccount.currency)
  convertedBankAccount.businessPartner = convertBusinessPartner(bankAccount.business_partner)
  return convertedBankAccount as IBankAccountData
}

export function convertDocumentType(
  documentType: any
): IDocumentTypeData | undefined {
  if (!documentType) {
    return undefined
  }
  return camelizeObjectKeys(documentType) as IDocumentTypeData
}

export function convertDocumentStatus(
  documentStatus: any
): IDocumentStatusData {
  return camelizeObjectKeys(documentStatus) as IDocumentStatusData
}

export function convertPriceList(priceList: any): IPriceListData {
  const convertedPriceList = camelizeObjectKeys(priceList) as Partial<IPriceListData>
  convertedPriceList.currency = convertCurrency(priceList.currency)
  return convertedPriceList as IPriceListData
}

export function convertProductPrice(
  productPrice: any
): IProductPriceData {
  const convertedProductPrice = camelizeObjectKeys(productPrice)
  convertedProductPrice.currency = convertCurrency(productPrice.currency)
  convertedProductPrice.taxRate = convertTaxRate(productPrice.tax_rate)
  convertedProductPrice.product = convertProduct(productPrice.product)
  convertedProductPrice.schemaCurrency = convertCurrency(productPrice.schema_currency)
  return convertedProductPrice as IProductPriceData
}

export function convertConversionRate(
  conversionRate: any
): IConversionRateData | Partial<IConversionRateData> {
  const convertedRate = camelizeObjectKeys(conversionRate) as Partial<IConversionRateData>
  if (isEmptyValue(conversionRate.currency_from) && isEmptyValue(conversionRate.currency_to)) {
    delete convertedRate.validFrom
    delete convertedRate.conversionTypeUuid
    return convertedRate
  }
  convertedRate.currencyFrom = convertCurrency(conversionRate.currency_from)
  convertedRate.currencyTo = convertCurrency(conversionRate.currency_to)
  return convertedRate as IConversionRateData
}

export function convertTaxRate(taxRate: any): ITaxRateData {
  return camelizeObjectKeys(taxRate) as ITaxRateData
}

export function convertProduct(product: any): IProductData {
  return camelizeObjectKeys(product) as IProductData
}
