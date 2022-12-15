<template>
  <v-sheet style="position: relative">
    <span
      class="v-badge__badge primary"
      style="bottom: calc(100% - 4px)"
      v-if="label !== ''"
    >
      <span v-if="isRequired" style="color: red" class="px-1">*</span>
      {{ label }}
    </span>
    <v-sheet outlined class="first">
      <v-sheet
        v-for="(sfile, index) in model"
        :key="index"
        class="d-flex child-flex second"
      >
        <v-hover v-slot="{ hover }">
          <v-sheet :elevation="hover ? 3 : 1">
            <v-img
              :aspect-ratio="16 / 16"
              height="100px"
              width="100px"
              :src="sfile + '?x-oss-process=image/resize,m_pad,h_100,w_100'"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
              <v-fade-transition>
                <v-overlay v-if="hover" absolute>
                  <v-btn
                    fab
                    x-small
                    color="primary"
                    @click.stop="previewImg(sfile, index)"
                  >
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="!disabled"
                    class="ml-2"
                    fab
                    x-small
                    color="error"
                    @click="delImg(sfile, index)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-overlay>
              </v-fade-transition>
            </v-img>
          </v-sheet>
        </v-hover>
      </v-sheet>
      <div v-if="!disabled">
        <label class="avatar-uploader" v-if="model.length < maxNum">
          <i class="el-upload avatar-uploader-icon">
            <v-icon>mdi-plus</v-icon>
          </i>
          <form ref="form">
            <v-file-input
              hide-details
              ref="upload"
              class="el-upload__input"
              accept="image/*"
              v-model="files"
              counter
              hide-input
              show-size
              truncate-length="15"
              prepend-icon="mdi-camera"
              @change="onselectFile"
            >
            </v-file-input>
          </form>
        </label>
      </div>
    </v-sheet>
  </v-sheet>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { uploadFile } from '@/api/componentsApi/upload'
import { isImage } from '@/utils/validate'
@Component({
  components: {}
})
export default class XImageUpload extends Vue {
  result: any = ''
  files: any = null
  @Prop({ default: 1 })
  maxNum!: number

  @Prop({ default: '' })
  label!: string

  @Prop({ default: false })
  disabled?: string

  @Prop()
  value?: string | string[]

  @Prop({ default: false })
  required?: boolean | string

  @Prop({ default: 2 })
  size?: number | string

  $refs!: {
    upload: any
    form: any
  }

  get isRequired() {
    return this.required === '' || this.required
  }

  get model() {
    if (!this.value) {
      return []
    }

    if (typeof this.value === 'string') return [this.value]
    return this.value
  }

  set model(val: string[]) {
    let input = this.value
    if (this.maxNum < 2) input = (val && val.length) > 0 ? val[0] : ''
    this.$emit('input', input)
  }

  imagePreviewUrl: any = []

  mounted() {}

  previewImg(item: any, index: number) {
    const ary = this.model.slice(index)
    const ary2 = this.model.slice(0, index)
    const newArr = ary.concat(ary2)
    this.imagePreviewUrl = newArr

    this.$viewerApi({
      images: this.imagePreviewUrl
    })
  }

  delImg(item: any, index: number) {
    const images = this.model
    images.splice(index, 1)
    this.model = images
    this.$forceUpdate()
  }

  async onselectFile() {
    if (!this.files) {
      return
    }
    const files = this.files
    const maxSize = Number(this.size)
    if (files) {
      if (files.size > maxSize * 1024 * 1024) {
        this.$error(`请上传小于${maxSize}M的图片~`)
        this.$refs.form.reset()
        return
      }
      if (!isImage(files.name)) {
        this.$error('请上传jpg、jpeg、gif、png、bmp格式的图片~')
        this.$refs.form.reset()
        return
      }
    }
    const formData = new window.FormData()
    formData.append('file', files)
    try {
      this.$loading('上传中，请稍等...')
      const res: any = await uploadFile(formData)
      this.result = res.downloadPath
      const images = this.model
      images.push(res.downloadPath)
      this.model = images
      this.files = null
    } finally {
      this.$loaded()
    }
  }
}
</script>
<style scoped>
.first {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  min-height: 100px;
  /* border: 1px solid rgba(119, 117, 117, 0.87);
   border-radius: 5px; */
}

.second {
  margin: 10px;
}

.el-upload__input {
  display: none;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 10px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.el-upload {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: none;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  color: #409eff;
}
</style>
