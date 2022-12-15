<template>
  <div class="tinymce-box">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
    ></editor>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import tinymce from 'tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/icons/default/icons.min.js'
import 'tinymce/themes/silver'
import { uploadFile } from '@/api/componentsApi/upload'

// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/link' // 链接
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/code' // 字数统计插件
import './plugin/uploadfile/index.js' // 自定义文件上传
import './plugin/lineheight/plugin.js' // 自定义文件上传

@Component({
  components: {
    Editor
  }
})
export default class XEditor extends Vue {
  @Prop({ default: '' }) value!: any
  @Prop({ default: false }) disabled?: boolean
  @Prop({
    default:
      'lists image code media table wordcount link uploader lineheight powerpaste'
  })
  plugins!: any

  @Prop({
    default:
      'undo redo |  formatselect | code | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify lineheight | bullist numlist outdent indent | lists uploader image media table | link unlink | removeformat | fontsizeselect | fontselect'
  })
  toolbar!: any

  @Prop({ default: 500 }) height!: string | number

  init: object = {
    relative_urls: false,
    remove_script_host: false,
    language_url: `${process.env.VUE_APP_BASE_API}/tinymce/langs/zh_CN.js`,
    language: 'zh_CN',
    skin_url: `${process.env.VUE_APP_BASE_API}/tinymce/skins/ui/oxide`,
    content_css: `${process.env.VUE_APP_BASE_API}/tinymce/skins/content/default/content.css`,
    // skin_url: 'tinymce/skins/ui/oxide-dark',//暗色系
    height: this.height,
    plugins: this.plugins,
    toolbar: this.toolbar,
    powerpaste_word_import: 'propmt', // 参数可以是propmt, merge, clear，效果自行切换对比
    powerpaste_html_import: 'propmt', // propmt, merge, clear
    powerpaste_allow_local_images: true,
    paste_data_images: true,
    external_plugins: {
      powerpaste: `${process.env.VUE_APP_BASE_API}/tinymce/plugins/powerpaste/plugin.min.js`
    },
    menu: {
      file: { title: 'File', items: 'newdocument' },
      edit: {
        title: 'Edit',
        items: 'undo redo | cut copy paste pastetext | selectall'
      },
      insert: {
        title: 'Insert',
        items: 'link | media image uploader inserttable | template hr'
      },
      view: { title: 'View', items: 'visualaid' },
      format: {
        title: 'Format',
        items:
          'bold italic underline strikethrough superscript subscript | formats | removeformat'
      },
      table: {
        title: 'Table',
        items: 'inserttable tableprops deletetable | cell row column'
      }
    },
    branding: false,
    menubar: 'file edit insert view format table uploader',
    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    upload_file_handler: (data: any, next: any) => {
      // 配置附件上传
      this.$loading('文件上传中，请稍等...')
      uploadFile(data).then((res: any) => {
        this.$loaded()
        if (res.downloadPath && res.originalFilename) {
          next(
            `<a class="mceUpload" href="${res.downloadPath}" target="_blank">附件:${res.originalFilename}</a>`
          )
        }
      })
    },
    images_upload_handler: (blobInfo: any, success: any, failure: any) => {
      this.$loading('图片上传中，请稍等...')
      const file = blobInfo.blob() // 这个blob是个FIle对象 不是单纯的blob
      const formData = new window.FormData()
      formData.append('file', file)
      uploadFile(formData).then((res: any) => {
        if (res.downloadPath) {
          success(res.downloadPath)
        }
        this.$loaded()
      })
    }
  }

  myValue: any = ''

  mounted() {
    this.myValue = this.value
    tinymce.init({})
  }

  // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
  // 需要什么事件可以自己增加
  onClick(e: any) {
    this.$emit('onClick', e, tinymce)
  }

  // 可以添加一些自己的自定义事件，如清空内容
  clear() {
    this.myValue = ''
  }

  @Watch('value')
  setNewValue(newValue: string) {
    this.myValue = newValue
  }

  @Watch('myValue')
  setDefaultValue(newValue: string) {
    this.$emit('input', newValue)
    this.$emit('change', newValue)
  }
}
</script>
