import { DirectiveOptions } from 'vue'
import store from '@/ADempiere/shared/store'
import { Namespaces } from '@/ADempiere/shared/utils/types'

export const permission: DirectiveOptions = {
  inserted(el, binding) {
    const { value } = binding
    const roles: string[] = store.getters[Namespaces.User + '/' + 'getRoleNames']
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.style.display = 'none'
      }
    } else {
      throw new Error('need roles! Like v-permission="[\'admin\',\'editor\']"')
    }
  }
}
