import { GetterTree } from 'vuex'
import { DashboardState } from '@/ADempiere/modules/dashboard'
import { IRootState } from '@/store'

type DashboardGetter = GetterTree<DashboardState, IRootState>

export const getters: DashboardGetter = {
  getDashboard: (state: DashboardState) => (dashboardUuid: string) => {
    return state.dashboard.find(item => item.windowUuid === dashboardUuid)
  },
  getDashboardByRole: (state: DashboardState) => (roleUuid: string) => {
    return state.dashboard.find(item => item.roleUuid === roleUuid)
  }
}
