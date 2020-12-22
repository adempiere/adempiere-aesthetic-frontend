import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import {
  ChatEntriesState,
  IChatEntryData,
  IEntityChatData
} from '@/ADempiere/modules/window/WindowType'

type ChatEntriesGetterTree = GetterTree<ChatEntriesState, IRootState>

export const getters: ChatEntriesGetterTree = {
  getChatTextLong: (state: ChatEntriesState): string => {
    return state.chatText
  },
  getListRecordChats: (state: ChatEntriesState): IEntityChatData[] => {
    return state.listRecordChats.list
  },
  getChatEntries: (state: ChatEntriesState): IChatEntryData[] => {
    return state.listChatEntries
  },
  getIsNote: (state: ChatEntriesState): boolean => {
    return state.isNote
  }
}
