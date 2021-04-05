import { ActionContext, ActionTree } from 'vuex'
import { requestListDashboards, DashboardState } from '@/ADempiere/modules/dashboard'

import { IRootState } from '@/store'
import { getCurrentRole } from '@/ADempiere/shared/utils/auth'
import { IDashboardDataExtended, IListDashboardsResponse } from '../../DashboardType'

type DashboardActionTree = ActionTree<DashboardState, IRootState>
type DashboardActionContext = ActionContext<DashboardState, IRootState>

export const actions: DashboardActionTree = {
  // refreshDashboard(context: DashboardActionContext, parameters: any) {
  //     context.commit('notifyDashboardRefresh', parameters)
  // },
  listDashboard(
    context: DashboardActionContext,
    payload: {
            roleId: number
            roleUuid: string
        }
  ) {
    if (payload.roleUuid) {
      payload.roleUuid = context.rootGetters.getRoleUuid
      if (payload.roleUuid) {
        payload.roleUuid = getCurrentRole()!
      }
    }

    return new Promise<IDashboardDataExtended[]>(resolve => {
      requestListDashboards({
        roleId: payload.roleId,
        roleUuid: payload.roleUuid
      })
        .then((dashboardResponse: IListDashboardsResponse) => {
          // TODO: verify it with uuid

          const roleDashboards: IDashboardDataExtended[] = dashboardResponse.list.map(item => {
            return {
              ...item,
              roleUuid: payload.roleUuid
            }
          })

          context.commit('addDashboard', roleDashboards)
          resolve(roleDashboards)
        })
        .catch(error => {
          console.warn(
                        `Error getting List Dashboards: ${error.message}. Code: ${error.code}.`
          )
        })
    })
  }
}
