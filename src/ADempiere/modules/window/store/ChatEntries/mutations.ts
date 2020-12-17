import { MutationTree } from 'vuex'
import { ChatEntriesState, IChatEntryData, IListEntityChatsResponse } from '@/ADempiere/modules/window/WindowType'

type ChatEntriesMutationTree = MutationTree<ChatEntriesState>

export const mutations: ChatEntriesMutationTree = {
  setChatText(state: ChatEntriesState, payload: string) {
    state.chatText = payload
  },
  addListChatEntries(state: ChatEntriesState, payload: IChatEntryData[]) {
    state.listChatEntries = payload
  },
  addListRecordChats(state: ChatEntriesState, payload: IListEntityChatsResponse) {
    // state.listRecordChats = payload
    state.listRecordChats = payload
  },
  isNote(state: ChatEntriesState, payload: boolean) {
    state.isNote = payload
  }
}
