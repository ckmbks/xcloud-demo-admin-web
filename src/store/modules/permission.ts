import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import { UserModule } from './user'

const hasPermission = (menus: any[], route: RouteConfig) => {
  if (UserModule.admin) {
    return true
  } else {
    return (
      !route.meta ||
      route.meta.isPublic ||
      route.meta.hidden ||
      menus.some(
        (id) =>
          route.meta && (id === route.meta.id || id === route.meta.parentId)
      )
    )
  }

  // 绕过权限判断
  // return !route.meta.hidden
}

export const filterAsyncRoutes = (routes: RouteConfig[], menus: any[]) => {
  const res: RouteConfig[] = []
  routes.forEach((route) => {
    const r = { ...route }
    if (r.children) {
      r.children = filterAsyncRoutes(r.children, menus)
      if (r.children.length > 0) {
        res.push(r)
      }
    } else if (hasPermission(menus, r)) {
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  public get menuRoutes() {
    const routes = PermissionModule.routes
    const result: Array<RouteConfig> = []
    routes.forEach((route) => {
      if (!route.meta || !route.meta.hidden) {
        const newRoute: any = {}
        Object.assign(newRoute, route)
        result.push(newRoute)
      }
    })
    result.forEach((route) => {
      if (route.children)
        route.children = route.children.filter(
          (child) => child.meta && !child.meta.hidden
        )
    })
    return result.filter((route) => route.children && route.children.length > 0)
  }

  @Mutation
  SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action
  public GenerateRoutes(menus: any[]) {
    this.SET_ROUTES(filterAsyncRoutes(asyncRoutes, menus))
  }
}

export const PermissionModule = getModule(Permission)
