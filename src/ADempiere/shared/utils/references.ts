// This file is used for set a static values for references of fields,
// currently exists for ADempiere metadata distints display types and are represented for follow:

export interface ISizeData {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
}

export type IFieldReferencesType = {
    id: number
    isSupported: boolean
    valueType: string
    componentPath: string
    size: {
        xs: number
        sm: number
        md: number
        lg: number
        xl: number
    }
}

export const DEFAULT_SIZE: ISizeData = {
  xs: 6,
  sm: 8,
  md: 2,
  lg: 6,
  xl: 6
}

// Account Element
export const ACCOUNT_ELEMENT: IFieldReferencesType = {
  id: 25,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Amount (Number with 4 decimals)
export const AMOUNT: IFieldReferencesType = {
  id: 12,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Resource Assignment
export const RESOURCE_ASSIGNMENT: IFieldReferencesType = {
  id: 33,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Binary Data (display type BLOB)
export const BINARY_DATA: IFieldReferencesType = {
  id: 23,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldBinary',
  size: {
    xs: 6,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6
  }
}

// Button
export const BUTTON: IFieldReferencesType = {
  // this component is hidden
  id: 28,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldButton',
  size: {
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  }
}

// Chart
export const CHART: IFieldReferencesType = {
  id: 53370,
  isSupported: false,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Color
export const COLOR: IFieldReferencesType = {
  id: 27,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldColor',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Cost or Prices
export const COSTS_PLUS_PRICES: IFieldReferencesType = {
  id: 37,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Date
export const DATE: IFieldReferencesType = {
  id: 15,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldDate',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Date with time
export const DATE_PLUS_TIME: IFieldReferencesType = {
  id: 16,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldDate',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Local File
export const LOCAL_FILE: IFieldReferencesType = {
  id: 39,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Local File Path
export const LOCAL_FILE_PATH: IFieldReferencesType = {
  id: 38,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Local File Path or Name
export const LOCAL_FILE_PATH_OR_NAME: IFieldReferencesType = {
  id: 53670,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// ID
export const ID: IFieldReferencesType = {
  id: 13,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Binary Image Data
export const IMAGE: IFieldReferencesType = {
  id: 32,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldImage',
  size: {
    xs: 6,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6
  }
}

// Integer
export const INTEGER: IFieldReferencesType = {
  id: 11,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Reference List
export const LIST: IFieldReferencesType = {
  id: 17,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Location Address
export const LOCATION_ADDRESS: IFieldReferencesType = {
  id: 21,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldLocation',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Warehouse Locator Data type
export const LOCATOR_WAREHOUSE: IFieldReferencesType = {
  id: 31,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldLocator',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Memo
export const MEMO: IFieldReferencesType = {
  id: 34,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldTextLong',
  size: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24
  }
}

// Float Number
export const NUMBER: IFieldReferencesType = {
  id: 22,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Printer Name
export const PRINTER_NAME: IFieldReferencesType = {
  id: 42,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Product Attribute
export const PRODUCT_ATTRIBUTE : IFieldReferencesType = {
  id: 35,
  isSupported: false,
  valueType: 'INTEGER',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Quantity
export const QUANTITY: IFieldReferencesType = {
  id: 29,
  isSupported: true,
  valueType: 'DECIMAL',
  componentPath: 'FieldNumber',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Search
export const SEARCH: IFieldReferencesType = {
  id: 30,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Char (display type String)
export const CHAR: IFieldReferencesType = {
  id: 10,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Table List
export const TABLE: IFieldReferencesType = {
  id: 18,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Table Dir
export const TABLE_DIRECT: IFieldReferencesType = {
  id: 19,
  isSupported: true,
  valueType: 'INTEGER',
  componentPath: 'FieldSelect',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Text
export const TEXT: IFieldReferencesType = {
  id: 14,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Text Long
export const TEXT_LONG: IFieldReferencesType = {
  id: 36,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldTextLong',
  size: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24
  }
}

// Time
export const TIME: IFieldReferencesType = {
  id: 24,
  isSupported: true,
  valueType: 'DATE',
  componentPath: 'FieldTime',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// URL
export const URL: IFieldReferencesType = {
  id: 40,
  isSupported: true,
  valueType: 'STRING',
  componentPath: 'FieldText',
  size: {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6
  }
}

// Yes No
export const YES_NO: IFieldReferencesType = {
  id: 20,
  isSupported: true,
  valueType: 'BOOLEAN',
  componentPath: 'FieldYesNo',
  size: {
    xs: 14,
    sm: 8,
    md: 8,
    lg: 3,
    xl: 6
  }
}

export const FIELDS_LOOKUP: number[] = [
  LIST.id,
  TABLE.id,
  TABLE_DIRECT.id,
  SEARCH.id,
  ACCOUNT_ELEMENT.id,
  LOCATION_ADDRESS.id,
  LOCATOR_WAREHOUSE.id,
  PRODUCT_ATTRIBUTE.id,
  RESOURCE_ASSIGNMENT.id
]

// Some helper methods
export function isLookup(displayType: number): boolean {
  return FIELDS_LOOKUP.includes(displayType)
}

/**
 * All references
 * {number} id: Identifiert to field reference
 * {string|array} valueType: to convert and send server with gRPC
 * {boolean} isSupported: Indicate if field is suported
 */

const REFERENCES: IFieldReferencesType[] = [
  ACCOUNT_ELEMENT,
  AMOUNT,
  RESOURCE_ASSIGNMENT,
  BINARY_DATA,
  BUTTON,
  CHART,
  COLOR,
  COSTS_PLUS_PRICES,
  DATE,
  DATE_PLUS_TIME,
  LOCAL_FILE,
  LOCAL_FILE_PATH,
  LOCAL_FILE_PATH_OR_NAME,
  ID,
  IMAGE,
  INTEGER,
  LIST,
  LOCATION_ADDRESS,
  LOCATOR_WAREHOUSE,
  MEMO,
  NUMBER,
  PRINTER_NAME,
  PRODUCT_ATTRIBUTE,
  QUANTITY,
  SEARCH,
  // String as CHAR
  CHAR,
  TABLE,
  TABLE_DIRECT,
  TEXT,
  TEXT_LONG,
  TIME,
  URL,
  YES_NO
]
export default REFERENCES

export const FIELDS_RANGE: IFieldReferencesType[] = [
  AMOUNT,
  COSTS_PLUS_PRICES,
  DATE,
  DATE_PLUS_TIME,
  INTEGER,
  NUMBER,
  QUANTITY,
  TIME
]

/**
 * Fields not showed in panel's
 */
export const FIELDS_HIDDEN: IFieldReferencesType[] = [BUTTON]

/**
 * Fields with this column name, changed all fields is read only
 */
export interface IFieldFormType {
    columnName: string // column name of field
    defaultValue: boolean // default value when loading
    valueIsReadOnlyForm: boolean // value that activates read-only form
    isChangedAllForm: boolean // change the entire form to read only including this field
}

export const FIELDS_READ_ONLY_FORM: IFieldFormType[] = [
  {
    columnName: 'IsActive', // column name of field
    defaultValue: true, // default value when loading
    valueIsReadOnlyForm: false, // value that activates read-only form
    isChangedAllForm: false // change the entire form to read only including this field
  },
  {
    columnName: 'Processed',
    defaultValue: false,
    valueIsReadOnlyForm: true,
    isChangedAllForm: true
  },
  {
    columnName: 'Processing',
    defaultValue: true,
    valueIsReadOnlyForm: false,
    isChangedAllForm: true
  }
]

export const FIELDS_DECIMALS: number[] = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id,
  NUMBER.id,
  QUANTITY.id
]

export const FIELDS_QUANTITY: number[] = [
  AMOUNT.id,
  COSTS_PLUS_PRICES.id,
  INTEGER.id,
  NUMBER.id,
  QUANTITY.id
]

/**
 * Manage the currency prefix/sufix in the format to display
 */
export const FIELDS_CURRENCY: number[] = [AMOUNT.id, COSTS_PLUS_PRICES.id]
