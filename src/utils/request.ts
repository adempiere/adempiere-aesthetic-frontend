import { Namespaces } from '@/ADempiere/shared/utils/types'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/ADempiere/shared/store'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add cusstom token and language
    if (!config.params) {
      config.params = {}
    }
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (store.getters[Namespaces.User + '/' + 'getToken']) {
      // config.headers['X-Access-Token'] = store.getters[Namespaces.User + '/' + 'getToken'] // UserModule.token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data
    console.log('response from server')
    console.log(res)
    if (res.code >= 400) {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch(Namespaces.User + '/' + 'ResetToken').then(() => {
            location.reload() // To prevent bugs from vue-router
          })
        })
      }
      return Promise.reject(new Error(res.message || res.result || 'Error'))
    } else {
      return res.result
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
