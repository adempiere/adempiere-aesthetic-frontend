import { IRootState } from '@/store'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import { ActionContext, ActionTree } from 'vuex'
import { getKeyLayout } from '../../POSService'
import { IKeyLayoutData, KeyLayoutState } from '../../POSType'

type KeyLayoutActionContext = ActionContext<KeyLayoutState, IRootState>
type KeyLayoutActionTree = ActionTree<KeyLayoutState, IRootState>

export const actions: KeyLayoutActionTree = {
  getKeyLayoutFromServer(context: KeyLayoutActionContext, keyLayoutUuid: string) {
    if (!keyLayoutUuid) {
      keyLayoutUuid = context.getters.getKeyLayoutUuidWithPOS
    }

    if (!keyLayoutUuid) {
      console.info('not load key layout')
      return
    }
    getKeyLayout({
      keyLayoutUuid
    })
      .then((responseKeyLayout: IKeyLayoutData) => {
        context.commit('setKeyLayout', {
          ...responseKeyLayout,
          isLoaded: true,
          isReload: false
          // token,
          // pageNumber
        })
      })
      .catch(error => {
        console.warn(`getKeyLayoutFromServer: ${error.message}. Code: ${error.code}.`)
        showMessage({
          type: 'error',
          message: error.message,
          showClose: true
        })
      })
  }
}
