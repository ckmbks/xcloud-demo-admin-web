<template>
  <v-card flat class="ma-6 pa-6">
    <v-tabs class="sv_tabs mb-3" v-model="tab">
      <v-tab>加载提示</v-tab>
      <v-tab>toast消息提示</v-tab>
      <v-tab>弹窗</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="pa-4">
      <v-tab-item>
        <v-row>
          <pre>
          this.$loading()
          this.$loaded()
        </pre
          >
        </v-row>
        <v-row>
          <v-btn depressed class="mx-2" color="secondary" @click="loading"
            >Loading</v-btn
          >
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row>
          <pre>
          this.$info("成功")
          this.$warn("警告")
          this.$error("失败")
          this.info("信息")
        </pre
          >
        </v-row>
        <v-row>
          <v-btn depressed class="mx-2" color="success" @click="success"
            >成功</v-btn
          >
          <v-btn depressed class="mx-2" color="warning" @click="warn"
            >警告</v-btn
          >
          <v-btn depressed class="mx-2" color="error" @click="error"
            >失败</v-btn
          >
          <v-btn depressed class="mx-2" color="info" @click="info">信息</v-btn>
          <v-btn depressed class="mx-2" color="accent" @click="def">默认</v-btn>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row>
          <pre>
          this.$confirm({
            content: "确认弹窗",
            confirm: () => {},
            cancel: () => {}
          })
        </pre
          >
        </v-row>
        <v-row>
          <v-btn depressed class="mx-2" color="secondary" @click="confirm"
            >confirm弹窗</v-btn
          >
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class Plugins extends Vue {
  tab: any = 0
  loading() {
    this.$loading()
    setTimeout(() => {
      this.$loaded()
    }, 3000)
  }

  success() {
    this.$info('成功')
  }

  warn() {
    this.$warn('警告')
  }

  error() {
    this.$error('失败')
  }

  info() {
    this.$info('信息')
  }

  def() {
    this.$info('默认')
  }

  confirm() {
    this.$confirm({
      content: '确认弹窗',
      confirm: async () => {},
      cancel: () => {}
    })
  }
}
</script>
<style lang="scss">
@import '~@/assets/styles/global.scss';
</style>
