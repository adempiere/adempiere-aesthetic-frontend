import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'

// List of fields to send in search
const fieldListSearch: Partial<IFieldLocation>[] = [
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    tableName: 'C_BPartner',
    isFromDictionary: true,
    // displayType: CHAR.id,
    overwriteDefinition: {
      isCustomField: true
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    tableName: 'C_BPartner',
    isFromDictionary: true,
    // displayType: CHAR.id,
    overwriteDefinition: {
      isCustomField: true
    }
  },
  {
    elementColumnName: 'Name2',
    tableName: 'C_BPartner',
    isFromDictionary: true,
    columnName: 'Name2',
    overwriteDefinition: {
      isCustomField: true
    }
  },
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true
    }
  },
  {
    elementColumnName: 'Postal',
    columnName: 'Postal',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true
    }
  },
  {
    elementColumnName: 'Phone',
    columnName: 'Phone',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true
    }
  }
]

export default fieldListSearch
