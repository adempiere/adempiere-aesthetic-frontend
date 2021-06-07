import { IFieldLocation } from '../../../Field/FieldLocation/fieldList'

const tableName = 'C_Payment'

const fieldListCollection: IFieldLocation[] = [
  // Amont
  {
    tableName,
    elementColumnName: 'PayAmt',
    columnName: 'PayAmt',
    isFromDictionary: true,
    overwriteDefinition: {
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isNumericField: true,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Currency
  {
    tableName: 'C_Order',
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
  },
  // TenderType
  {
    tableName,
    columnName: 'TenderType',
    elementColumnName: 'TenderType',
    isFromDictionary: true,
    overwriteDefinition: {
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Bank
  {
    tableName,
    columnName: 'C_Bank_ID',
    isFromDictionary: true,
    overwriteDefinition: {
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      handleContentSelection: true,
      displayLogic: '@TenderType@==\'D\'',
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // Date
  {
    tableName,
    elementColumnName: 'DateTrx',
    isFromDictionary: true,
    overwriteDefinition: {
      handleFocusGained: true,
      handleFocusLost: true,
      handleKeyPressed: true,
      handleKeyReleased: true,
      handleActionKeyPerformed: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: '@TenderType@==\'K\'',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // ReferenceNo
  {
    tableName: 'HR_Attribute',
    elementColumnName: 'ReferenceNo',
    columnName: 'ReferenceNo',
    isFromDictionary: true,
    overwriteDefinition: {
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      displayLogic: '@TenderType@<>\'X\'&@TenderType@<>\'C\' ',
      size: 24,
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // type credit card
  {
    tableName,
    elementColumnName: 'CreditCardType',
    columnName: 'CreditCardType',
    isFromDictionary: true,
    overwriteDefinition: {
      defaultValue: 'M',
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: '@TenderType@==\'C\'',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // number credit card
  {
    tableName,
    elementColumnName: 'CreditCardNumber',
    columnName: 'CreditCardNumber',
    isFromDictionary: true,
    overwriteDefinition: {
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: '@TenderType@==\'C\'',
      isActiveLogics: true,
      isMandatory: true
    }
  },
  // accountno
  {
    tableName,
    elementColumnName: 'AccountNo',
    columnName: 'AccountNo',
    isFromDictionary: true,
    overwriteDefinition: {
      handleActionKeyPerformed: true,
      handleContentSelection: true,
      handleActionPerformed: true,
      size: 24,
      displayLogic: '@TenderType@==\'M\'',
      isActiveLogics: true,
      isMandatory: true
    }
  }
]

export default fieldListCollection
