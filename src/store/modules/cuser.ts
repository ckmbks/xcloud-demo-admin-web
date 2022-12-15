import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import * as AccountApi from '@/api/AccountApi'
import { getToken, removeToken } from '@/utils/cookies'
import { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  menus: any[]
  email: string
  userId: string
  userNo: string
  userType: string
  roles: any
  shopType: number
}

@Module({ dynamic: true, store, name: 'cuser' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public menus: any[] = []
  public email = ''
  public userId = ''
  public userNo = ''
  public userType = ''
  public roles = ''
  public shopId = ''
  public shopName = ''
  public shops = []
  public shopType = 0

  @Mutation
  SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  SET_SHOP_TYPE(type: number) {
    this.shopType = type
  }

  @Mutation
  SET_USERID(userId: string) {
    this.userId = userId
  }

  @Mutation
  SET_USERNO(userNo: string) {
    this.userNo = userNo
  }

  @Mutation
  SET_USERTYPE(userType: string) {
    this.userType = userType
  }

  @Mutation
  SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  SET_MENUS(menus: any) {
    this.menus = menus
  }

  @Mutation
  SET_EMAIL(email: string) {
    this.email = email
  }

  @Mutation
  SET_SHOP_ID(id: string) {
    this.shopId = id
  }

  @Mutation
  SET_SHOP_NAME(shopName: string) {
    this.shopName = shopName
  }

  @Mutation
  SET_SHOPS(shops: any) {
    this.shops = shops
  }

  @Action
  public async Login(userInfo: {
    account: any
    password: string
    code: string
  }) {
    const data: any = await AccountApi.login(
      userInfo.account.trim(),
      userInfo.password.trim(),
      userInfo.code
    )
    // setToken("token")
    // this.SET_TOKEN("token")
    this.SET_NAME(data.name)
    this.SET_USERID(data.id)
    return data
  }

  @Action({ rawError: true })
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_MENUS([])
  }

  @Action({ rawError: true })
  public async GetUserInfo() {
    if (this.userId !== '') return true
    const user = await AccountApi.getCurrentAccount()
    if (user) {
      this.SET_NAME(user.name)
      this.SET_USERID(user.id)
      this.SET_USERNO(user.phone)
      this.SET_USERTYPE(user.type)
      this.SET_SHOP_ID(user.shopId)
      this.SET_SHOP_NAME(user.shopName)
      this.SET_SHOPS(user.shops)
      this.SET_SHOP_TYPE(user.shopType)
    } else {
      return false
    }
    const menus = await AccountApi.getMenus(1)
    if (!menus) {
      throw Error('用户验证失败，请重新登录')
    }
    this.SET_MENUS(menus)
    PermissionModule.GenerateRoutes(getFlatMenus(this.menus))
    return true
  }

  @Action({ rawError: true })
  public async LogOut() {
    await AccountApi.logout()
    removeToken()
    resetRouter()
    this.SET_TOKEN('')
    this.SET_MENUS([])
    window.location.href = process.env.VUE_APP_BASE_API as string
  }

  @Action({ rawError: true })
  public async SwitchShop(shopId: any) {
    // await AccountApi.switchShop(shopId)
    // window.location.href = process.env.VUE_APP_BASE_API as string
  }

  @Action
  public async modifyMyPassword(data: any) {
    await AccountApi.modifyMyPassword(data.oldPassword, data.newPassword)
  }
}

function getFlatMenus(menus: any[]): any[] {
  let result: any[] = []

  for (const menu of menus) {
    result.push(menu)
    if (menu.subMenus) {
      result = result.concat(menu.subMenus)
    }
  }
  return result
}

export const UserModule = getModule(User)
