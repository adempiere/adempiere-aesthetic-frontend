import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import vuexLocal from '@/ADempiere/shared/plugins/vuex-persist'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
//
import { IRootState } from '@/store'
import { modules } from './modules'

Vue.use(Vuex)

const store: StoreOptions<IRootState> = {
  modules: modules,
  getters: getters,
  mutations: mutations,
  actions: actions,
  plugins: [vuexLocal.plugin]
}

export default new Vuex.Store<IRootState>(store)
