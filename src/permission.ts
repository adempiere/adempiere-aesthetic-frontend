import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import i18n from '@/ADempiere/shared/lang' // Internationalization
import settings from './settings'
import store from '@/ADempiere/shared/store'
import { Namespaces } from './ADempiere/shared/utils/types'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect', '/userEnrollment', '/createPassword', '/forgotPassword', '/passwordReset']

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  store.dispatch('setRouter', router)

  // Determine whether the user has logged in
  if (store.state.user.token) {
    if (to.path === '/login') {
      // If is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // Check whether the user has obtained his permission roles
      if (!store.state.user.isSession) {
        try {
          // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
          // await UserModule.GetUserInfo()
          await store.dispatch(Namespaces.User + '/' + 'GetSessionInfo') // UserModule.GetSessionInfo()
          const accessRoutes = await store.dispatch(Namespaces.Permission + '/' + 'GenerateRoutes')
          // const roles = UserModule.roles
          // Generate accessible routes map based on role
          // PermissionModule.GenerateRoutes()
          // Dynamically add accessible routes
          await router.addRoutes(accessRoutes)
          // Hack: ensure addRoutes is complete
          // Set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (err) {
          // Remove token and redirect to login page
          await store.dispatch(Namespaces.User + '/' + 'ResetToken')

          Message.error(err || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

let n = 0

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()
  n++
  console.log(n)
  // set page title
  document.title = getPageTitle(to.meta.title)
})
