import Vue from 'vue'
import Vuex, { Module } from 'vuex'
import VueRouter, { Route } from 'vue-router'
import { IAppState } from '@/ADempiere/modules/app/AppType'
import { IUserState } from '@/ADempiere/modules/user'
import { ITagsViewState } from '@/ADempiere/modules/tagsView/TagsViewType'
import { IErrorLogState } from '@/ADempiere/modules/errorLog/ErrorLogType'
import { IPermissionState } from '@/ADempiere/modules/permission/PermissionType'
import { ISettingsState } from '@/ADempiere/modules/settings/SettingsType'
import { KeyLayoutState, ListProductPriceState, OrderLinesState, OrderState, PaymentsState } from '@/ADempiere/modules/pos'
import { Namespaces } from '@/ADempiere/shared/utils/types'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  tagsView: ITagsViewState
  errorLog: IErrorLogState
  permission: IPermissionState
  settings: ISettingsState
  route: Route
  [Namespaces.Order]: OrderState
  [Namespaces.OrderLines]: OrderLinesState
  [Namespaces.Payments]: PaymentsState
  [Namespaces.ProductPrice]: ListProductPriceState
  [Namespaces.KeyLayout]: KeyLayoutState
}

// Declare empty store first, dynamically register all modules later.
// export default new Vuex.Store<IRootState>({})
