import { MutationTree } from 'vuex'
import { WindowState } from '@/ADempiere/modules/persistence'
import { IDataLog, IReferenceListDataExtended, IWindowOldRoute } from '../../PersistenceType'

type WindowMutationTree = MutationTree<WindowState>

export const mutations: WindowMutationTree = {
  setCurrentRecord(state: WindowState, payload) {
    state.currentRecord = payload
  },
  addInCreate(state: WindowState, payload) {
    state.inCreate.push(payload)
  },
  deleteInCreate(state: WindowState, payload) {
    state.inCreate = state.inCreate.filter(item => item.containerUuid !== payload.containerUuid)
  },
  addReferencesList(state: WindowState, payload: IReferenceListDataExtended) {
    state.references.push(payload)
  },
  setDataLog(state: WindowState, payload: IDataLog) {
    state.dataLog = payload
  },
  setWindowOldRoute(state: WindowState, payload: IWindowOldRoute) {
    state.windowOldRoute = payload
  },
  setTabSequenceRecord(state: WindowState, payload) {
    state.tabSequenceRecord = payload
  },
  setTotalResponse(state: WindowState, payload) {
    state.totalResponse = payload
  },
  setTotalRequest(state: WindowState, payload) {
    state.totalRequest = payload
  },
  resetStateWindowControl(state: WindowState) {
    state = {
      inCreate: [],
      references: [],
      currentRecord: {},
      windowOldRoute: {
        path: '',
        fullPath: '',
        query: {}
      },
      dataLog: {
        containerUuid: '',
        recordId: 0,
        recordUuid: '',
        tableName: ''
      }, // { containerUuid, recordId, tableName, eventType }
      tabSequenceRecord: [],
      totalResponse: 0,
      totalRequest: 0
    }
  }
}
