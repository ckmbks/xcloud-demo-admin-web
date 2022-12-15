<template>
  <v-sheet style="position: relative">
    <span class="v-badge__badge primary" style="bottom: calc(100% - 4px)">
      <span v-if="isRequired" style="color: red" class="px-1">*</span>
      {{ label }}
    </span>
    <v-sheet outlined style="padding: 0px 5px; height: 50px; line-height: 50px">
      <div>
        <label class="avatar-uploader" v-if="model.length < maxNum">
          <i class="el-upload">
            <v-icon>mdi-camera</v-icon>
          </i>
          <form ref="form">
            <v-file-input
              hide-details
              ref="upload"
              class="el-upload__input"
              v-model="files"
              accept="video/*"
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
      <v-chip
        v-for="(sfile, index) in model"
        :key="index"
        outlined
        :close="true"
        @click:close="delTag(sfile, index)"
      >
        <a :href="sfile">{{ sfile }}</a>
      </v-chip>
    </v-sheet>
  </v-sheet>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { uploadFile } from '@/api/componentsApi/upload'
import { isVideo } from '@/utils/validate'
@Component({
  components: {}
})
export default class XUpload extends Vue {
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

  delTag(item: any, index: number) {
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
    if (files) {
      if (files.size > 1024 * 500 * 1024) {
        this.$error('请上传小于500M的视频~')
        this.$refs.form.reset()
        return
      }
      if (!isVideo(files.name)) {
        this.$error(
          '请上传MPEG、AVI、nAVI、ASF、MOV、3GP、WMV、DivX、XviD、RM、RMVB、MP4格式的图片~'
        )
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
      const _files = this.model
      _files.push(res.downloadPath)
      this.model = _files
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
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
