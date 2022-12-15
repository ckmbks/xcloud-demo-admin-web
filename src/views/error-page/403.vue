<template>
  <div class="page">
    <div class="statu_box">
      <img
        class="statu_logo"
        :src="require('@/assets/images/status/403.png')"
        alt
      />
      <div class="statu_info">
        <div class="statu_code primary--text text--lighten-3">403</div>
        <div class="tips_strong">那个…你暂时没有权限访问该页面</div>
        <div class="tips_sub">快去找管理员开启权限吧～</div>
        <v-btn class="home_btn" color="primary" outlined @click="goHome"
        >回首页</v-btn
        >
        <v-btn class="home_btn ml-3" color="primary" outlined @click="logout"
        >注销</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Page403'
})
export default class extends Vue {
  async logout() {
    await UserModule.LogOut()
  }

  goHome() {
    location.href = process.env.VUE_APP_BASE_API as string
  }
}
</script>
<style lang="scss" scope>
@import './error.scss';
</style>
