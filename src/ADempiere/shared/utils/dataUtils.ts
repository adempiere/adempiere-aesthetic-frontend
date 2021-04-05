export interface IOperatorDataUtils {
    operator: string
    symbol: string
}

const OPERATOR_EQUAL: IOperatorDataUtils = {
  operator: 'EQUAL',
  symbol: '='
}

const OPERATOR_NOT_EQUAL: IOperatorDataUtils = {
  operator: 'NOT_EQUAL',
  symbol: '<>'
}

const OPERATOR_LIKE: IOperatorDataUtils = {
  operator: 'LIKE',
  symbol: '%'
}

const OPERATOR_NOT_LIKE: IOperatorDataUtils = {
  operator: 'NOT_LIKE',
  symbol: '!%'
}

const OPERATOR_GREATER: IOperatorDataUtils = {
  operator: 'GREATER',
  symbol: '>'
}

const OPERATOR_GREATER_EQUAL: IOperatorDataUtils = {
  operator: 'GREATER_EQUAL',
  symbol: '>='
}

const OPERATOR_LESS: IOperatorDataUtils = {
  operator: 'LESS',
  symbol: '<'
}

const OPERATOR_LESS_EQUAL: IOperatorDataUtils = {
  operator: 'LESS_EQUAL',
  symbol: '<='
}

const OPERATOR_BETWEEN: IOperatorDataUtils = {
  operator: 'BETWEEN',
  symbol: '>-<'
}

const OPERATOR_NULL: IOperatorDataUtils = {
  operator: 'NULL',
  symbol: ''
}

const OPERATOR_NOT_NULL: IOperatorDataUtils = {
  operator: 'NOT_NULL',
  symbol: ''
}

const OPERATOR_IN: IOperatorDataUtils = {
  operator: 'IN',
  symbol: '()'
}

const OPERATOR_NOT_IN: IOperatorDataUtils = {
  operator: 'NOT_IN',
  symbol: '!()'
}

const STANDARD_OPERATORS_LIST: string[] = [
  OPERATOR_EQUAL.operator,
  OPERATOR_NOT_EQUAL.operator,
  OPERATOR_NULL.operator,
  OPERATOR_NOT_NULL.operator
]

const MULTIPLE_OPERATORS_LIST: string[] = [
  OPERATOR_IN.operator,
  OPERATOR_NOT_IN.operator
]

const TEXT_OPERATORS_LIST: string[] = [
  OPERATOR_LIKE.operator,
  OPERATOR_NOT_LIKE.operator
]

const RANGE_OPERATORS_LIST: string[] = [
  OPERATOR_GREATER.operator,
  OPERATOR_GREATER_EQUAL.operator,
  OPERATOR_LESS.operator,
  OPERATOR_LESS_EQUAL.operator
]

export const OPERATORS_LIST: IOperatorDataUtils[] = [
  OPERATOR_EQUAL,
  OPERATOR_NOT_EQUAL,
  OPERATOR_LIKE,
  OPERATOR_NOT_LIKE,
  OPERATOR_GREATER,
  OPERATOR_LESS,
  OPERATOR_LESS_EQUAL,
  OPERATOR_BETWEEN,
  OPERATOR_NOT_NULL,
  OPERATOR_NULL,
  OPERATOR_IN,
  OPERATOR_NOT_IN
]

export interface IOperatorFieldUtils {
    componentPath: string
    isRange: boolean
    operatorsList: string[]
}

export const OPERATORS_FIELD_AMOUNT: IOperatorFieldUtils = {
  componentPath: 'FieldAmount',
  isRange: true,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...RANGE_OPERATORS_LIST,
    ...MULTIPLE_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_DATE: IOperatorFieldUtils = {
  componentPath: 'FieldDate',
  isRange: true,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...RANGE_OPERATORS_LIST,
    ...MULTIPLE_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_NUMBER: IOperatorFieldUtils = {
  componentPath: 'FieldNumber',
  isRange: true,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...RANGE_OPERATORS_LIST,
    ...MULTIPLE_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_SELECT: IOperatorFieldUtils = {
  componentPath: 'FieldSelect',
  isRange: false,
  operatorsList: [...STANDARD_OPERATORS_LIST, ...MULTIPLE_OPERATORS_LIST]
}

export const OPERATORS_FIELD_TEXT: IOperatorFieldUtils = {
  componentPath: 'FieldText',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...TEXT_OPERATORS_LIST,
    ...MULTIPLE_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_TEXT_LONG: IOperatorFieldUtils = {
  componentPath: 'FieldTextLong',
  isRange: false,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...TEXT_OPERATORS_LIST,
    ...MULTIPLE_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_TIME: IOperatorFieldUtils = {
  componentPath: 'FieldTime',
  isRange: true,
  operatorsList: [
    ...STANDARD_OPERATORS_LIST,
    ...RANGE_OPERATORS_LIST,
    ...MULTIPLE_OPERATORS_LIST
  ]
}

export const OPERATORS_FIELD_YES_NO: IOperatorFieldUtils = {
  componentPath: 'FieldYesNo',
  isRange: false,
  operatorsList: [...STANDARD_OPERATORS_LIST]
}

// Components associated with search componentPath
export const FIELD_OPERATORS_LIST: IOperatorFieldUtils[] = [
  OPERATORS_FIELD_AMOUNT,
  OPERATORS_FIELD_DATE,
  OPERATORS_FIELD_NUMBER,
  OPERATORS_FIELD_SELECT,
  OPERATORS_FIELD_TEXT,
  OPERATORS_FIELD_TEXT_LONG,
  OPERATORS_FIELD_TEXT_LONG,
  OPERATORS_FIELD_TIME,
  OPERATORS_FIELD_YES_NO
]

/**
 * Log columns list into table
 * Manages with user session
 */
export const LOG_COLUMNS_NAME_LIST: string[] = [
  'Created',
  'CreatedBy',
  'Updated',
  'UpdatedBy'
]

/**
 * Columns list into standard table
 */
export const STANDARD_COLUMNS_NAME_LIST: string[] = [
  ...LOG_COLUMNS_NAME_LIST,
  // Table Name '_ID'
  'AD_Client_ID',
  'AD_Org_ID',
  'IsActive',
  'UUID'
]

/**
 * Columns list into document table
 */
export const DOCUMENT_COLUMNS_NAME_LIST: string[] = [
  ...STANDARD_COLUMNS_NAME_LIST,
  'C_DocType_ID',
  'DateDoc',
  'Description',
  'DocAction',
  'DocStatus',
  'DocumentNo',
  'IsApproved',
  'Processed',
  'Processing'
]
