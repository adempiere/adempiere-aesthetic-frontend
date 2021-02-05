import { IRootState } from '@/store'
import VueRouter from 'vue-router'
import { MutationTree } from 'vuex'

export const mutations: MutationTree<IRootState> = {
  SET_ROUTER(state: IRootState, router: VueRouter) {
    console.log(router)
    state.router = router
  }
}
