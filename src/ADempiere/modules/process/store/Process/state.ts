import { ProcessState } from '@/ADempiere/modules/process/ProcessType'

export const state: ProcessState = {
  inExecution: [], // process not response from server
  isVisibleDialog: false,
  reportObject: {},
  reportList: [],
  metadata: {},
  process: [], // process to run finish
  sessionProcess: [],
  notificationProcess: [],
  inRequestMetadata: [],
  reportViewList: [],
  totalResponse: 0,
  totalRequest: 0,
  totalSelection: 0,
  errorSelection: 0,
  successSelection: 0
}
