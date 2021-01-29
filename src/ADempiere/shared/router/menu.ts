
/* Layout  */
import { requestMenu } from '@/ADempiere/modules/user/UserService/user'
import staticRoutes from './staticRoutes'
import { IMenuData } from '@/ADempiere/modules/user'
import { RouteConfig } from 'vue-router'
import { convertAction } from '@/ADempiere/shared/utils/DictionaryUtils'

// Get Menu from server
export function loadMainMenu(params: {
  sessionUuid: string
  roleUuid?: string
  organizationUuid?: string
}): Promise<RouteConfig[]> {
  const {
    sessionUuid,
    roleUuid = params.roleUuid || String(0),
    organizationUuid = params.organizationUuid || String(0)
  } = params

  return new Promise<RouteConfig[]>(resolve => {
    requestMenu({
      sessionUuid
    }).then((menuResponse: IMenuData) => {
      const asyncRoutesMap: RouteConfig[] = []

      menuResponse.childs.forEach(menuElement => {
        const optionMenu = getRouteFromMenuItem({
          menu: menuElement,
          roleUuid,
          organizationUuid
        })

        if (optionMenu.meta.isSummary) {
          menuElement.childs.forEach(menu => {
            const childsSumaryConverted: RouteConfig = getChildFromAction({
              menu,
              index: 0,
              roleUuid,
              organizationUuid
            })
            optionMenu.children?.push(childsSumaryConverted)
            optionMenu.children![0].meta.childs.push(childsSumaryConverted)
            optionMenu.meta.childs.push(childsSumaryConverted)
          })
        } else {
          const childsConverted = getChildFromAction({
            menu: menuElement,
            index: undefined,
            roleUuid,
            organizationUuid
          })

          optionMenu.children?.push(childsConverted)
          optionMenu.meta.childs.push(childsConverted)
        }
        asyncRoutesMap.push(optionMenu)
      })
      resolve(staticRoutes.concat(asyncRoutesMap))
    }).catch(error => {
      console.warn(`Error getting menu: ${error.message}. Code: ${error.code}.`)
    })
  })
}

/**
 * Get Only Child
 * @param {object} menu
 * @param {number} index
 * @param {number} roleUuid
 * @param {number} organizationUuid
 */
function getChildFromAction(params: { menu: any, index?: number, roleUuid: string, organizationUuid: string }): RouteConfig {
  const { menu, index = params.index || 0, roleUuid, organizationUuid } = params
  const { component, icon, name, isIndex } = convertAction(menu.action)
  const routeIdentifier = name + '/' + menu.id

  const option: RouteConfig = {
    path: '/' + roleUuid + '/' + organizationUuid + '/' + routeIdentifier,
    component,
    name: menu.uuid,
    meta: {
      hidden: index > 0,
      alwaysShow: true,
      description: menu.description,
      icon,
      isIndex,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      parentUuid: menu.parent_uuid,
      noCache: false,
      referenceUuid: menu.reference_uuid,
      tabUuid: '',
      title: menu.name,
      type: name,
      uuid: menu.reference_uuid,
      childs: []
    }
  }

  if (isIndex || name === 'summary') {
    option.children = []
    menu.childs.forEach((child: any) => {
      const menuConverted: RouteConfig = getChildFromAction({
        menu: child,
        index: 1,
        roleUuid,
        organizationUuid
      })
      option.children?.push(menuConverted)
      option.meta.childs.push(menuConverted)
    })
  }

  return option
}

/**
 * Convert menu item from server to Route
 * @author elsiosanchez <elsiosanches@gmail.com>
 * @param {object} menu
 * @param {number} roleUuid
 * @param {number} organizationUuid
 */
function getRouteFromMenuItem(params: { menu: any, roleUuid: string, organizationUuid: string }): RouteConfig {
  const { menu, roleUuid, organizationUuid } = params
  const { component, icon, name, isIndex } = convertAction(menu.action)

  const optionMenu: RouteConfig = {
    path: '/' + roleUuid + '/' + organizationUuid + '/' + menu.id,
    redirect: '/' + menu.id + '/index',
    component: () => import('@/layout/index.vue'),
    name: menu.uuid,
    meta: {
      description: menu.description,
      icon,
      isReadOnly: menu.is_read_only,
      isSummary: menu.is_summary,
      isSalesTransaction: menu.is_sales_transaction,
      noCache: true,
      referenceUuid: menu.reference_uuid,
      title: menu.name,
      type: name,
      childs: []
    },
    children: [{
      path: 'index',
      component,
      name: menu.uuid + '-index',
      meta: {
        hidden: true,
        breadcrumb: false,
        description: menu.description,
        icon,
        isIndex,
        isReadOnly: menu.is_read_only,
        isSalesTransaction: menu.is_sales_transaction,
        noCache: true,
        parentUuid: menu.uuid,
        referenceUuid: menu.reference_uuid,
        title: menu.name,
        type: name,
        childs: []
      }
    }]
  }
  return optionMenu
}
