import axios from 'axios'
import { UserModule } from '@/store/modules/user'
import vue from 'vue'
import { isArray } from '@/utils/validate'

const service = axios.create({
  timeout: 600 * 1000
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    if (config.params) {
      // 数组转换
      const params: any = {}
      for (const key in config.params) {
        if (Object.prototype.hasOwnProperty.call(config.params, key)) {
          const item = config.params[key]
          if (isArray(item)) {
            params[key] = item.join(',')
          } else {
            params[key] = item === 0 ? 0 : item || ""
          }
        }
      }
      config.params = params
    }
    return config
  },
  (error) => {
    // console.log(error) // for debug
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // console.log(response)
    const res = response.data
    if (res instanceof Blob) {
      return response
    }

    if (res.status === 200 || res instanceof Blob) {
      return res.result
    }

    vue.prototype.$error(res.message)
    if (res.status === 401) {
      setTimeout(noPermissionEvent, 1000)
    }
    return Promise.reject(new Error(res.message || 'Error'))
  },
  (error) => {
    const message = error.message
    // if (error.response.data && error.response.data.message) {
    //   message += "<br/>" + error.response.data.message
    // }
    vue.prototype.$error(message || 'Error')
    return Promise.reject(error)
  }
)

function noPermissionEvent() {
  UserModule.ResetToken()
  return (window.location.href =
    process.env.VUE_APP_BASE_API +
    `/login?redirect=${encodeURIComponent(location.href)}`)
}
export default service
