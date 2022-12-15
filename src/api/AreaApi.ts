import request from '@/utils/request'

export default {
  geAll(): any {
    return request({
      url: '/xclouddemoadminapi/area/getAll',
      method: 'post'
    })
  }
}
