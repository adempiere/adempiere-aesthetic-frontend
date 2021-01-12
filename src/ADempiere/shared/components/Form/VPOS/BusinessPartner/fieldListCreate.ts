import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'

// List of fields to send for create new
const fieldListCreate: Partial<IFieldLocation>[] = [
  {
    columnName: 'Value',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Search Key',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Name',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Contact',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Contact Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'EMail',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'E-Mail Address',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Postal',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Postal Code',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Phone',
    // displayType: CHAR.id,
    overwriteDefinition: {
      name: 'Phone',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'C_Location_ID',
    tableName: 'C_BPartner_Location',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      handleActionPerformed: false,
      isSendParentValues: true,
      popoverPlacement: 'top'
    }
  }
]

export default fieldListCreate
