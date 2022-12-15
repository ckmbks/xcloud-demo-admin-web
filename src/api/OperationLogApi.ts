import request from '@/utils/request'

export default {
  getTypes(): any {
    return request({
      url: '/xclouddemoadminapi/operationLog/getTypes',
      method: 'post'
    })
  },
  page(data: any): any {
    return request({
      url: '/xclouddemoadminapi/operationLog/search',
      method: 'post',
      data
    })
  },
  exportExcel(data: any): any {
    return request({
      url: `/xclouddemoadminapi/operationLog/exportExcel`,
      method: 'post',
      data,
      responseType: 'blob'
    })
  }
}
