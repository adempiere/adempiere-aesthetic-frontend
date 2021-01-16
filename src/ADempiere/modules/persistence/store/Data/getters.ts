import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { BusinessDataState, IContextInfoValuesExtends, IPrivateAccessDataExtended, IRecordSelectionData } from '../../PersistenceType'

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
    return state.contextInfoField.find(
      info =>
        info.contextInfoUuid === contextInfoUuid &&
                info.sqlStatement === sqlStatement
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
  }
}
