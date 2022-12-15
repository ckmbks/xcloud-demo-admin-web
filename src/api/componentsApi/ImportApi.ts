import request from '@/utils/request'
// 导入组件

export const importExcel = ( url:string, data: any, params?: any) =>
  request({
    headers:{
      'Content-Type': 'multipart/form-data'
    },
    url: url,
    method: 'post',
    data,
    params
  })

export const getErrorTipExcel = (url:any, params: any) =>
  request({
    headers:{
      'Content-Type': 'application/json'
    },
    url: url,
    method: 'post',
    params,
    responseType: 'blob'
  })
