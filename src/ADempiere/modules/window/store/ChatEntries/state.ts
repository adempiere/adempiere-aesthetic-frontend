import { ChatEntriesState } from '@/ADempiere/modules/window/WindowType'

export const state: ChatEntriesState = {
  listRecordChats: {
    list: [],
    nextPageToken: '',
    recordCount: 0
  },
  listChatEntries: [],
  chatText: '',
  isNote: false
}
