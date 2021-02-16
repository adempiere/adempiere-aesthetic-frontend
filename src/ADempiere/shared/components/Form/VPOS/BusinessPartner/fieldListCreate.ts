import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'

const tableName = 'C_BPartner'
// List of fields to send for create new
const fieldListCreate: Partial<IFieldLocation>[] = [
  {
    columnName: 'Value',
    // displayType: CHAR.id,
    tableName,
    overwriteDefinition: {
      // name: 'Search Key',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Name',
    // displayType: CHAR.id,
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      // name: 'Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Name2',
    // displayType: CHAR.id,
    tableName,
    isFromDictionary: true,
    overwriteDefinition: {
      // name: 'Name',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'EMail',
    // displayType: CHAR.id,
    tableName: 'AD_user',
    isFromDictionary: true,
    overwriteDefinition: {
      // name: 'E-Mail Address',
      isCustomField: true,
      size: 24
    }
  },
  {
    columnName: 'Phone',
    tableName: 'AD_user',
    isFromDictionary: true,
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
