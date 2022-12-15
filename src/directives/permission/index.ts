import { DirectiveOptions } from 'vue'
import { UserModule } from '@/store/modules/user'

export const permission: DirectiveOptions = {
  inserted(el: any, binding) {
    if (!binding.value) {
      throw new Error('need binding values! Like v-permission="10001"')
    }
    // 如果是管理员，权限全部放开
    if (UserModule.admin) {
      return
    }
    if (!UserModule.menus.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
