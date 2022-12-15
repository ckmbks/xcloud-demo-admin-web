import request from '@/utils/request'

// 新增字典小类
export const add = (data:any) =>
request({
  url: '/xclouddemoadminapi/dict/add',
  method: 'post',
  data
})
// 查询字典大类列表
export const getAllDictType = () =>
request({
  url: '/xclouddemoadminapi/dict/getAllDictType',
  method: 'post'
})
// 条件分页查询字典小类
export const getPage = (data:any) =>
request({
  url: '/xclouddemoadminapi/dict/search',
  method: 'post',
  data
})

// 编辑字典小类
export const update = (data:any) =>
request({
  url: '/xclouddemoadminapi/dict/update',
  method: 'post',
  data
})

// / 编辑字典状态
export const updateStatus = (data:any) =>
request({
  url: '/xclouddemoadminapi/dict/updateStatus',
  method: 'post',
  data
})



