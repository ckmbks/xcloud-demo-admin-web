<template>
  <v-app id="app">
    <router-view />
    <x-confirm
      v-if="isShowConfirmDialog"
      :sync-is-show.sync="isShowConfirmDialog"
      :config="confirmConfig"
    ></x-confirm>
    <x-snackbar
      v-if="isShowSnackbar"
      :sync-is-show.sync="isShowSnackbar"
      :config="snackbarConfig"
    ></x-snackbar>
    <x-loading
      v-if="isShowLoading"
      :sync-is-show.sync="isShowLoading"
      :message="loadingMessage"
    ></x-loading>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ConfirmConfig from '@/components/XConfirm/ConfirmConfig'
import XConfirm from '@/components/XConfirm/XConfirm.vue'
import XSnackbar from '@/components/Message/XSnackbar.vue'
import SnackbarConfig, {
  SnackbarType
} from '@/components/Message/SnackbarConfig'
import XLoading from '@/components/XLoading/XLoading.vue'

@Component({
  name: 'App',
  components: {
    XSnackbar,
    XConfirm,
    XLoading
  }
})
export default class extends Vue {
  mounted() {
    Vue.prototype.$confirm = this.confirm
    Vue.prototype.$info = this.info
    Vue.prototype.$warn = this.warn
    Vue.prototype.$error = this.error
    Vue.prototype.$loading = this.loading
    Vue.prototype.$loaded = this.loaded
  }

  isShowLoading = false
  loadingMessage = '请稍等...'

  public async loading(message?: string, event?: () => Promise<any>) {
    this.loadingMessage = !message ? '请稍等...' : message
    this.isShowLoading = true
    if (event) {
      try {
        await event()
      } finally {
        this.loaded()
      }
    }
  }

  public loaded() {
    this.isShowLoading = false
  }

  isShowConfirmDialog = false
  confirmConfig: ConfirmConfig = {
    alert: false,
    title: '',
    content: '',
    confirm: async () => {},
    cancel: async () => {}
  }

  public confirm(config: ConfirmConfig) {
    this.isShowConfirmDialog = true
    this.confirmConfig.title = config.title
    this.confirmConfig.confirm = config.confirm.bind(this)
    if (config.content) this.confirmConfig.content = config.content
    if (config.alert) this.confirmConfig.alert = config.alert
    if (config.cancel) this.confirmConfig.cancel = config.cancel.bind(this)
  }

  isShowSnackbar = false
  snackbarConfig: SnackbarConfig = {
    message: '',
    type: SnackbarType.INFO,
    timeout: 3000
  }

  public async info(message: string, timeout?: number) {
    await this.toast(SnackbarType.INFO, message, timeout)
    this.isShowSnackbar = true
  }

  public async warn(message: string, timeout?: number) {
    await this.toast(SnackbarType.WARN, message, timeout)
    this.isShowSnackbar = true
  }

  public async error(message: string, timeout?: number) {
    // await 避免连续提示的时候，timeout不会延长
    await this.toast(SnackbarType.ERROR, message, timeout)
    this.isShowSnackbar = true
  }

  toast(type: SnackbarType, message: string, timeout?: number) {
    this.isShowSnackbar = false
    this.snackbarConfig.type = type
    this.snackbarConfig.message = message
    this.snackbarConfig.timeout = !timeout ? 3000 : timeout
  }
}
</script>
<style lang="scss">
@import './assets/styles/global.scss';
// 修改滚动条宽度
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
// 修改 滚动条的 下面 的 样式
::-webkit-scrollbar-track {
  background-color: #fafafa;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
// 修改 滑块
::-webkit-scrollbar-thumb {
  background-color: #ddd;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.ctrl_box {
  min-height: 60px;
  line-height: 60px;
  display: flex;
  justify-content: space-between;

  > .right {
    button {
      margin-left: 10px;
    }
  }
}

.theme--light.v-select .v-select__selection--disabled {
  color: rgba(0, 0, 0, 0.87);
}

.xchs_p1 {
  font-size: 16px;
}

.xchs_p2 {
  font-size: 14px;
}

.xchs_p3 {
  font-size: 12px;
}

.xchs_weight {
  color: $text_weight;

  &.xchs_border {
    text-shadow: 0.3px 0px 0px $text_weight;
  }
}

.xchs_light {
  color: $text_light;

  &.xchs_border {
    text-shadow: 0.3px 0px 0px $text_light;
  }
}

.hide_scroll {
  &.deep *::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

.v-application--is-ltr
  .v-textarea.v-text-field--enclosed
  .v-text-field__slot
  textarea {
  margin-right: 2px;
  margin-bottom: 2px;
}

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  background: center none;
  background-size: contain;
  margin: 0 0.2em;

  &.i_add {
    background-image: url('./assets/images/icon_add.png');
  }

  &.i_down {
    background-image: url('./assets/images/icon_leading.png');
  }

  &.i_up {
    background-image: url('./assets/images/icon_up.png');
  }

  &.i_exchange {
    background-image: url('./assets/images/icon_distribute.png');
  }

  &.i_sta {
    background-image: url('./assets/images/icon_sta.png');
  }
  &.i_shaoma {
    background-image: url('./assets/images/icon_shaoma.png');
  }
}
.v-messages__message {
  line-height: 16px !important;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
</style>
