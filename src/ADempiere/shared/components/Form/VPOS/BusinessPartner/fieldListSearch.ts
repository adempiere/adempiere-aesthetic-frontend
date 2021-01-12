import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'

// List of fields to send in search
const fieldListSearch: Partial<IFieldLocation>[] = [
  {
    columnName: 'Code',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Search Value',
      isCustomField: true
    }
  },
  {
    columnName: 'Value',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Search Key',
      isCustomField: true
    }
  },
  {
    columnName: 'Name',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Name',
      isCustomField: true
    }
  },
  {
    columnName: 'Contact',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Contact Name',
      isCustomField: true
    }
  },
  {
    columnName: 'EMail',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'E-Mail Address',
      isCustomField: true
    }
  },
  {
    columnName: 'Postal',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Postal Code',
      isCustomField: true
    }
  },
  {
    columnName: 'Phone',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Phone',
      isCustomField: true
    }
  }
]

export default fieldListSearch
