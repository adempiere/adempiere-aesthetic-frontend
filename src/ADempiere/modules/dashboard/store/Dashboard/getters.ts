import { GetterTree } from 'vuex'
import { DashboardState } from '@/ADempiere/modules/dashboard'
import { RootState } from '@/ADempiere/shared/store/types'

type DashboardGetter = GetterTree<DashboardState, RootState>

export const getters: DashboardGetter = {
  getDashboard: (state: DashboardState) => (dashboardUuid: string) => {
    return state.dashboard.find(item => item.windowUuid === dashboardUuid)
  },
  getDashboardByRole: (state: DashboardState) => (roleUuid: string) => {
    return state.dashboard.find(item => item.roleUuid === roleUuid)
  }
}
