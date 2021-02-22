import { RouteConfig } from 'vue-router'

export interface IPermissionState {
    routes: RouteConfig[]
    dynamicRoutes: RouteConfig[]
    timeOutMenu: number | undefined // NodeJS.Timeout |
  }
