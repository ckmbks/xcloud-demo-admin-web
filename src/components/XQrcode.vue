<template>
  <div class="qr_box" ref="copyArea">
    <qriously ref="qr" class="qr_code" :value="value" :size="size" />
    <qriously
      ref="qr"
      :id="key"
      class="qr_code qr_hide"
      :value="value"
      :size="downLoadSize"
    />
    <v-row>
      <v-btn
        v-if="showDownload"
        width="100"
        color="primary"
        x-small
        depressed
        @click="download"
        >下载二维码</v-btn
      >
      <v-btn
        v-if="showCopy"
        class="ml-3"
        width="100"
        color="primary"
        x-small
        depressed
        @click="onCopy"
        >复制链接</v-btn
      >
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class XQrcode extends Vue {
  @Prop({ default: '二维码' }) fileName?: string
  @Prop({ default: true }) showDownload?: boolean
  @Prop({ default: false }) showCopy?: boolean
  @Prop({ default: '' }) value?: string
  @Prop({ default: 800 }) downLoadSize?: number
  @Prop({ default: 300 }) size?: number
  key: string = ''
  created() {
    this.key = 'qrcode_' + Math.round(Math.random() * Date.now())
  }

  onCopy() {
    const text = this.value || ''
    this.$copyText(text, this.$refs.copyArea).then(
      (e) => {
        this.$info('内容已复制到剪切板！')
      },
      (e) => {
        this.$error('复制失败！')
        console.log(e)
      }
    )
  }

  download() {
    const fileName = this.fileName || '二维码'
    const query = '#' + this.key + '>canvas'
    const canvas: any = document.querySelector(query)
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(
      0,
      0,
      this.downLoadSize,
      this.downLoadSize
    )
    for (let i = 0; i < imageData.data.length; i += 4) {
      // 当该像素是透明的，则设置成白色
      if (imageData.data[i + 3] === 0) {
        imageData.data[i] = 255
        imageData.data[i + 1] = 255
        imageData.data[i + 2] = 255
        imageData.data[i + 3] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)
    const imgUrl = canvas.toDataURL('image/png')
    if (window.navigator.msSaveOrOpenBlob) {
      const bstr = atob(imgUrl.split(',')[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      const blob = new Blob([u8arr])
      window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + 'png')
    } else {
      // 这里就按照chrome等新版浏览器来处理
      const a = document.createElement('a')
      a.href = imgUrl
      a.setAttribute('download', fileName)
      a.click()
    }
  }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+">
.qr_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.qr_hide {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
