import { IOverwriteDefinitionData } from '@/ADempiere/shared/utils/lookupFactory'
import { IProductCodeData } from '../PriceChecking/fieldList'

const fieldsList: IProductCodeData[] = [
  {
    elementColumnName: 'ProductValue',
    isFromDictionary: true,
    value: '',
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      cssClassName: 'price-inquiry',
      inputSize: 'large',
      handleFocusGained: true,
      handleFocusLost: true,
      handleActionKeyPerformed: true,
      isDisplayed: true,
      isReadOnly: true
      // componentPath: 'FieldSelect
    }
  }
]

export default fieldsList
