import { IKeyValueObject } from '@/ADempiere/shared/utils/types'
import { MutationTree } from 'vuex'
import {
  BusinessDataState,
  IPrivateAccessDataExtended,
  IRecordSelectionData
} from '../../PersistenceType'

type BusinessDataMutationTree = MutationTree<BusinessDataState>

export const mutations: BusinessDataMutationTree = {
  addRecordSelection(
    state: BusinessDataState,
    payload: IRecordSelectionData
  ) {
    state.recordSelection.push(payload)
  },
  setRecordSelection(
    state: BusinessDataState,
    payload: {
            newDataStore: IRecordSelectionData
            dataStore: IRecordSelectionData
        }
  ) {
    payload.dataStore = payload.newDataStore
    // payload.dataStore.record = payload.newDataStore.record
    // payload.dataStore.selection = payload.newDataStore.selection
    // payload.dataStore.pageNumber = payload.newDataStore.pageNumber
    // payload.dataStore.recordCount = payload.newDataStore.recordCount
    // payload.dataStore.nextPageToken = payload.newDataStore.nextPageToken
    // payload.dataStore.isLoadedContext = payload.newDataStore.isLoadedContext
    // payload.dataStore.isLoaded = payload.newDataStore.isLoaded
  },
  setSelection(
    state: BusinessDataState,
    payload: {
            newSelection: any[]
            data: IRecordSelectionData
        }
  ) {
    payload.data.selection = payload.newSelection
  },
  deleteRecordContainer(
    state: BusinessDataState,
    payload: IRecordSelectionData[]
  ) {
    state.recordSelection = payload
  },
  notifyCellTableChange: (
    state: BusinessDataState,
    payload: {
            row: IKeyValueObject
            value: any
            columnName: string
            displayColumn: string
        }
  ) => {
    payload.row[payload.columnName] = payload.value
    if (payload.displayColumn !== undefined) {
      const key = `DisplayColumn_${payload.columnName}`
      payload.row[key] = payload.displayColumn
    }
  },
  notifyCellSelectionChange: (state: BusinessDataState, payload: {
        row: IKeyValueObject
        columnName: string
        value: any
        displayColumn: string
    }) => {
    if (payload.row !== undefined) {
      payload.row[payload.columnName] = payload.value
      if (payload.displayColumn !== undefined) {
        const key = `DisplayColumn_${payload.columnName}`
        payload.row[key] = payload.displayColumn
      }
    }
  },
  notifyRowTableChange: (state: BusinessDataState, payload) => {
    Object.assign(payload.row, payload.newRow)
  },
  setPageNumber(
    state: BusinessDataState,
    payload: {
            data: {
                pageNumber: number
            }
            pageNumber: number
        }
  ) {
    payload.data.pageNumber = payload.pageNumber
  },
  setIsloadContext(state: BusinessDataState, payload) {
    payload.data.isLoadedContext = payload.isLoadedContext
  },
  addNewRow(
    state: BusinessDataState,
    payload: {
            values: any
            data: any
        }
  ) {
    payload.data = payload.data.unshift(payload.values)
  },
  setContextInfoField(
    state: BusinessDataState,
    payload: {
            contextInfoUuid: string
            sqlStatement: string
            messageText: string
            messageTip: string
        }
  ) {
    state.contextInfoField.push(payload)
  },
  setPrivateAccess(state: BusinessDataState, payload: IPrivateAccessDataExtended) {
    state.recordPrivateAccess = payload
  },
  resetStateBusinessData(state: BusinessDataState) {
    state = {
      recordSelection: [], // record data and selection
      contextInfoField: [],
      recordPrivateAccess: {}
    }
  }
}
