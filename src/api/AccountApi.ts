import request from '@/utils/request'

export const getImageCaptcha = (): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/account/getImageCaptcha',
    method: 'post'
  })

export const login = (account: string, password: string, captcha: string): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/account/login',
    method: 'post',
    data: { account, password, captcha }
  })

export const adminLogin = (): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/account/adminLogin',
    method: 'post'
  })

export const logout = (): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/account/logout',
    method: 'post'
  })

// 修改密码
export const modifyMyPassword = (oldPassword: string, newPassword: string): any =>
  request({
    url: '/xclouddemoadminapi/account/modifyMyPassword',
    method: 'post',
    data: { oldPassword: oldPassword, newPassword: newPassword }
  })

export const getCurrentAccount = (): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/account/getCurrentAccount',
    method: 'post'
  })

export const getMenus = (systemId: number): Promise<Record<string, any>> =>
  request({
    url: `/xclouddemoadminapi/account/getMenuList`,
    method: 'post',
    params: { systemId }
  })
export const getRoleMenuList = (): Promise<Record<string, any>> =>
  request({
    url: `/xclouddemoadminapi/account/getRoleMenuList`,
    method: 'post'
  })
