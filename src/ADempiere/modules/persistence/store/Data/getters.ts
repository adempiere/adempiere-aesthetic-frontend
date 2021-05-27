import { IPanelDataExtended } from '@/ADempiere/modules/dictionary/DictionaryType/VuexType'
import { IFieldDataExtendedUtils } from '@/ADempiere/shared/utils/DictionaryUtils/type'
import { IKeyValueObject, Namespaces } from '@/ADempiere/shared/utils/types'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { BusinessDataState, IContextInfoValuesExtends, IPrivateAccessDataExtended, IRecordSelectionData, ISelectionToServerData, KeyValueData } from '../../PersistenceType'

type BusinessDataGetterTree = GetterTree<BusinessDataState, IRootState>

export const getters: BusinessDataGetterTree = {
  /**
     * Used by datatables in tab children, record navigation in window, result in browser
     * @param {string} containerUuid
     */
  getDataRecordAndSelection: (state: BusinessDataState, getters) => (
    containerUuid: string
  ): IRecordSelectionData => {
    return (
      state.recordSelection.find((itemRecord: IRecordSelectionData) => {
        return itemRecord.containerUuid === containerUuid
      }) || {
        containerUuid,
        record: [],
        recordCount: 0,
        selection: [],
        pageNumber: 1,
        nextPageToken: undefined,
        originalNextPageToken: undefined,
        isLoadedContext: false,
        isLoaded: false
      }
    )
  },
  getDataRecordsList: (state: BusinessDataState, getters) => (
    containerUuid: string
  ): any[] => {
    return getters.getDataRecordAndSelection(containerUuid).record
  },
  getDataRecordSelection: (state: BusinessDataState, getters) => (
    containerUuid: string
  ) => {
    return getters.getDataRecordAndSelection(containerUuid).selection
  },
  getPageNumber: (state: BusinessDataState, getters) => (
    containerUuid: string
  ) => {
    return getters.getDataRecordAndSelection(containerUuid).pageNumber
  },
  getContextInfoField: (state: BusinessDataState) => (contextInfoUuid: string, sqlStatement: string): IContextInfoValuesExtends | undefined => {
    return state.contextInfoField.find((info: IContextInfoValuesExtends) => {
      if ((info.contextInfoUuid === contextInfoUuid) && (info.sqlStatement === sqlStatement)) {
        return info
      }
    }
    )
  },
  getRecordPrivateAccess: (state: BusinessDataState) => (tableName: string, recordId: number): Partial<IPrivateAccessDataExtended> | undefined => {
    if (tableName && recordId) {
      if (
        state.recordPrivateAccess.tableName === tableName &&
                state.recordPrivateAccess.recordId === recordId
      ) {
        return state.recordPrivateAccess
      }
      return undefined
    }
  },
  /**
     * Getter converter selection data record in format
     * @param {string} containerUuid
     * @param {array}  selection
     * [{
     *    selectionId: keyColumn Value,
     *    selectionValues: [{ columnName, value }]
     * }]
     */
  getSelectionToServer: (state: BusinessDataState, getters, rootState, rootGetters) => (parameters: {
      containerUuid: string
      selection?: IKeyValueObject[]
  }): ISelectionToServerData[] => {
    let { selection = parameters.selection || [] } = parameters
    const { containerUuid } = parameters
    const selectionToServer: ISelectionToServerData[] = []

    const withOut: string[] = ['isEdit', 'isSendToServer']

    if (!selection || selection.length <= 0) {
      selection = getters.getDataRecordSelection(containerUuid)
    }

    if (!selection || selection.length <= 0) {
      return selectionToServer
    }

    const { fieldsList, keyColumn } = <IPanelDataExtended>(
        rootGetters[Namespaces.Panel + '/' + 'getPanel'](containerUuid)
        )
    // reduce list
    const fieldsListSelection: string[] = fieldsList.filter(
      (itemField: IFieldDataExtendedUtils) => {
        return itemField.isIdentifier || itemField.isUpdateable
      })
      .map(itemField => {
        return itemField.columnName
      })

    selection.forEach((itemRow: IKeyValueObject) => {
      const records: KeyValueData[] = []

      Object.keys(itemRow).forEach((key: string) => {
        if (
          !key.includes('DisplayColumn') && !withOut.includes(key)
        ) {
          if (fieldsListSelection.includes(key)) {
            // evaluate metadata attributes before to convert
            records.push({
              // columnName: key,
              key,
              value: itemRow[key]
            })
          }
        }
      })

      selectionToServer.push({
        selectionId: itemRow[keyColumn!],
        selectionValues: records
      })
    })

    return selectionToServer
  },
  getRowData: (state: BusinessDataState, getters) => (data: {
    containerUuid: string
    recordUuid?: string
    index: number
}) => {
    const { recordUuid, containerUuid, index } = data
    const recordsList: any[] = getters.getDataRecordsList(
      containerUuid
    )
    if (index) {
      return recordsList[index]
    }
    return recordsList.find((itemData: any) => {
      if (itemData.UUID === recordUuid) {
        return true
      }
    })
  }
}
