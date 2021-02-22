import { loadMainMenu } from '@/ADempiere/shared/router/menu'
import router, { resetRouter } from '@/router'
import { IRootState } from '@/store'
import { getToken } from '@/utils/cookies'
import { RouteConfig } from 'vue-router'
import { ActionTree, ActionContext } from 'vuex'
import { IPermissionState } from '../PermissionType'
import NProgress from 'nprogress'
import { IRoleData } from '@/ADempiere/modules/user'

type PermissionActionTree = ActionTree<IPermissionState, IRootState>
type PermissionActionContext = ActionContext<IPermissionState, IRootState>

export const actions: PermissionActionTree = {
  GenerateRoutes(context: PermissionActionContext) {
    return new Promise<RouteConfig[]>((resolve) => {
      const organization = context.rootState.user.organization // UserModule.organization
      let organizationUuid = ''

      if (organization) {
        organizationUuid = organization.uuid!
      }

      const role: Partial<IRoleData> = context.rootState.user.role //   UserModule.role
      let roleUuid = ''
      if (role) {
        roleUuid = role.uuid!
      }

      const sessionUuid: string = getToken()!

      loadMainMenu({
        sessionUuid,
        roleUuid,
        organizationUuid,
        role: <IRoleData>role
      }).then((menuResponse: RouteConfig[]) => {
        context.commit('SET_ROUTES', menuResponse)
        resolve(menuResponse)
      })
    })
  },
  sendRequestMenu(context: PermissionActionContext): void {
    context.commit('clearTimeOutMenu')
    const timeOutMenu = setTimeout(async() => {
      NProgress
        .configure({
          // NProgress Configuration
          showSpinner: false
        })
        .start()

      resetRouter()
      context.dispatch('GenerateRoutes')
        .then((accessRoutes: RouteConfig[]) => {
          router.addRoutes(accessRoutes)
        })
        .finally(() => {
          NProgress.done()
        })

        .finally(() => {
          // finish progress bar
          NProgress.done()
        })
    }, 2500)
    context.commit('setTimeOutMenu', timeOutMenu)
  }
}
