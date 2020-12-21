import VuexPersistence from 'vuex-persist'
export default new VuexPersistence({
  storage: window.localStorage,
  modules: [
    'systemModule',
    'businessPartnerModule',
    'dashboardModule',
    'fieldModule',
    'formDefinitionModule',
    'processDefinitionModule',
    'preferenceModule',
    'windowDefinitionModule',
    'languageModule',
    'persistenceModule',
    'windowModule',
    'eventModule',
    'utilsModule',
    'lookupModule',
    'callOutControlModule',
    'chatEntriesModule',
    'containerInfoModule',
    'reportModule',
    'fieldValueModule',
    'processModule'
  ]
})
