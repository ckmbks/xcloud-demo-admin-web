import { AxiosResponse } from "axios";

/**
 * 导出文件
 * 参数 response导出的文件内容 name:导出的文件名称
 */
export const getExportFields = (headers: any[]) => {
  const result: any[] = []
  headers.forEach(header => {
    if (header.value != undefined && header.value != "ctrl" && header.exportable != false)
      result.push(header.value)
  })
  return result
}

/**
 * 导出文件
 * 参数 response导出的文件内容
 */
export const downloadFile = async (that: Vue, exportRequest: (data: any) => any, requestParams: any) => {
  try {
    that.$loading();

    const response: AxiosResponse = await exportRequest(requestParams);
    const disposition: string = response.headers['content-disposition']
    if (disposition == undefined) {
      that.$error("导出失败，获取不到下载文件名")
      return
    }

    const fileName = disposition.replace("attachment;filename=", "")
    const elink = document.createElement('a')
    elink.download = decodeURIComponent(fileName)
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(response.data)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } finally {
    that.$loaded();
  }
}
/**
 * 导出文件
 * 参数 response导出的文件内容 name:导出的文件名称
 */
export const download = (blob: Blob, name: any) => {
  const fileName = name
  const elink = document.createElement('a')
  elink.download = fileName
  elink.style.display = 'none'
  elink.href = URL.createObjectURL(blob)
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href) // 释放URL 对象
  document.body.removeChild(elink)
}

/**
 * base64转文件对象
 *
 */
export const dataURLtoFile = (dataurl: any, filename: any) => {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * 获取裁剪图片
 *
 */
export const curPictureFun = (dataurl: string, size: string = '_400x800') => {
  let arr = dataurl.split(/(.png|.jpg|.gif|.jpeg|.bmp|.tif)$/)
  let newUrl = arr[0] + size + arr[1]
  return newUrl;
}
