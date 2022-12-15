<template>
  <v-sheet class="x_image_upload">
    <v-file-input
      :label="label"
      :dense="dense"
      :disabled="disabled"
      :clearable="clearable"
      :color="readonly ? 'grey' : ''"
      v-model="files"
      class="pb-0"
      outlined
      :rules="getRules"
      :accept="type === 'image' ? 'image/*' : ''"
      ref="fileInput"
      prepend-icon=""
      :append-icon="type === 'image' ? 'mdi-camera' : 'mdi-paperclip'"
      @change="onselectFile"
    >
      <template v-slot:prepend-inner>
        <span
          v-if="!disabled && !readonly && required"
          class="require-star lh-30"
          >*</span
        >
        <slot name="prepend-inner" />
      </template>
    </v-file-input>
    <!--    <span v-if="type == 'image'">（只能上传小于2M图片）</span>-->
    <slot v-if="type === 'image'" name="preview" :url="result"></slot>
    <v-sheet
      outlined
      class="preview"
      :style="'justify-content:' + align"
      v-if="type === 'image' && !$scopedSlots.preview && result !== ''"
    >
      <img
        class="preview_img"
        :style="'width:' + previewWidth"
        v-if="result"
        :src="result"
        alt=""
      />
      <div class="preview_ctrl_box" :style="'width:' + previewWidth">
        <v-icon @click="pvTap()">mdi-eye-outline</v-icon>
        <v-icon v-if="!disabled" @click="delTap">mdi-delete-outline</v-icon>
      </div>
    </v-sheet>
    <x-image-preview
      :src="value"
      :sync-is-show.sync="imagePreviewShow"
    ></x-image-preview>
  </v-sheet>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { uploadFile } from '@/api/componentsApi/upload'
import { isImage } from '@/utils/validate'
import { ValidateRules } from '@/utils/ValidateRules'
import XImagePreview from '@/components/XImagePreview.vue'

@Component({
  components: { XImagePreview }
})
export default class XFileUpload extends Vue {
  @Prop({ default: 'file' })
  type?: string

  @Prop({ default: '' })
  valueText?: string

  @Prop({ default: 'downloadPath' })
  urlKey?: string

  @Prop({ default: '100%' })
  previewWidth?: string

  @Prop({ default: 'center' })
  previewAlign?: string

  imagePreviewShow: boolean = false

  get align() {
    let align = 'center'
    switch (this.previewAlign) {
      case 'left':
        align = 'flex-start'
        break
      case 'right':
        align = 'flex-end'
        break
      default:
        break
    }
    return align
  }

  @Prop({ default: '' })
  label?: string

  @Prop({ default: true })
  dense?: boolean

  @Prop({ default: false })
  disabled?: boolean

  @Prop({ default: false })
  clearable?: boolean

  @Prop({ default: false })
  readonly?: boolean

  @Prop({ default: false })
  required?: boolean

  @Prop({ default: () => [] })
  rules: any

  @Prop()
  value: any

  @Prop({ default: '' })
  defaultImg?: string // 编辑时，默认的图片地址

  @Watch('value')
  valueChange(val: any) {
    if (this.type === 'image') {
      if (typeof val === 'string') {
        this.result = val
      } else if (typeof val === 'object') {
        const urlKey: any = this.urlKey || 'downloadPath'
        if (typeof val[urlKey] === 'string') this.result = val[urlKey]
      }
    }
  }

  validateRules: any = ValidateRules
  files: any = null

  // 上传图片
  result: any = ''

  // get slot() {
  //   let s = this.$slots;
  //   return s;
  // }
  get getRules() {
    return this.required
      ? [this.validateRules.required, ...this.rules]
      : this.rules
  }

  pvTap() {
    this.imagePreviewShow = true
  }

  delTap() {
    this.$confirm({
      content: '确认删除该照片?',
      confirm: async () => {
        this.result = ''
      }
    })
  }

  created() {
    if (this.defaultImg) this.result = this.defaultImg
  }

  get fileInput() {
    const e: any = this.$refs.fileInput
    return e
  }

  selectFile() {
    this.fileInput.dispatchEvent(new MouseEvent('click'))
  }

  async onselectFile() {
    if (!this.files) {
      return
    }
    const filex = this.files
    const urlKey: any = this.urlKey || 'downloadPath'
    if (this.type === 'image') {
      if (filex) {
        if (filex.size > 1024 * 2 * 1024) {
          this.$error('请上传小于2M的图片~')
          return
        }
        if (!isImage(filex.name)) {
          this.$error('请上传jpg、jpeg、gif、png、bmp格式的图片~')
          return
        }
      }
    }
    const formData = new window.FormData()
    formData.append('file', filex)
    try {
      this.$loading('上传中，请稍等...')
      let res: any = await uploadFile(formData)
      if (this.type === 'image') {
        this.result = res[urlKey]
      }
      if (this.valueText) {
        res = res[this.valueText]
      }
      this.$emit('input', res[urlKey])
      this.$emit('change', res[urlKey])
    } finally {
      this.$loaded()
    }
  }
}
</script>
<style lang="scss" scope>
.text_box {
  height: 45px;
  line-height: 45px;
  overflow: hidden;
}
.preview {
  position: relative;
  width: 100%;
  padding-top: 50%;
  // display: flex;
  // justify-content: center;
  > .preview_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  > .preview_ctrl_box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba($color: #fff, $alpha: 0.7);
    display: flex;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    padding: 0 10%;
    opacity: 0;

    &:hover {
      opacity: 1;
    }

    transition: all 0.5s;

    > .v-icon {
      width: 40px;
      height: 40px;
      color: #000;
      display: block;
      font-size: 40px !important;
    }
  }
}
</style>
<style lang="scss">
.x_image_upload .v-text-field__details {
  display: none;
}
</style>
