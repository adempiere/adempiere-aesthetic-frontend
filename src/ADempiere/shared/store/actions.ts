import { IRootState } from '@/store'
import VueRouter from 'vue-router'
import { ActionTree, ActionContext } from 'vuex'

export const actions: ActionTree<IRootState, IRootState> = {
  setRouter(context: ActionContext<IRootState, IRootState>, router: VueRouter) {
    context.commit('SET_ROUTER', router)
  }
}
