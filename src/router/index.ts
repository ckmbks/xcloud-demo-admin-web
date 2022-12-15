import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/Layout.vue'

Vue.use(Router)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
    isPublic:boolean             配置了该属性为true的页面不受权限控制影响
    parentId:number              父路由id，用于获取父页面下的子tab页权限
    buttons: [{                  按钮权限配置，每个按钮必须配置id，
              id: number,        在需要权限的html节点上添加自定义指令 v-permission="按钮id"
              label: string
            }]
  }
*/

/**
 ConstantRoutes
 a base page that does not have permission requirements
 all roles can be accessed
 */
export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/Login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/ForgetOrFirst',
    component: () =>
      import(
        /* webpackChunkName: "ForgetOrFirst" */ '@/views/login/ForgetOrFirst.vue'
      ),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/403',
    component: () =>
      import(/* webpackChunkName: "403" */ '@/views/error-page/403.vue'),
    meta: { hidden: true }
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouteConfig[] = [
  {
    path: '',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'mdi-database-arrow-up',
      id: 9
    },
    children: [
      {
        name: 'UserList',
        path: '/UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: {
          title: '用户管理',
          icon: 'icon_system',
          id: 901
        }
      },
      {
        name: 'RoleList',
        path: '/RoleList',
        component: () => import('@/views/role/RoleList.vue'),
        meta: {
          title: '角色管理',
          icon: 'icon_system',
          id: 902
        }
      },
      {
        name: 'DicPage',
        path: '/DicPage',
        component: () => import('@/views/dictionaries/dic/DicPage.vue'),
        meta: {
          title: '字典管理',
          icon: 'icon_system',
          id: 904
        }
      },
      {
        name: 'OperationLogList',
        path: '/OperationLogList',
        component: () => import('@/views/operationLog/OperationLogList.vue'),
        meta: {
          title: '操作日志',
          icon: 'icon_system',
          id: 909
        }
      }
    ]
  },

  {
    path: '',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/user/MyAccount',
        component: () => import('@/views/user/MyAccount.vue'),
        meta: {
          hidden: true,
          isHiddenHeadMenuIfMobile: true,
          title: '我的'
        }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    base: process.env.BASE_URL,
    routes: asyncRoutes.concat(constantRoutes)
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  ;(router as any).matcher = (newRouter as any).matcher // reset router
}

// 将所有route和children打平合并到一起
export function getFlatRoutes(routes: RouteConfig[]): RouteConfig[] {
  let result: RouteConfig[] = []

  for (const route of routes) {
    result.push(route)
    if (route.children) {
      result = result.concat(route.children)
    }
  }
  return result
}
export const asyncRoutesTree = () => {
  const map: any = {}
  const rec = (
    routes: any,
    parentId: number | string = 0,
    isBtn: boolean = false
  ) => {
    const ary: any = []
    routes.forEach((route: any) => {
      let item: any = {}
      if ((route.meta && route.meta.hidden) || (!isBtn && !route.meta?.id))
        return

      if (isBtn) {
        if (!route.id) {
          const str = `未给${route.label}按钮权限配置id`
          Vue.prototype.$error(str)
          throw new Error(str)
        }
        if (map[route.id]) {
          const str = `“${map[route.id]}”与按钮权限配置“${
            route.label
          }”id值一致，请查看配置文件是否出错`
          Vue.prototype.$error(str)
          throw new Error(str)
        }
        map[route.id] = route.label
        item = {
          id: route.id,
          name: route.label,
          parentId: parentId,
          children: [],
          buttons: []
        }
      } else {
        if (map[route.meta.id]) {
          const str = `“${map[route.meta.id]}”与路由配置“${
            route.meta.title
          }”id值一致，请查看配置文件是否出错`
          Vue.prototype.$error(str)
          throw new Error(str)
        }
        map[route.meta.id] = route.meta.title
        item = {
          id: route.meta.id,
          name: route.meta.title,
          parentId: parentId,
          children: [],
          buttons: []
        }
      }

      if (route.meta?.buttons && route.meta?.buttons.length > 0) {
        item.buttons = [
          ...item.buttons,
          ...rec(route.meta.buttons, route.meta.id, true)
        ]
      }
      if (route.children && route.children.length > 0) {
        item.children = [
          ...item.children,
          ...rec(route.children, route.meta.id)
        ]
      }
      ary.push(item)
    })
    return ary
  }
  return rec(asyncRoutes)
}

export default router
