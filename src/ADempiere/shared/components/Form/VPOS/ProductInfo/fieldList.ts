import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'
const fieldList: IFieldLocation[] = [
  // Product Code
  {
    elementColumnName: 'ProductValue',
    columnName: 'ProductValue',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      handleActionKeyPerformed: true
    }
  }
]

export default fieldList
