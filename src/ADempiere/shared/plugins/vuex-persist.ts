import VuexPersistence from 'vuex-persist'
import { Namespaces } from '@/ADempiere/shared/utils/types'
export default new VuexPersistence({
  storage: window.localStorage,
  modules: [
    Namespaces.System,
    Namespaces.BusinessPartner,
    Namespaces.Dashboard,
    Namespaces.Field,
    Namespaces.FormDefinition,
    Namespaces.ProcessDefinition,
    Namespaces.Preference,
    Namespaces.WindowDefinition,
    Namespaces.Language,
    Namespaces.Persistence,
    Namespaces.Window,
    Namespaces.Event,
    Namespaces.Utils,
    Namespaces.Lookup,
    Namespaces.CallOutControl,
    Namespaces.ChatEntries,
    Namespaces.ContainerInfo,
    Namespaces.Report,
    Namespaces.FieldValue,
    Namespaces.Process,
    Namespaces.PointOfSales,
    Namespaces.Collection,
    Namespaces.KeyLayout,
    Namespaces.Order,
    Namespaces.OrderLines,
    Namespaces.ListProductPrice,
    Namespaces.ContextMenu,
    Namespaces.Panel,
    Namespaces.BusinessData,
    Namespaces.BrowserDefinition
  ]
})
