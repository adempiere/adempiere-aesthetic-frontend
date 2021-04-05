import { ContainerInfoState } from '../../WindowType'

export const state: ContainerInfoState = {
  listRecordLogs: {
    recordCount: 0,
    entityLogs: []
  },
  listWorkflows: {
    nextPageToken: '',
    list: [],
    recordCount: 0
  },
  listworkflowLog: {
    recordCount: 0,
    list: [],
    nextPageToken: ''
  }
}
