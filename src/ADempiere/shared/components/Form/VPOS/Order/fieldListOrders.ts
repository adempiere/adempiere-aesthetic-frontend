import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'

const tableName = 'C_Order'

const fieldListOrders: IFieldLocation[] = [
  {
    tableName,
    columnName: 'DocumentNo',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'C_BPartner_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'GrandTotal',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'OpenAmt',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsPaid',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'Processed',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    elementColumnName: 'IsAisleSeller',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'IsInvoiced',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'DateOrdered',
    isFromDictionary: true,
    overwriteDefinition: {
      columnName: 'DateOrderedFrom',
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'DateOrdered',
    isFromDictionary: true,
    overwriteDefinition: {
      columnName: 'DateOrderedTo',
      size: 8,
      isMandatory: false
    }
  },
  {
    tableName,
    columnName: 'SalesRep_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 8,
      isMandatory: false
    }
  }
]

export default fieldListOrders
