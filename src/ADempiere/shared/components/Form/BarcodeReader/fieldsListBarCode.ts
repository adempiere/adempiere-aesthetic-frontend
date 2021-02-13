const fieldsList: any[] = [
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
      handleActionKeyPerformed: true
    }
  },
  // bar code reader
  {
    columnName: 'UPC',
    tableName: 'M_Product',
    isFromDictionary: true,
    overwriteDefinition: {
      cssClassName: '',
      size: 24,
      sequence: 10,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  },
  {
    columnName: 'Value',
    tableName: 'M_Product',
    isFromDictionary: true,
    overwriteDefinition: {
      cssClassName: '',
      size: 24,
      sequence: 10,
      handleActionPerformed: true,
      handleContentSelection: true,
      handleActionKeyPerformed: true
    }
  }
]

export default fieldsList
