import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import vuexLocal from '@/ADempiere/shared/plugins/vuex-persist'
import { RootState } from '@/ADempiere/shared/store/types'
import { coreModule } from '@/ADempiere/modules/core'
import { name, version } from '@/../package.json'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    appName: name,
    appVersion: version
  },
  modules: {
    coreModule
  },
  plugins: [vuexLocal.plugin]
}

export default new Vuex.Store<RootState>(store)
