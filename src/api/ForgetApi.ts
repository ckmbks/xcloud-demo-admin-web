import request from '@/utils/request'

export const getImageCaptcha12 = (): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/account/getImageCaptcha',
    method: 'post',
  })


export const login12 = (account: string, password: string, captcha: string): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/account/login',
    method: 'post',
    params: { account, password, captcha }
  })
// 获取手机验证码
  export const getCaptchaByPhone = (data: any) =>
  request({
    url: '/xclouddemoadminapi/account/getCaptchaByPhone',
    method: 'post',
    params:{ phone : data}
  })
// 设置新密码
  export const updatePassword = (phone : any , password1 : any , password2 : any ) =>
  request({
    url: '/xclouddemoadminapi/account/updatePassword',
    method: 'post',
    params:{ phone: phone, confirmPassword: password1, newPassword: password2}
  })
// 身份验证
  export const authentication = (phone: string, code: string) =>
  request({
    url: '/xclouddemoadminapi/account/authentication',
    method: 'post',
    params:{ phone: phone , code: code}
  })




  
 
