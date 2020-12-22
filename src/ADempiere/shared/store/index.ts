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
import { name, version } from '@/../package.json'
//
import { IRootState } from '@/store'

Vue.use(Vuex)

const store: StoreOptions<IRootState> = {
  // state: {
  //   app: {
  //     device: AppModule.device,
  //     language: AppModule.language,
  //     sidebar: AppModule.sidebar,
  //     size: AppModule.size
  //   },
  //   errorLog: {
  //     logs: ErrorLogModule.logs
  //   },
  //   permission: {
  //     dynamicRoutes: PermissionModule.dynamicRoutes,
  //     routes: PermissionModule.routes
  //   },
  //   settings: {
  //     fixedHeader: SettingsModule.fixedHeader,
  //     showSettings: SettingsModule.showSettings,
  //     showSidebarLogo: SettingsModule.showSidebarLogo,
  //     showTagsView: SettingsModule.showTagsView,
  //     sidebarTextTheme: SettingsModule.sidebarTextTheme,
  //     theme: SettingsModule.theme
  //   },
  //   tagsView: {
  //     cachedViews: TagsViewModule.cachedViews,
  //     visitedViews: TagsViewModule.visitedViews
  //   },
  //   user: {
  //     avatar: UserModule.avatar,
  //     email: UserModule.email,
  //     introduction: UserModule.introduction,
  //     name: UserModule.name,
  //     roles: UserModule.roles,
  //     token: UserModule.token
  //   }
  // },
  modules: {
    // Core
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
    // AppModule,
    // ErrorLogModule,
    // PermissionModule,
    // SettingsModule,
    // TagsViewModule,
    // UserModule,

  },
  plugins: [vuexLocal.plugin]
}

export default new Vuex.Store<IRootState>(store)
