import Vue from 'vue'
import {
  fieldModule,
  formDefinitionModule,
  processDefinitionModule,
  windowDefinitionModule
} from '@/ADempiere/modules/dictionary'
import Vuex, { StoreOptions } from 'vuex'
import vuexLocal from '@/ADempiere/shared/plugins/vuex-persist'
import { systemModule, businessPartnerModule } from '@/ADempiere/modules/core'
import {
  languageModule,
  persistenceModule
} from '@/ADempiere/modules/persistence'

import {
  pointOfSalesModule,
  collectionModule,
  keyLayoutModule,
  orderModule,
  orderLinesModule,
  listProductPriceModule
} from '@/ADempiere/modules/pos'

import { processModule } from '@/ADempiere/modules/process/store/Process'
import { fieldValueModule } from '@/ADempiere/shared/store/modules/FieldValue'
import { reportModule } from '@/ADempiere/modules/report/store/Report'
import { containerInfoModule } from '@/ADempiere/modules/window/store/ContainerInfo'
import { chatEntriesModule } from '@/ADempiere/modules/window/store/ChatEntries'
import { callOutControlModule } from '@/ADempiere/modules/ui/store/CallOutControl'
import { lookupModule } from '@/ADempiere/modules/ui/store/Lookup'
import { utilsModule } from '@/ADempiere/shared/store/modules/Utils'
import { eventModule } from '@/ADempiere/shared/store/modules/Event'
import { windowModule } from '@/ADempiere/modules/persistence/store/Window'
import { preferenceModule } from '@/ADempiere/shared/store/modules/preference'
import { dashboardModule } from '@/ADempiere/modules/dashboard'
import { getters } from './getters'
//
import { IRootState } from '@/store'

Vue.use(Vuex)

const store: StoreOptions<IRootState> = {
  modules: {
    systemModule,
    businessPartnerModule,
    dashboardModule,
    fieldModule,
    formDefinitionModule,
    processDefinitionModule,
    preferenceModule,
    windowDefinitionModule,
    languageModule,
    persistenceModule,
    windowModule,
    eventModule,
    utilsModule,
    lookupModule,
    callOutControlModule,
    chatEntriesModule,
    containerInfoModule,
    reportModule,
    fieldValueModule,
    processModule,
    pointOfSalesModule,
    collectionModule,
    keyLayoutModule,
    orderModule,
    orderLinesModule,
    listProductPriceModule
  },
  getters: getters,
  plugins: [vuexLocal.plugin]
}

export default new Vuex.Store<IRootState>(store)
