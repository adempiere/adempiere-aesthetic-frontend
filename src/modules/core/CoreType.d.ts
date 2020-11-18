export interface IMessageTextData {
  id?: number;
  uuid?: string;
  value?: string;
  messageType?: string;
  messageText?: string;
  messageTip?: string;
  isActive?: boolean;
}

export interface IContextInfoData {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  sqlStatement?: string;
  isActive?: boolean;
  messageText?: IMessageTextData;
}

export enum ValueType {
  UNKNOWN,
  INTEGER,
  DECIMAL,
  BOOLEAN,
  STRING,
  DATE
}

export interface IValueData {
  intValue: number;
  longValue: number;
  booleanValue: boolean;
  stringValue: string;
  decimalValue: number;
  valueType: ValueType;
}

export enum OperatorType {
  EQUAL,
  NOT_EQUAL,
  LIKE,
  NOT_LIKE,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  BETWEEN
}

export enum OrderType {
  ASCENDING = 0,
  DESCENDING = 1
}

export interface IOrderByPropertyData {
  columnName: string;
  orderType: OrderType;
}

export interface Condition {
  columnName: string;
  value: IValueData;
  valueTo: IValueData;
  values: IValueData[];
  operator: OperatorType;
  conditions: Condition[];
}

export interface ICriteriaData {
  tableName: string;
  query: string;
  whereClause: string;
  orderByClause: string;
  referenceUuid: string;
  conditionsList?: Condition[];
  valuesList: IValueData[];
  orderByColumnList: IOrderByPropertyData[];
  limit: number;
}

export interface IOrganizationData {
  id: number;
  uuid: string;
  name: string;
  description: string;
  isReadOnly: boolean;
  duns: string;
  taxId: string;
  phone: string;
  phone2: string;
  fax: string;
}

export interface ILanguageData {
  language: string;
  languageName: string;
  languageISO: string;
  countryCode: string;
  isBaseLanguage: boolean;
  isSystemLanguage: boolean;
  isDecimalPoint: boolean;
  datePattern: string;
  timePattern: string;
}

export interface ICurrencyData {
  id: number;
  uuid: string;
  iSOCode: string;
  curSymbol: string;
  description: string;
  standardPrecision: number;
  costingPrecision: number;
}

export interface ICountryData {
  id: number;
  uuid: string;
  countryCode: string;
  name: string;
  description: string;
  hasRegion: boolean;
  regionName: string;
  displaySequence: string;
  isAddressLinesReverse: boolean;
  captureSequence: string;
  displaySequenceLocal: string;
  isAddressLinesLocalReverse: boolean;
  expressionPostal: string;
  hasPostalAdd: boolean;
  expressionPhone: string;
  mediaSize: string;
  expressionBankRoutingNo: string;
  expressionBankAccountNo: string;
  language: string;
  allowCitiesOutOfList: boolean;
  isPostcodeLookup: boolean;
  currency: ICurrencyData;
}

export interface IBusinessPartnerData {
  uuid: string;
  id: number;
  value: string;
  taxId: string;
  duns: string;
  naics: string;
  name: string;
  lastName: string;
  description: string;
}

export interface ISalesRepresentativeData {
  uuid: string;
  id: number;
  name: string;
  description: string;
}

export enum BankAccountType {
  CHECKING = 0,
  SAVINGS = 1
}

export interface IBankAccountData {
  uuid: string;
  id: number;
  name: string;
  accountNo: string;
  description: string;
  currency: ICurrencyData;
  bban: string;
  iban: string;
  creditLimit: number;
  currentBalance: number;
  isDefault: boolean;
  businessPartner: IBusinessPartnerData;
  bankAccountType: BankAccountType;
  bankAccountTypeName: string;
}

export interface IDocumentTypeData {
  uuid: string;
  id: number;
  name: string;
  description: string;
  printName: string;
}

export interface IDocumentStatusData {
  name: string;
  description: string;
  value: string;
}

export interface IPriceListData {
  uuid: string;
  id: number;
  name: string;
  description: string;
  currency: ICurrencyData;
  isDefault: boolean;
  isTaxIncluded: boolean;
  isEnforcePriceLimit: boolean;
  isNetPrice: boolean;
  pricePrecision: number;
}

export interface ITaxRateData {
  name: string;
  description: string;
  taxIndicator: string;
  rate: number;
  // Optional
  id?: number;
  uuid?: string;
}

export interface IProductData {
  uuid: string;
  id: number;
  value: string;
  name: string;
  help: string;
  documentNote: string;
  uomName: string;
  productType: string;
  isStocked: boolean;
  isDropShip: boolean;
  isPurchased: boolean;
  isSold: boolean;
  imageUrl: string;
  productCategoryName: string;
  productGroupName: string;
  productClassName: string;
  productClassificationName: string;
  weight: number;
  volume: number;
  upc: string;
  sku: string;
  shelfWidth: number;
  shelfHeight: number;
  shelfDepth: number;
  unitsPerPack: number;
  unitsPerPallet: number;
  guaranteeDays: number;
  descriptionUrl: string;
  versionNo: string;
  taxCategory: string;
  description: string;
}

export interface IProductPriceData {
  currency: ICurrencyData;
  taxRate: ITaxRateData;
  product: IProductData;
  priceList: number;
  priceStandard: number;
  priceLimit: number;
  priceListName: string;
  isTaxIncluded: boolean;
  validFrom: number;
  pricePrecision: number;
  quantityOnHand: number;
  quantityReserved: number;
  quantityOrdered: number;
  quantityAvailable: number;
}
