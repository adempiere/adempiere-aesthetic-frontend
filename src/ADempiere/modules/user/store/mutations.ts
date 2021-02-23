import { MutationTree } from 'vuex'
import { IUserState } from '../UserType'
import { IRoleData, ISessionData } from '@/ADempiere/modules/user'
import { IOrganizationData } from '../../core'

type UserMutationTree = MutationTree<IUserState>

export const mutations: UserMutationTree = {
  SET_TOKEN(state: IUserState, token: string) {
    state.token = token
  },
  SET_NAME(state: IUserState, name: string) {
    state.name = name
  },
  SET_AVATAR(state: IUserState, avatar: string) {
    state.avatar = avatar
  },
  SET_INTRODUCTION(state: IUserState, introduction: string) {
    state.introduction = introduction
  },
  SET_ROLES(state: IUserState, roles: string[]) {
    state.roles = roles
  },
  SET_EMAIL(state: IUserState, email: string) {
    state.email = email
  },

  // Adempiere Mutation
  SET_ROLES_LIST(state: IUserState, rolesList: IRoleData[]) {
    state.rolesList = rolesList
  },
  SET_ORGANIZATIONS_LIST(
    state: IUserState,
    organizationsList: IOrganizationData[]
  ) {
    state.organizationsList = organizationsList
  },
  SET_ORGANIZATION(
    state: IUserState,
    organization: Partial<IOrganizationData>
  ) {
    state.organization = organization
    if (organization) {
      state.corporateBrandingImage = organization.corporateBrandingImage!
    }
  },
  SET_WAREHOUSES_LIST(state: IUserState, warehousesList: any[]) {
    state.warehousesList = warehousesList
  },
  SET_WAREHOUSE(state: IUserState, warehouse: any) {
    state.warehouse = warehouse
  },
  SET_ROLE(state: IUserState, role: Partial<IRoleData>) {
    state.role = role
  },
  SET_USER_UUID(state: IUserState, userUuid: string) {
    state.userUuid = userUuid
  },
  setIsSession(state: IUserState, isSession: boolean) {
    state.isSession = isSession
  },
  setSessionInfo(state: IUserState, sessionInfo: Partial<ISessionData>) {
    state.sessionInfo = sessionInfo
  }
}
