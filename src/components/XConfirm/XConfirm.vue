<template>
  <transition name="message-fade">
    <v-dialog ref="dialog" width="420" v-model="isShow" persistent>
      <v-card>
        <v-toolbar dense :elevation="0">
          {{ config.title || '提示' }}
          <v-spacer />
          <v-icon size="16" @click="clickCancel">mdi-close</v-icon>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <v-row style="flex-wrap: nowrap" align="center">
            <v-icon color="warning" size="48">mdi-alert-circle </v-icon>
            <v-spacer class="ml-1">
              {{ config.content }}
            </v-spacer>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-toolbar dense :elevation="0" class="bt">
          <v-spacer />
          <v-btn outlined color="primary" @click="clickCancel">取消</v-btn>
          <v-btn color="primary" class="ml-4" @click="clickConfirm">
            确定
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-dialog>
  </transition>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator'
import XDialog from '@/components/XDialog.vue'
import ConfirmConfig from '@/components/XConfirm/ConfirmConfig'

@Component({
  components: { XDialog }
})
export default class XConfirm extends Vue {
  @PropSync('syncIsShow', { default: true })
  isShow?: boolean

  @Prop()
  config!: ConfirmConfig

  async clickConfirm() {
    this.isShow = false
    if (this.config.confirm)
      await this.$loading(
        '请稍等...',
        () =>
          new Promise((resolve, reject) => {
            resolve(this.config.confirm())
          })
      )
  }

  async clickCancel() {
    if (this.config.cancel) this.config.cancel()

    this.isShow = false
  }
}
</script>
<style lang="scss" scope="this api replaced by slot-scope in 2.5.0+"></style>
