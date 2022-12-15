import router, { asyncRoutes, constantRoutes, getFlatRoutes } from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route, RouteConfig } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import { SettingsModule } from '@/store/modules/settings'
import vue from 'vue'
import { isIpOrLocalAddr } from '@/utils/validate'
import { getToken } from '@/utils/cookies'
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false })

const getPageTitle = (data: any) => {
  if (data.type) {
    return `${data.title}`
  }
  if (!data.type && data.title) {
    return `${SettingsModule.title} - ${data.title}`
  }
  return `${SettingsModule.title}`
}

router.beforeEach(async (to: Route, _: Route, next: any) => {
  try {
    NProgress.start()

    if (
      getFlatRoutes(constantRoutes).some(
        (value) =>
          value.meta &&
          !value.meta.isNeedLogin &&
          value.path.toLowerCase() === to.path.toLowerCase()
      )
    ) {
      // In the free login whitelist, go directly
      return next()
    }

    // 初始化权限
    if (UserModule.menus.length === 0 && !UserModule.userId) {
      await UserModule.GetUserInfo()
    }
    // console.log(UserModule.menus)
    if (to.path === '/' && PermissionModule.dynamicRoutes.length > 0) {
      // const firstMenu = UserModule.menus[0]
      const firstRoute: any = getFirstRoute(PermissionModule.dynamicRoutes)
      // 绕过权限判断
      // return next({ path: firstRoute.path })

      if (firstRoute) {
        return next({ path: firstRoute.path })
      }
    }
    // 绕过权限判断
    // return next()

    if (
      !getFlatRoutes(PermissionModule.dynamicRoutes).some(
        (route) => route.path.toLowerCase() === to.path.toLowerCase()
      )
    ) {
      return next({ path: '/403' })
    }
    return next()
  } catch (e) {
    // Remove token and redirect to login page
    // UserModule.ResetToken()
    vue.prototype.$toast.error(e || 'Has Error')
    next()
  } finally {
    NProgress.done()
  }
})

function getFirstRoute(routes: RouteConfig[]): RouteConfig | void {
  for (const route of getFlatRoutes(routes)) {
    if (route.meta && !route.children && (route.meta.id || route.meta.parentId) && !route.meta.hidden) {
      return route
    }
  }
}

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()

  // set page title
  if (to.meta) document.title = getPageTitle(to.meta)
})
