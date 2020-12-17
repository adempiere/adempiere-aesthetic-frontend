import { WindowState } from '@/ADempiere/modules/persistence'
import { EventType } from '@/ADempiere/modules/window'

export const state: WindowState = {
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
    tableName: '',
    eventType: undefined,
    recordUuid: ''
  },
  tabSequenceRecord: [],
  totalResponse: 0,
  totalRequest: 0
}
