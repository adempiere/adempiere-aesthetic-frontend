import { DashboardState, IRecentItemData, IDashboardDataExtended } from '@/ADempiere/modules/dashboard'
import { MutationTree } from 'vuex'

type DashboardMutationTree = MutationTree<DashboardState>

export const mutations: DashboardMutationTree = {
  addDashboard(state: DashboardState, payload: IDashboardDataExtended) {
    state.dashboard.push(payload)
  },
  // notifyDashboardRefresh: (state, payload) => {
  //     throw Error('Not implemented')
  // },
  setRecentItems(state: DashboardState, payload: IRecentItemData[]) {
    state.recenItems = payload
  }
}
