import { constantRoutes } from '@/router'
import { RouteConfig } from 'vue-router'
import { MutationTree } from 'vuex'
import { IPermissionState } from '../PermissionType'

type PermissionMutationTree = MutationTree<IPermissionState>

export const mutations: PermissionMutationTree = {
  SET_ROUTES(state: IPermissionState, routes: RouteConfig[]) {
    state.routes = constantRoutes.concat(routes)
    state.dynamicRoutes = routes
  },
  setTimeOutMenu(state: IPermissionState, payload: number) {
    state.timeOutMenu = payload
  },
  clearTimeOutMenu(state: IPermissionState) {
    clearTimeout(state.timeOutMenu)
  }
}
