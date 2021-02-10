import { IOverwriteDefinitionData } from '@/ADempiere/shared/utils/lookupFactory'

export interface DecorableCss {
    cssClassName: string
    inputSize?: string
    handleActionKeyPerformed?: boolean
    handleFocusGained?: boolean
    handleFocusLost?: boolean
    isDisplayed?: boolean
    isReadOnly?: boolean
}

export interface IProductCodeData {
    elementColumnName: string
    isFromDictionary: boolean
    overwriteDefinition: Partial<IOverwriteDefinitionData> & DecorableCss
}

const productCode: IProductCodeData[] = [
  // Product Code
  {
    elementColumnName: 'ProductValue',
    isFromDictionary: true,
    overwriteDefinition: {
      size: 24,
      sequence: 10,
      cssClassName: 'price-inquiry',
      inputSize: 'large',
      handleFocusGained: true,
      handleFocusLost: true,
      isDisplayed: true,
      isReadOnly: false
    }
  }
]

export default productCode
