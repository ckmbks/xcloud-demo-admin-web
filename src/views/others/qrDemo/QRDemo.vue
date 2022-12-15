<template>
  <v-card flat class="qr_box pb-10 ma-6">
    <x-qrcode class="ma-4" :fileName="fileName" :value="qrcode"></x-qrcode>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
})
export default class QRDemo extends Vue {
  key: string = ""
  fileName: string = "二维码"
  get qrcode() {
    let query: any = this.$route.query;
    this.key = query.key
    return `${location}`
  }
  onCopy() {
    this.$info("复制成功");
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.copy_btn {
  width: 150px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  // padding: 3 * $rpx 15 * $rpx;
  // margin-left: 10 * $rpx;
  color: $primary;
  border: 1px solid $primary;
  border-radius: 8px;
}
.qr_box {
  padding-top: 36px;
}
.qr_code {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin-bottom: 54px;
}
</style>
