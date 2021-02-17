import { IOverwriteDefinitionData } from '@/ADempiere/shared/utils/lookupFactory'

export interface IFieldLocation {
    tableName?: string
    isFromDictionary: boolean
    columnName?: string
    tabindex?: string
    overwriteDefinition: Partial<IOverwriteDefinitionData>
    elementColumnName?: string
    reference?: any
    // {
    //   size: number
    //   index: number
    //   isCustomField?: boolean
    //   isActiveLogics?: boolean
    //   defaultValue?: string
    //   sequenceFields?: string
    //   isDisplayed?: boolean
    //   //
    //   sequence?: number
    // }
}

const fieldBase: IFieldLocation = {
  tableName: 'C_Location',
  isFromDictionary: true,
  overwriteDefinition: {
    size: 24,
    index: 0
  }
}

const fieldList: IFieldLocation[] = [
  {
    ...fieldBase,
    elementColumnName: 'C_Location_ID',
    columnName: 'C_Location_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      isDisplayed: false,
      index: 1
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_Country_ID',
    columnName: 'C_Country_ID',
    overwriteDefinition: {
      isCustomField: true,
      isActiveLogics: true, // enable logics
      defaultValue: '@#C_Country_ID@',
      size: 24,
      sequenceFields: 'CO',
      index: 2
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_Region_ID',
    columnName: 'C_Region_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'R',
      index: 3
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'C_City_ID',
    columnName: 'C_City_ID',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'C',
      index: 4
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address1',
    columnName: 'Address1',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A1',
      index: 5
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address2',
    columnName: 'Address2',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A2',
      index: 6
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address3',
    columnName: 'Address3',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A3',
      index: 7
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Address4',
    columnName: 'Address4',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'A4',
      index: 8
    }
  },
  {
    ...fieldBase,
    elementColumnName: 'Postal',
    columnName: 'Postal',
    overwriteDefinition: {
      isCustomField: true,
      size: 24,
      sequenceFields: 'P',
      index: 9
    }
  }
]

export default fieldList
