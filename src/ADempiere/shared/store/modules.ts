import { IRootState } from '@/store'
import { ModuleTree } from 'vuex'
import { app } from '@/ADempiere/modules/app'
import { errorLog } from '@/ADempiere/modules/errorLog'
import { tagsView } from '@/ADempiere/modules/tagsView'
import { user } from '@/ADempiere/modules/user'
import { permission } from '@/ADempiere/modules/permission'
import { settings } from '@/ADempiere/modules/settings'
import { systemModule, businessPartnerModule } from '@/ADempiere/modules/core'
import {
  languageModule,
  persistenceModule,
  browserModule
} from '@/ADempiere/modules/persistence'

import {
  pointOfSalesModule,
  paymentsModule,
  keyLayoutModule,
  orderModule,
  orderLinesModule,
  productPriceModule
} from '@/ADempiere/modules/pos'
import {
  fieldModule,
  formDefinitionModule,
  processDefinitionModule,
  windowDefinitionModule,
  browserDefinitionModule
} from '@/ADempiere/modules/dictionary'
import { businessDataModule } from '@/ADempiere/modules/persistence/store/Data'
import { panelModule } from '@/ADempiere/shared/store/modules/panel'
import { contextMenuModule } from '@/ADempiere/modules/window/store/ContextMenu'
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
import { accessRecordModule } from '@/ADempiere/modules/privateAccess/store/AccessRecord'

export const modules: ModuleTree<IRootState> = {
  app,
  errorLog,
  tagsView,
  user,
  permission,
  settings,
  // Adempiere
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
  paymentsModule,
  keyLayoutModule,
  orderModule,
  orderLinesModule,
  productPriceModule,
  contextMenuModule,
  panelModule,
  businessDataModule,
  browserDefinitionModule,
  browserModule,
  accessRecordModule
}
