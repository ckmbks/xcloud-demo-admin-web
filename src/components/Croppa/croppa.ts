import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import croppaComponent from './croppa.vue'

// 返回一个 扩展实例构造器
const CroppaConstructor = vue.extend(croppaComponent)

// 定义弹出组件的函数 接收2个参数, 要显示的文本 和 显示时间
const showCroppa = function (obj:any) {
  // 实例化一个 croppa.vue
  const croppaDom = new CroppaConstructor({
    el: document.createElement('div'),
    data () {
      return {
        file: obj.file || null,
        scale: obj.scale,
        width: parseInt(obj.width) || 300,
        height: parseInt(obj.height) || 300,
        minHeight: obj.minHeight && parseInt(obj.minHeight),
        minWidth: obj.minWidth && parseInt(obj.minWidth),
        acceptType: obj.acceptType || '',
        fileSizeLimit: obj.fileSizeLimit,
        outputType: obj.outputType,
        canNotGetFromAlbum:obj.canNotGetFromAlbum,
        isMobile: obj.isMobile
      }
    },
    methods: {
      sure: function (base64:any) {
        obj.sure && obj.sure(base64)
      },
      cancel: function () {
        obj.cancel && obj.cancel()
      }
    }
  })

  // 把 实例化的 croppa.vue 添加到 body 里
  document.body.appendChild(croppaDom.$el)
}

// 注册为全局组件的函数
const registryCroppa = {
  // 将组件注册到 vue 的 原型链里去,
  // 这样就可以在所有 vue 的实例里面使用 this.$croppa()
  install: (Vue:any, options:any) => {
    vue.prototype.$croppa = showCroppa;
  }
}

export default registryCroppa
