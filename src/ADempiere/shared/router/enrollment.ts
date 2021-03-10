import { RouteConfig } from 'vue-router'

const enrollmentRoute: RouteConfig[] = [
  {
    path: '/userEnrollment',
    component: () => import('@/ADempiere/shared/components/Login/UserEnrollment'),
    meta: { hidden: true }
  },
  {
    path: '/forgotPassword',
    component: () => import('@/ADempiere/shared/components/Login/ForgotPassword'),
    meta: { hidden: true }
  },
  {
    path: '/passwordReset',
    name: 'passwordReset',
    component: () => import('@/ADempiere/shared/components/Login/ChangePassword'),
    meta: { hidden: true }
  },
  {
    path: '/createPassword',
    name: 'createPassword',
    component: () => import('@/ADempiere/shared/components/Login/ChangePassword'),
    meta: { hidden: true }
  }
]

export default enrollmentRoute
