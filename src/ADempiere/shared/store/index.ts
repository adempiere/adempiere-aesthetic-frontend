import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import vuexLocal from '@/ADempiere/shared/plugins/vuex-persist'
import { getters } from './getters'
//
import { IRootState } from '@/store'
import { modules } from './modules'

Vue.use(Vuex)

const store: StoreOptions<IRootState> = {
  modules: modules,
  getters: getters,
  plugins: [vuexLocal.plugin]
}

export default new Vuex.Store<IRootState>(store)
