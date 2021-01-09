import { WindowState } from '@/ADempiere/modules/persistence'

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
