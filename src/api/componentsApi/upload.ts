// 上传文件的接口
import request from '@/utils/request'
// 导入组件

export const uploadFile = (data:any) =>
  request({
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    url: '/xclouddemoadminapi/file/upload',
    method: 'post',
    data
  })

  /**
   * 删除单个文件
   * @param {string} url  文件路径
   */
  export const deleteFile = (url:string) =>
  request({
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    url: '/xclouddemoadminapi/files/removeFile',
    method: 'post',
    params: {
      url
    }
  })

/**
 * 删除多个文件
 * @param {string[]} data  文件路径 数组
 */
export const deleteFiles = (data:string[]) =>
request({
  url: '/xclouddemoadminapi/files/removeFiles',
  method: 'post',
  data
})
