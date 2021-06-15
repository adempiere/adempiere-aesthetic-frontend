import { IFieldLocation } from '@/ADempiere/shared/components/Field/FieldLocation/fieldList'

const tableName = 'C_Order'
const fieldListConvertAmountCollection: IFieldLocation[] = [
  // Currency
  {
    tableName,
    columnName: 'C_Currency_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      validationCode: 'C_Currency.C_Currency_ID = 100 OR C_Currency.C_Currency_ID = 50001',
      isActiveLogics: true,
      isMandatory: true
    }
  }
]

export default fieldListConvertAmountCollection
