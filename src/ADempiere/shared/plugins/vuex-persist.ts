import VuexPersistence from 'vuex-persist'
export default new VuexPersistence({
  storage: window.localStorage,
  modules: [
    'systemModule',
    'businessPartnerModule'
  ]
})
