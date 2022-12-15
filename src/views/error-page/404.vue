<template>
  <div class="page">
    <div class="statu_box">
      <img
        class="statu_logo"
        :src="require('@/assets/images/status/404.png')"
        alt
      />
      <div class="statu_info">
        <div class="statu_code primary--text text--lighten-3">404</div>
        <div class="tips_strong">抱歉，找不到页面</div>
        <div class="tips_sub">此处空空如也，啥也没有~</div>
        <v-btn class="home_btn" color="primary" outlined @click="goHome"
        >回首页</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'Page404'
})
export default class extends Vue {
  goHome() {
    location.href = process.env.VUE_APP_BASE_API as string
  }
}
</script>
<style lang="scss" scope>
@import './error.scss';
</style>
