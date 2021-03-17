import { IRootState } from '@/store'
import { ActionContext, ActionTree } from 'vuex'
import { IUserState } from '../UserType'
import { IOrganizationData, requestOrganizationsList, IOrganizationsListResponse, requestWarehousesList, IWarehousesListResponse } from '@/ADempiere/modules/core'
import { IRoleData, ISessionData, requestSessionInfo, IUserInfoData, requestUserInfoFromSession, login, logout } from '@/ADempiere/modules/user'
import { requestRolesList, requestChangeRole } from '@/ADempiere/modules/user/UserService/role'
import { setCurrentRole, getCurrentRole, removeCurrentRole, getCurrentOrganization, removeCurrentOrganization, setCurrentOrganization, getCurrentWarehouse, removeCurrentWarehouse, setCurrentWarehouse } from '@/ADempiere/shared/utils/auth'
import { getToken, removeToken, setToken } from '@/utils/cookies'
import { Namespaces } from '@/ADempiere/shared/utils/types'
import { resetRouter } from '@/router'
import { showMessage } from '@/ADempiere/shared/utils/notifications'
import language from '@/ADempiere/shared/lang'

type UserActionContext = ActionContext<IUserState, IRootState>
type UserActionTree = ActionTree<IUserState, IRootState>

export const actions: UserActionTree = {
  async Login(context: UserActionContext, userInfo: {
      userName: string
      password: string
      roleUuid: string
      organizationUuid: string
      token: string
    }) {
    const { userName, organizationUuid, token, password, roleUuid } = userInfo
    return await new Promise((resolve, reject) => {
      console.log({
        userName,
        password,
        token,
        organizationUuid,
        roleUuid
      })
      login({
        userName,
        password,
        token,
        organizationUuid,
        roleUuid
      })
        .then((logInResponse: any) => {
          if ([13, 500].includes(logInResponse.code)) {
            reject(logInResponse)
            return
          }

          const { result: resultedToken } = logInResponse

          context.commit('SET_TOKEN', resultedToken)
          setToken(resultedToken)
          resolve(logInResponse)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
     * Get session info
     * @param {string} sessionUuid as token
     */
  async GetSessionInfo(context: UserActionContext, sessionUuid?: string) {
    if (!sessionUuid) {
      sessionUuid = getToken()
    }

    return await new Promise((resolve, reject) => {
      requestSessionInfo(sessionUuid!)
        .then(async(sessionInfo: ISessionData) => {
          const { userInfo } = sessionInfo
          const avatar = userInfo.image

          context.commit('setIsSession', true)
          context.commit('setSessionInfo', {
            id: userInfo.id,
            uuid: userInfo.uuid,
            name: userInfo.name,
            processed: userInfo.processed
          })

          context.commit('SET_NAME', sessionInfo.name)
          context.commit('SET_INTRODUCTION', userInfo.description)
          context.commit('SET_USER_UUID', userInfo.uuid)
          context.commit('SET_AVATAR', avatar)

          // TODO: Check decimals Number as String '0.123'
          // set multiple context
          // this.context.dispatch('setMultiplePreference', {
          //   values: sessionInfo.defaultContext
          // }, {
          //   root: true
          // }))
          context.dispatch(Namespaces.Preference + '/' + 'setMultiplePreference', {
            values: sessionInfo.defaultContext
          }, {
            root: true
          })

          const sessionResponse = {
            name: sessionInfo.name,
            defaultContext: sessionInfo.defaultContext
          }

          const { role } = sessionInfo
          context.commit('SET_ROLE', role)
          setCurrentRole(role.uuid)

          // wait to establish the client and organization to generate the menu
          await context.dispatch('GetOrganizationsListFromServer', role.uuid)

          resolve(sessionResponse)
          context.commit(Namespaces.System + '/' + 'setSystemDefinition', {
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

          context.dispatch('GetRolesListFromServer', sessionUuid)
        })
        .catch(error => {
          console.warn(`Error ${error.code} getting context session: ${error.message}.`)
          reject(error)
        })
    })
  },
  async GetRolesListFromServer(context: UserActionContext, sessionUuid?: string) {
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
          if (!context.state.role) {
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
              context.commit('SET_ROLE', roleFounded)
            }
          }

          context.commit('SET_ROLES_LIST', rolesList)

          resolve(rolesList)

          const rolesName: string[] = rolesList.map(rolItem => {
            return rolItem.name
          })
          context.commit('SET_ROLES', rolesName)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  /**
     * Get user info
     * @param {string} sessionUuid as token
     */
  async GetUserInfoFromSession(context: UserActionContext, sessionUuid?: string): Promise<IUserInfoData & {
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
        context.dispatch('GetRolesListFromServer', sessionUuid)

        const avatar: string = responseGetInfo.image
        context.commit('SET_AVATAR', avatar)

        resolve({
          ...responseGetInfo,
          avatar
        })
      }).catch(error => {
        console.warn(`Error ${error.code} getting user info value: ${error.message}.`)
        reject(error)
      })
    })
  },
  // user logout
  async Logout(context: UserActionContext) {
    return await new Promise((resolve, reject) => {
      context.commit('SET_TOKEN', '')
      context.commit('SET_ROLES', [])
      removeToken()

      context.commit('setIsSession', false)
      context.dispatch(Namespaces.BusinessData + '/' + 'resetStateBusinessData', {
        root: true
      })
      context.dispatch(Namespaces.Panel + '/' + 'dictionaryResetCache', {
        root: true
      })

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      // this.context.dispatch('tagsView/delAllViews', null, { root: true })
      context.dispatch(Namespaces.TagsView + '/' + 'delAllViews', undefined, { root: true })
      // TagsViewModule.delAllViews()

      removeCurrentRole()
      resetRouter()
      logout(context.state.token).catch(error => {
        console.warn(error)
      }).finally(() => {
        resolve({})
      })
    })
  },
  // remove token
  ResetToken(context: UserActionContext) {
    return new Promise(resolve => {
      context.commit('SET_TOKEN', '')
      context.commit('SET_ROLES', [])
      removeToken()
    })
  },
  async GetOrganizationsListFromServer(context: UserActionContext, roleUuid?: string) {
    if (!(roleUuid)) {
      roleUuid = getCurrentRole()
    }
    return await requestOrganizationsList({
      roleUuid: roleUuid!
    })
      .then((response: IOrganizationsListResponse) => {
        context.commit('SET_ORGANIZATIONS_LIST', response.organizationsList)
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
        context.commit('SET_ORGANIZATION', organization)
        context.commit(Namespaces.Preference + '/' + 'setPreferenceContext', {
          columnName: '#AD_Org_ID',
          value: organization!.id
        }, {
          root: true
        })

        context.dispatch('GetWarehousesList', organization?.uuid)
      })
      .catch(error => {
        console.warn(`Error ${error.code} getting Organizations list: ${error.message}.`)
      })
  },
  async ChangeOrganization(context: UserActionContext, params: {
      organizationUuid: string
      organizationId: number
      isCloseAllViews?: boolean
    }) {
    const { organizationId, organizationUuid, isCloseAllViews = params.isCloseAllViews || true } = params
    // TODO: Check if there are no tagViews in the new routes to close them, and
    // if they exist, reload with the new route using name (uuid)
    context.dispatch(Namespaces.TagsView + '/' + 'setCustomTagView', isCloseAllViews, { root: true })
    // TagsViewModule.setCustomTagView(isCloseAllViews)

    return await requestChangeRole({
      // token: getToken(),
      roleUuid: getCurrentRole()!,
      organizationUuid
    })
      .then((changeRoleResponse: ISessionData) => {
        const { uuid } = changeRoleResponse

        context.commit('SET_TOKEN', uuid)
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
        context.dispatch('GetSessionInfo', uuid)

        context.dispatch(Namespaces.BusinessData + '/' + 'resetStateBusinessData', null, {
          root: true
        })
        context.dispatch(Namespaces.Panel + '/' + 'dictionaryResetCache', null, {
          root: true
        })

        context.dispatch('GetWarehousesList', organizationUuid)

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
        context.dispatch(Namespaces.Permission + '/' + 'sendRequestMenu', undefined, { root: true })
        // PermissionModule.sendRequestMenu()
      })
  },
  async GetWarehousesList(context: UserActionContext, organizationUuid?: string) {
    if (!(organizationUuid)) {
      organizationUuid = getCurrentOrganization()
    }

    return await requestWarehousesList({
      organizationUuid: organizationUuid!
    })
      .then((response: IWarehousesListResponse) => {
        context.commit('SET_WAREHOUSES_LIST', response.warehousesList)

        let warehouse = response.warehousesList.find(item => item.uuid === getCurrentWarehouse())
        if (!(warehouse)) {
          warehouse = response.warehousesList[0]
        }
        if (!(warehouse)) {
          removeCurrentWarehouse()
          context.commit('SET_WAREHOUSE', undefined)
        } else {
          setCurrentWarehouse(warehouse.uuid)
          context.commit('SET_WAREHOUSE', warehouse)
          context.commit(Namespaces.Preference + '/' + 'setPreferenceContext', {
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
  },
  ChangeWarehouse(context: UserActionContext, params: {
      warehouseUuid: string
    }) {
    const { warehouseUuid } = params
    setCurrentWarehouse(warehouseUuid)

    const currentWarehouse = context.state.warehousesList.find(warehouse => warehouse.uuid === warehouseUuid)
    context.commit('SET_WAREHOUSE', currentWarehouse)

    context.commit(Namespaces.Preference + '/' + 'setPreferenceContext', {
      columnName: '#M_Warehouse_ID',
      value: currentWarehouse.id
    }, {
      root: true
    })
  },
  // dynamically modify permissions
  async ChangeRole(context: UserActionContext, params: {
      roleUuid: string
      organizationUuid: string
      warehouseUuid: string
      isCloseAllViews?: boolean
    }) {
    const { roleUuid, organizationUuid, warehouseUuid, isCloseAllViews = params.isCloseAllViews || true } = params
    context.dispatch(Namespaces.TagsView + '/' + 'setCustomTagView', isCloseAllViews, { root: true })
    // TagsViewModule.setCustomTagView(isCloseAllViews)
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

        context.commit('SET_ROLE', role)
        setCurrentRole(role.uuid)

        context.commit('SET_TOKEN', uuid)
        setToken(uuid)

        context.dispatch('GetSessionInfo', uuid)
        // Update user info and context associated with session
        context.dispatch(Namespaces.BusinessData + '/' + 'resetStateBusinessData', undefined, { root: true })
        context.dispatch(Namespaces.Panel + '/' + 'dictionaryResetCache', undefined, { root: true })

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
        context.dispatch(Namespaces.Permission + '/' + 'sendRequestMenu', undefined, { root: true })
        // PermissionModule.sendRequestMenu()
      })
  },

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
  async ChangeRoles(context: UserActionContext, role: string) {
    const founded = context.state.rolesList.find((item) => {
      return item.name === role
    })

    if (founded) {
      context.dispatch('ChangeRole', {
        organizationUuid: getCurrentOrganization()!,
        roleUuid: founded!.uuid,
        warehouseUuid: getCurrentWarehouse()!
      })
    }
  },
  async LogOut(context: UserActionContext) {
    if (context.state.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    await logout(context.state.token)
    removeToken()
    resetRouter()

    // Reset visited views and cached views
    context.dispatch(Namespaces.TagsView + '/' + 'delAllViews', undefined, { root: true })
    // TagsViewModule.delAllViews()
    context.commit('SET_TOKEN', '')
    context.commit('SET_ROLES', [])
  }
}
