import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import router, { constantRoutes, resetRouter } from '@/router'
// import store from '@/store'
import store from '@/ADempiere/shared/store'
import { UserModule } from './user'
import { IRoleData } from '@/ADempiere/modules/user'
import { loadMainMenu } from '@/router/ADempiere/menu'
import { getToken } from '@/utils/cookies'
import NProgress from 'nprogress'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
  timeOutMenu: NodeJS.Timeout | number | undefined
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []
  public timeOutMenu: any = null

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Mutation
  private setTimeOutMenu(payload: NodeJS.Timeout | number) {
    this.timeOutMenu = payload
  }

  @Mutation
  private clearTimeOutMenu() {
    clearTimeout(this.timeOutMenu)
  }

  @Action
  public GenerateRoutes(organizationId?: number) {
    organizationId = organizationId || 0
    return new Promise<RouteConfig[]>((resolve) => {
      const organization = UserModule.organization
      let organizationUuid = ''

      if (organization) {
        organizationId = organization.id
        organizationUuid = organization.uuid!
      }

      const role: Partial<IRoleData> = UserModule.role // store.getters['user/getRole'] // UserModule.getRole
      let roleUuid = ''
      let clientId = 0
      if (role) {
        roleUuid = role.uuid!
        clientId = role.clientId!
      }

      const sessionUuid: string = getToken()!

      loadMainMenu({
        sessionUuid,
        // clientId,
        roleUuid,
        // organizationId,
        organizationUuid
      }).then((menuResponse: RouteConfig[]) => {
        this.SET_ROUTES(menuResponse)
        resolve(menuResponse)
      })
    })
  }

  @Action
  public sendRequestMenu(organizationId?:number): void {
    this.clearTimeOutMenu()
    const timeOutMenu = setTimeout(async() => {
      NProgress
        .configure({
          // NProgress Configuration
          showSpinner: false
        })
        .start()

      resetRouter()
      this.GenerateRoutes(organizationId)
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
    this.setTimeOutMenu(timeOutMenu)
  }
}

export const PermissionModule = getModule(Permission)
