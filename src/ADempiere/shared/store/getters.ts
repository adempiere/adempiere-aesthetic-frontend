import { IRootState } from '@/store'
import { GetterTree } from 'vuex'

export const getters: GetterTree<IRootState, IRootState> = {
  sidebar: (state: IRootState) => state.app.sidebar,
  language: (state: IRootState) => state.app.language,
  size: (state: IRootState) => state.app.size,
  toggleSideBar: (state: IRootState) => state.app.sidebar.opened,
  device: (state: IRootState) => state.app.device,
  visitedViews: (state: IRootState) => state.tagsView.visitedViews,
  cachedViews: (state: IRootState) => state.tagsView.cachedViews,
  token: (state: IRootState) => state.user.token,
  avatar: (state: IRootState) => state.user.avatar,
  name: (state: IRootState) => state.user.name,
  router: (state: IRootState) => state.permission.dynamicRoutes,
  introduction: (state: IRootState) => state.user.introduction,
  // TODO: Migrate the following getters in the corresponding files
  currentRole: (state: IRootState) => state.user.role,
  getRoleUuid: (state: IRootState) => state.user.role.uuid,
  roles: (state: IRootState) => state.user.roles,
  permission_routes: (state: IRootState) => state.permission.routes,
  errorLogs: (state: IRootState) => state.errorLog.logs
}
