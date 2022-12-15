import request from '@/utils/request'

export const getPage = (data: any) =>
  request({
    url: '/xclouddemoadminapi/user/search',
    method: 'post',
    data
  })

export const getById = (id: any) =>
  request({
    url: `/xclouddemoadminapi/user/get/${id}`,
    method: 'post'
  })

export const searchListByPhone = (phone: string) =>
  request({
    url: '/xclouddemoadminapi/user/searchListByPhone',
    method: 'post',
    params: { phone: phone }
  })

export const add = (data: any) =>
  request({
    url: '/xclouddemoadminapi/user/add',
    method: 'post',
    data
  })

export const update = (data: any) =>
  request({
    url: '/xclouddemoadminapi/user/update',
    method: 'post',
    data
  })

export const disable = (id: any) =>
  request({
    url: `/xclouddemoadminapi/user/disable/${id}`,
    method: 'post'
  })

export const enable = (id: any) =>
  request({
    url: `/xclouddemoadminapi/user/enable/${id}`,
    method: 'post'
  })


export const exportExcel = (data: any) =>
  request({
    url: '/xclouddemoadminapi/user/exportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
  })
