import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
// import { login, logout, getUserInfo } from '@/api/users'
// import { login, logout, requestUserInfoFromSession } from '@/ADempiere/modules/user/UserService/user'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import { resetRouter } from '@/router'
import { TagsViewModule } from './tags-view'
// import store from '@/store'
import store from '@/ADempiere/shared/store'
import { IOrganizationData, requestOrganizationsList, IOrganizationsListResponse, requestWarehousesList, IWarehousesListResponse } from '@/ADempiere/modules/core'
import { IRoleData, ISessionData, requestSessionInfo, IUserInfoData, requestUserInfoFromSession, login, logout } from '@/ADempiere/modules/user'
import { requestRolesList, requestChangeRole } from '@/ADempiere/modules/user/UserService/role'
import { setCurrentRole, getCurrentRole, removeCurrentRole, getCurrentOrganization, removeCurrentOrganization, setCurrentOrganization, getCurrentWarehouse, removeCurrentWarehouse, setCurrentWarehouse } from '@/ADempiere/shared/utils/auth'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import language from '@/ADempiere/shared/lang'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { PermissionModule } from './permission'
import { Route } from 'vue-router'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string

  // ADempiere
  userUuid: string
  role: Partial<IRoleData>
  rolesList: IRoleData[]
  organizationsList: IOrganizationData[]
  organization: Partial<IOrganizationData>
  warehousesList: any[]
  warehouse: any
  isSession: boolean
  sessionInfo: Partial<ISessionData>
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token: string = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''
  // Adempiere
  public userUuid = ''
  public role: Partial<IRoleData> = {} // info current role
  public rolesList: IRoleData[] = []
  public organizationsList: IOrganizationData[] = []
  public organization: Partial<IOrganizationData> = {}
  public warehousesList: any[] = []
  public warehouse: any = {}
  public isSession = false
  public sessionInfo: Partial<ISessionData> = {}

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  // Adempiere Mutations
  @Mutation
  private SET_ROLES_LIST(rolesList: IRoleData[]) {
    this.rolesList = rolesList
  }

  @Mutation
  private SET_ORGANIZATIONS_LIST(organizationsList: IOrganizationData[]) {
    this.organizationsList = organizationsList
  }

  @Mutation
  private SET_ORGANIZATION(organization: Partial<IOrganizationData>) {
    this.organization = organization
  }

  @Mutation
  private SET_WAREHOUSES_LIST(warehousesList: any[]) {
    this.warehousesList = warehousesList
  }

  @Mutation
  private SET_WAREHOUSE(warehouse: any) {
    this.warehouse = warehouse
  }

  @Mutation
  private SET_ROLE(role: Partial<IRoleData>) {
    this.role = role
  }

  @Mutation
  private SET_USER_UUID(userUuid: string) {
    this.userUuid = userUuid
  }

  @Mutation
  private setIsSession(isSession: boolean) {
    this.isSession = isSession
  }

  @Mutation
  private setSessionInfo(sessionInfo: Partial<ISessionData>) {
    this.sessionInfo = sessionInfo
  }

  @Action
  public async Login(userInfo: {
    userName: string
    password: string
    roleUuid: string
    organizationUuid: string
  }) {
    const { userName, organizationUuid, roleUuid, password } = userInfo
    return await new Promise((resolve, reject) => {
      login({
        userName,
        password
        // roleUuid,
        // organizationUuid
      })
        .then((logInResponse: any) => {
          if ([13, 500].includes(logInResponse.code)) {
            reject(logInResponse)
            return
          }

          const { result: resultedToken } = logInResponse

          this.SET_TOKEN(resultedToken)
          setToken(resultedToken)
          resolve(logInResponse)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * Get session info
   * @param {string} sessionUuid as token
   */
  @Action
  public async GetSessionInfo(sessionUuid?: string) {
    if (!sessionUuid) {
      sessionUuid = getToken()
    }

    return await new Promise((resolve, reject) => {
      requestSessionInfo(sessionUuid!)
        .then(async sessionInfo => {
          const { userInfo } = sessionInfo
          const avatar = userInfo.image

          this.setIsSession(true)
          this.setSessionInfo({
            id: userInfo.id,
            uuid: userInfo.uuid,
            name: userInfo.name,
            processed: userInfo.processed
          })
          this.SET_NAME(sessionInfo.name)
          this.SET_INTRODUCTION(userInfo.description)
          this.SET_USER_UUID(userInfo.uuid)
          this.SET_AVATAR(avatar)

          // TODO: Check decimals Number as String '0.123'
          // set multiple context
          // this.context.dispatch('setMultiplePreference', {
          //   values: sessionInfo.defaultContext
          // }, {
          //   root: true
          // })
          this.context.dispatch(Namespaces.Preference + '/' + 'setMultiplePreference', {
            values: sessionInfo.defaultContext
          }, {
            root: true
          })

          const sessionResponse = {
            name: sessionInfo.name,
            defaultContext: sessionInfo.defaultContext
          }

          const { role } = sessionInfo
          this.SET_ROLE(role)
          setCurrentRole(role.uuid)

          // wait to establish the client and organization to generate the menu
          await this.GetOrganizationsListFromServer(role.uuid)

          resolve(sessionResponse)
          this.context.commit(Namespaces.System + '/' + 'setSystemDefinition', {
            countryId: sessionInfo.countryId,
            costingPrecision: sessionInfo.costingPrecision,
            countryCode: sessionInfo.countryCode,
            countryName: sessionInfo.countryName,
            currencyIsoCode: sessionInfo.currencyIsoCode,
            currencyName: sessionInfo.currencyName,
            currencySymbol: sessionInfo.currencySymbol,
            displaySequence: sessionInfo.displaySequence,
            language: sessionInfo.language,
            standardPrecision: sessionInfo.standardPrecision
          }, {
            root: true
          })

          this.GetRolesListFromServer(sessionUuid)
        })
        .catch(error => {
          console.warn(`Error ${error.code} getting context session: ${error.message}.`)
          reject(error)
        })
    })
  }

  @Action
  public async GetRolesListFromServer(sessionUuid?: string) {
    sessionUuid = sessionUuid || undefined
    if (!(sessionUuid)) {
      sessionUuid = getToken()
    }

    return await new Promise((resolve, reject) => {
      requestRolesList(sessionUuid!)
        .then((rolesList: IRoleData[]) => {
        // roles must be a non-empty array
          if (!(rolesList)) {
            reject(new Error('getInfo: roles must be a non-null array!'))
          // reject({
          //   code: 0,
          //   message: 'getInfo: roles must be a non-null array!'
          // })
          }

          // set current role
          if (!this.role) {
            let roleFounded
            const roleSession = getCurrentRole()
            if (roleSession) {
              roleFounded = rolesList.find((itemRole: IRoleData) => {
                return itemRole.uuid === roleSession
              })
            }
            if (!(roleFounded)) {
              roleFounded = rolesList[0]
            }

            if ((roleFounded)) {
              this.SET_ROLE(roleFounded)
            }
          }

          this.SET_ROLES_LIST(rolesList)

          resolve(rolesList)

          const rolesName: string[] = rolesList.map(rolItem => {
            return rolItem.name
          })
          this.SET_ROLES(rolesName)
        }).catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * Get user info
   * @param {string} sessionUuid as token
   */
  @Action
  public async GetUserInfoFromSession(sessionUuid?: string): Promise<IUserInfoData & {
    avatar: string
  }> {
    if (!sessionUuid) {
      sessionUuid = getToken()
    }

    return await new Promise((resolve, reject) => {
      requestUserInfoFromSession(sessionUuid!).then((responseGetInfo: IUserInfoData) => {
        if (!(responseGetInfo)) {
          reject(new Error('Verification failed, please Login again.'))
        }

        // if (isEmptyValue(state.role)) {
        //   const role = responseGetInfo.rolesList.find(itemRole => {
        //     return itemRole.uuid === getCurrentRole()
        //   })
        //   if (!isEmptyValue(role)) {
        //     commit('SET_ROLE', role)
        //   }
        // }
        this.GetRolesListFromServer(sessionUuid)

        const avatar: string = responseGetInfo.image
        this.SET_AVATAR(avatar)

        resolve({
          ...responseGetInfo,
          avatar
        })
      }).catch(error => {
        console.warn(`Error ${error.code} getting user info value: ${error.message}.`)
        reject(error)
      })
    })
  }

  // user logout
  @Action
  public async Logout() {
    return await new Promise((resolve, reject) => {
      this.SET_TOKEN('')
      this.SET_ROLES([])
      removeToken()

      this.setIsSession(false)
      this.context.dispatch(Namespaces.BusinessData + '/' + 'resetStateBusinessData', {
        root: true
      })
      this.context.dispatch(Namespaces.Panel + '/' + 'dictionaryResetCache', {
        root: true
      })

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      // this.context.dispatch('tagsView/delAllViews', null, { root: true })
      TagsViewModule.delAllViews()

      removeCurrentRole()
      resetRouter()
      logout(this.token).catch(error => {
        console.warn(error)
      }).finally(() => {
        resolve({})
      })
    })
  }

  // remove token
  @Action
  public ResetToken() {
    return new Promise(resolve => {
      this.SET_TOKEN('')
      this.SET_ROLES([])
      removeToken()
    })
  }

  @Action
  public async GetOrganizationsListFromServer(roleUuid?: string) {
    if (!(roleUuid)) {
      roleUuid = getCurrentRole()
    }
    return await requestOrganizationsList({
      roleUuid: roleUuid!
    })
      .then((response: IOrganizationsListResponse) => {
        this.SET_ORGANIZATIONS_LIST(response.organizationsList)
        let organization: IOrganizationData | undefined = response.organizationsList.find(item => {
          if (item.uuid === getCurrentOrganization()) {
            return item
          }
        })
        if (!(organization)) {
          organization = response.organizationsList[0]
        }
        if (!(organization)) {
          removeCurrentOrganization()
          organization = undefined
        } else {
          setCurrentOrganization(organization.uuid)
        }
        this.SET_ORGANIZATION(organization!)
        this.context.commit(Namespaces.Preference + '/' + 'setPreferenceContext', {
          columnName: '#AD_Org_ID',
          value: organization!.id
        }, {
          root: true
        })

        this.GetWarehousesList(organization!.uuid)
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Organizations list: ${error.message}.`)
      })
  }

  @Action
  public async ChangeOrganization(params: {
    organizationUuid: string
    organizationId: number
    isCloseAllViews?: boolean
  }) {
    const { organizationId, organizationUuid, isCloseAllViews = params.isCloseAllViews || true } = params
    // TODO: Check if there are no tagViews in the new routes to close them, and
    // if they exist, reload with the new route using name (uuid)
    TagsViewModule.setCustomTagView(isCloseAllViews)

    return await requestChangeRole({
      // token: getToken(),
      roleUuid: getCurrentRole()!,
      organizationUuid
    })
      .then((changeRoleResponse: ISessionData) => {
        const { uuid } = changeRoleResponse

        this.SET_TOKEN((uuid))
        setToken(uuid)

        setCurrentOrganization(organizationUuid)
        // const organization: IOrganizationData | undefined = this.getOrganizations.find(org => org.uuid === organizationUuid)
        // this.SET_ORGANIZATION(organization!)

        // commit('setPreferenceContext', {
        //   columnName: '#AD_Org_ID',
        //   value: organizationId
        // }, {
        //   root: true
        // })

        // Update user info and context associated with session
        this.GetSessionInfo(uuid)

        this.context.dispatch(Namespaces.BusinessData + '/' + 'resetStateBusinessData', null, {
          root: true
        })
        this.context.dispatch(Namespaces.Panel + '/' + 'dictionaryResetCache', null, {
          root: true
        })

        this.GetWarehousesList(organizationUuid)

        showMessage({
          message: language.t('notifications.successChangeRole').toString(),
          type: 'success',
          showClose: true
        })
      })
      .catch(error => {
        showMessage({
          message: error.message,
          type: 'error',
          showClose: true
        })
        console.warn(`Error change role: ${error.message}. Code: ${error.code}.`)
      })
      .finally(() => {
        PermissionModule.sendRequestMenu(organizationId)
      })
  }

  @Action
  public async GetWarehousesList(organizationUuid?: string) {
    if (!(organizationUuid)) {
      organizationUuid = getCurrentOrganization()
    }

    return await requestWarehousesList({
      organizationUuid: organizationUuid!
    })
      .then((response: IWarehousesListResponse) => {
        this.SET_WAREHOUSES_LIST(response.warehousesList)

        let warehouse = response.warehousesList.find(item => item.uuid === getCurrentWarehouse())
        if (!(warehouse)) {
          warehouse = response.warehousesList[0]
        }
        if (!(warehouse)) {
          removeCurrentWarehouse()
          this.SET_WAREHOUSE(undefined)
        } else {
          setCurrentWarehouse(warehouse.uuid)
          this.SET_WAREHOUSE(warehouse)
          this.context.commit(Namespaces.Preference + '/' + 'setPreferenceContext', {
            columnName: '#M_Warehouse_ID',
            value: warehouse.id
          }, {
            root: true
          })
        }
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Warehouses list: ${error.message}.`)
      })
  }

@Action
  public ChangeWarehouse(params: {
    warehouseUuid: string
  }) {
    const { warehouseUuid } = params
    setCurrentWarehouse(warehouseUuid)

    const currentWarehouse = this.warehousesList.find(warehouse => warehouse.uuid === warehouseUuid)
    this.SET_WAREHOUSE(currentWarehouse)

    this.context.commit(Namespaces.Preference + '/' + 'setPreferenceContext', {
      columnName: '#M_Warehouse_ID',
      value: currentWarehouse.id
    }, {
      root: true
    })
  }

  // dynamically modify permissions
  @Action
public async ChangeRole(params: {
    roleUuid: string
    organizationUuid: string
    warehouseUuid: string
    isCloseAllViews?: boolean
  }) {
  const { roleUuid, organizationUuid, warehouseUuid, isCloseAllViews = params.isCloseAllViews || true } = params
  TagsViewModule.setCustomTagView(isCloseAllViews)
  // this.context.dispatch('tagsView/setCustomTagView', {
  //   isCloseAllViews
  // }, {
  //   root: true
  // })

  return await requestChangeRole({
    // token: getToken(),
    roleUuid,
    organizationUuid,
    warehouseUuid
  })
    .then((changeRoleResponse: ISessionData) => {
      const { role, uuid } = changeRoleResponse

      this.SET_ROLE(role)
      setCurrentRole(role.uuid)

      this.SET_TOKEN(uuid)
      setToken(uuid)

      this.GetSessionInfo(uuid)
      // Update user info and context associated with session
      this.context.dispatch(Namespaces.BusinessData + '/' + 'resetStateBusinessData')
      this.context.dispatch(Namespaces.Panel + '/' + 'dictionaryResetCache')

      showMessage({
        message: language.t('notifications.successChangeRole').toString(),
        type: 'success',
        showClose: true
      })
      return {
        ...role,
        sessionUuid: uuid
      }
    })
    .catch(error => {
      showMessage({
        message: error.message,
        type: 'error',
        showClose: true
      })
      console.warn(`Error change role: ${error.message}. Code: ${error.code}.`)
    })
    .finally(() => {
      PermissionModule.sendRequestMenu()
    })
}

  // @Action
  // public async GetUserInfo() {
  //   if (this.token === '') {
  //     throw Error('GetUserInfo: token is undefined!')
  //   }
  //   //const { data } = await getUserInfo({ /* Your params here */ })
  //   if (!data) {
  //     throw Error('Verification failed, please Login again.')
  //   }
  //   const { roles, name, avatar, introduction, email } = data.user
  //   // roles must be a non-empty array
  //   if (!roles || roles.length <= 0) {
  //     throw Error('GetUserInfo: roles must be a non-null array!')
  //   }
  //   this.SET_ROLES(roles)
  //   this.SET_NAME(name)
  //   this.SET_AVATAR(avatar)
  //   this.SET_INTRODUCTION(introduction)
  //   this.SET_EMAIL(email)
  // }

  @Action
  public async ChangeRoles(role: string) {
    const founded = this.rolesList.find((item) => {
      return item.name === role
    })

    if (founded) {
      this.ChangeRole({
        organizationUuid: getCurrentOrganization()!,
        roleUuid: founded!.uuid,
        warehouseUuid: getCurrentWarehouse()!
      })
    }
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout(this.token)
    removeToken()
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  // Getters
  get getRoles(): IRoleData[] {
    return this.rolesList
  }

  get getOrganizations(): IOrganizationData[] {
    return this.organizationsList
  }

  get getWarehouses(): any[] {
    return this.warehousesList
  }

  // current role info
  get getRole() {
    return this.role
  }

  get getOrganization(): Partial<IOrganizationData> {
    return this.organization
  }

  get getWarehouse(): any {
    return this.warehouse
  }

  get getIsSession(): boolean {
    return this.isSession
  }

  get getUserUuid(): string {
    return this.userUuid
  }

  get getIsPersonalLock(): boolean | undefined {
    return this.role.isPersonalLock
  }
}

export const UserModule = getModule(User)
