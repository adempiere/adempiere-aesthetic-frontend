import { IRootState } from '@/store'
import { GetterTree } from 'vuex'
import { IOrganizationData } from '../../core'
import { IUserState } from '../UserType'
import { IRoleData } from '@/ADempiere/modules/user'

type UserGetterTree = GetterTree<IUserState, IRootState>

export const getters: UserGetterTree = {
  // Getters
  getRoles(state: IUserState): IRoleData[] {
    return state.rolesList
  },
  getOrganizations(state: IUserState): IOrganizationData[] {
    return state.organizationsList
  },
  getWarehouses(state: IUserState): any[] {
    return state.warehousesList
  },
  // current role info
  getRole(state: IUserState) {
    return state.role
  },
  getOrganization(state: IUserState): Partial<IOrganizationData> {
    return state.organization
  },
  getWarehouse(state: IUserState): any {
    return state.warehouse
  },
  getIsSession(state: IUserState): boolean {
    return state.isSession
  },
  getUserUuid(state: IUserState): string {
    return state.userUuid
  },
  getIsPersonalLock(state: IUserState): boolean | undefined {
    return state.role.isPersonalLock
  },
  getToken(state: IUserState): string {
    return state.token
  },
  getRoleNames(state: IUserState) {
    return state.roles
  },
  getCurrentOrg(state: IUserState): number {
    return state.currentOrganization
  }
}
