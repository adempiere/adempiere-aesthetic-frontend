import { EntityEventType } from '@/ADempiere/modules/window'
import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IDataLog, IReferenceDataExtended, IReferenceListDataExtended, WindowState } from '@/ADempiere/modules/persistence'
import { isEmptyValue } from '@/ADempiere/shared/utils/valueUtils'

type WindowGetterTree = GetterTree<WindowState, IRootState>

export const getters: WindowGetterTree = {
  getCurrentRecord: (state: WindowState) => {
    return state.currentRecord
  },
  getInCreate: (state: WindowState) => (containerUuid: string) => {
    return state.inCreate.find(item => item.containerUuid === containerUuid)
  },
  getReferencesList: (state: WindowState) => (windowUuid: string, recordUuid: string): IReferenceListDataExtended | undefined => {
    return state.references.find(item => item.windowUuid === windowUuid && item.recordUuid === recordUuid)
  },
  sgetReferencesInfo: (state: WindowState, getters) => (windowUuid: string, recordUuid: string, referenceUuid: string): IReferenceDataExtended | undefined => {
    const references: IReferenceListDataExtended = <IReferenceListDataExtended>getters.getReferencesList(windowUuid, recordUuid)
    if (isEmptyValue(references)) {
      return undefined
    }
    return references.referencesList.find(item => item.recordUuid === referenceUuid)
  },
  getTabSequenceRecord: (state: WindowState) => {
    return state.tabSequenceRecord
  },
  getDataLog: (state: WindowState) => (containerUuid: string, recordUuid: string): IDataLog | undefined => {
    const current = state.dataLog
    if (current.containerUuid === containerUuid &&
          ((current.recordUuid === recordUuid) ||
          (current.eventType === EntityEventType.DELETE && recordUuid === 'create-new'))) {
      return current
    }
    return undefined
  }
}
