import Vue from 'vue'
import store from '@/ADempiere/shared/store'
import { isArray } from '@/utils/validate'
import settings from '@/settings'
import { Namespaces } from '@/ADempiere/shared/utils/types'

const { errorLog: needErrorLog } = settings

const checkNeed = () => {
  const env = process.env.NODE_ENV
  if (isArray(needErrorLog) && env) {
    return needErrorLog.includes(env)
  }
  return false
}

if (checkNeed()) {
  Vue.config.errorHandler = function(err, vm, info) {
    store.dispatch(Namespaces.ErrorLog + '/' + 'AddErrorLog', {
      err,
      vm,
      info,
      url: window.location.href
    })
  }
}
