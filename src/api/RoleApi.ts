import request from '@/utils/request'

export const getPage = (data: any) =>
  request({
    url: '/xclouddemoadminapi/role/search',
    method: 'post',
    data
  })

export const getById = (id: any) =>
  request({
    url: `/xclouddemoadminapi/role/get/${id}`,
    method: 'post'
  })

export const getOptionList = (): any =>
  request({
    url: '/xclouddemoadminapi/role/getOptionList',
    method: 'post'
  })

export const add = (data: any) =>
  request({
    url: '/xclouddemoadminapi/role/add',
    method: 'post',
    data
  })

export const update = (data: any) =>
  request({
    url: '/xclouddemoadminapi/role/update',
    method: 'post',
    data
  })

export const del = (id: any) =>
  request({
    url: `/xclouddemoadminapi/role/delete/${id}`,
    method: 'post'
  })

export const disable = (id: any) =>
  request({
    url: `/xclouddemoadminapi/role/disable/${id}`,
    method: 'post'
  })

export const enable = (id: any) =>
  request({
    url: `/xclouddemoadminapi/role/enable/${id}`,
    method: 'post'
  })

export const exportExcel = (data: any) =>
  request({
    url: '/xclouddemoadminapi/role/exportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })

export const getSystemMenus = (): Promise<Record<string, any>> =>
  request({
    url: '/xclouddemoadminapi/role/getSystemMenus',
    method: 'post'
  })

export const getAllOfRelation = () =>
  request({
    url: '/xclouddemoadminapi/patientsource/getAllOfRelation',
    method: 'post'
  })
