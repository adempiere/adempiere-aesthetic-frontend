import { IRootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { requestCreateChatEntry, requestListChatsEntries, requestListEntityChats } from '../../WindowService'
import { ChatEntriesState, IEntityChatData, IListEntityChatsResponse } from '../../WindowType'

type ChatEntriesActionContext = ActionContext<ChatEntriesState, IRootState>
type ChatEntriesActionTree = ActionTree<ChatEntriesState, IRootState>

export const actions: ChatEntriesActionTree = {
  setChatText(context: ChatEntriesActionContext, text: string) {
    if (text) {
      context.commit('setChatText', text)
    }
  },
  createChatEntry(context: ChatEntriesActionContext, payload: {
        tableName: string
        recordId: number
        comment: string
      }) {
    const { tableName, recordId, comment } = payload

    return requestCreateChatEntry({
      tableName,
      recordId,
      comment
    })
      .then(() => {
        context.commit('isNote', true)
        context.commit('setChatText', '')

        context.dispatch('listChatEntries', {
          tableName,
          recordId
        })
      })
      .catch(error => {
        console.warn(`Error getting epale error en guardar: ${error.message}. Code: ${error.code}.`)
      })
  },
  listChatEntries(context: ChatEntriesActionContext, payload: {
        tableName: string
        recordId: number
        recordUuid?: string
        pageSize?: number
        pageToken?: string
      }) {
    const { tableName, recordUuid, recordId, pageSize, pageToken } = payload
    return requestListEntityChats({
      tableName,
      recordId,
      recordUuid,
      pageSize,
      pageToken
    })
      .then((responseList: IListEntityChatsResponse) => {
        const { list: chatList } = responseList

        chatList.forEach((chat: IEntityChatData) => {
          const uuid: string = chat.chatUuid

          requestListChatsEntries({
            uuid,
            pageSize
          })
            .then(responseChat => {
              context.commit('addListChatEntries', responseChat.chatEntriesList)
            })
            .catch(error => {
              console.warn(`Error getting List Chat Entries: ${error.message}. Code: ${error.code}.`)
            })
        })
        const isNote = !!chatList
        context.commit('isNote', isNote)
        context.commit('addListRecordChats', responseList)
      })
      .catch(error => {
        console.warn(`Error getting List Chat: ${error.message}. Code: ${error.code}.`)
      })
  }
}
