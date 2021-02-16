import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'

const tableName = 'C_BPartner'
// List of fields to send for create new
const fieldListCreate: Partial<IFieldLocation>[] = [
  {
    elementColumnName: 'Value',
    columnName: 'Value',
    // displayType: CHAR.id,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'Name',
    columnName: 'Name',
    // displayType: CHAR.id,
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'Name2',
    columnName: 'Name2',
    // displayType: CHAR.id,
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'EMail',
    columnName: 'EMail',
    // displayType: CHAR.id,
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'Phone',
    columnName: 'Phone',
    tableName: 'AD_user',
    isFromDictionary: true,
    // displayType: CHAR.id,
    overwriteDefinition: {
      isCustomField: true,
      size: 24
    }
  },
  {
    elementColumnName: 'C_Location_ID',
    columnName: 'C_Location_ID',
    tableName: 'C_BPartner_Location',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      componentPath: 'FieldLocation',
      handleActionPerformed: false,
      isSendParentValues: true,
      popoverPlacement: 'top'
    }
  }
]

export default fieldListCreate
