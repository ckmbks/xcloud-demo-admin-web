// Polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import router, { asyncRoutesTree } from '@/router'
import App from '@/App.vue'
import Vue, { DirectiveOptions } from 'vue'
import 'normalize.css'
import SvgIcon from 'vue-svgicon'

import Croppa from 'vue-croppa'
import $croppa from '@/components/Croppa/croppa'
// 拖拽插件
import moment from 'moment'
import VueClipboard from 'vue-clipboard2'
import store from '@/store'
// import '@/mock'
// import { AppModule } from '@/store/modules/app'
import '@/permission'
import * as directives from '@/directives'
import * as filters from '@/filters'
import vuetify from './plugins/vuetify'
import XDatetimePicker from './components/XDatetimePicker.vue'
import XDatePicker from './components/XDatePicker.vue'
import XTimePicker from './components/XTimePicker.vue'
import XTableView from './components/table/XTableView.vue'
import XCardListView from './components/XCardList/XCardListView.vue'
import XPage from './components/XPage.vue'
import XNumber from './components/XNumber.vue'
import XSelect from './components/XSelect.vue'
import XTextField from './components/XTextField.vue'
import XTextarea from './components/XTextarea.vue'
import XFilter from './components/XFilter/XFilter.vue'
import XFilterItem from './components/XFilter/XFilterItem.vue'
import XFileUpload from './components/XFileUpload.vue'
import XAutocomplete from './components/XAutocomplete.vue'
import XMultipleSelector from './components/XMultipleSelector.vue'
import XConfirm from './components/XConfirm/XConfirm.vue'
import XDialog from './components/XDialog.vue'
import XImportDialog from './components/XImportDialog.vue'
import XQrcode from './components/XQrcode.vue'
import XEditor from './components/tinymce/XEditor.vue'
import XMenuBtn from './components/XMenuBtn.vue'
// 引入这个是为了解决有时候图标展示不正常，可以先注释了尝试一下
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueQriously from 'vue-qriously'
import ConfirmConfig from '@/components/XConfirm/ConfirmConfig'
import XCombobox from '@/components/XCombobox.vue'
import XPasswordField from '@/components/XPasswordField.vue'
import XCascade from '@/components/XCascade.vue'
import XArea from '@/components/XArea.vue'
import XDatePickerRange from '@/components/XDatePickerRange.vue'
import XImageUpload from '@/components/XImageUpload.vue'
import VDetail from '@/components/VDetail.vue'
import XCascader from '@/components/XCascader/XCascader.vue'
import XImagePreview from '@/components/XImagePreview.vue'
import XUpload from '@/components/XUpload.vue'
import VText from '@/components/VText.vue'
import Print from 'vue-print-nb'
import XImg from '@/components/XImg.vue'
// 图片预览
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Vue.use(Print)
Vue.use(VueQriously) // 前端生成二维码
Vue.use(VueClipboard) // 剪切板
Vue.use(Croppa)
Vue.use($croppa)

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-unused-vars
  interface Vue {
    $info: (message: string, timeout?: number) => {}
    $warn: (message: string, timeout?: number) => {}
    $error: (message: string, timeout?: number) => {}
    $confirm: (config: ConfirmConfig) => {}
    $loading: (message?: string, event?: () => Promise<any>) => Promise<any>
    $loaded: () => {}
  }
}

Vue.component('x-qrcode', XQrcode)
Vue.component('x-import-dialog', XImportDialog)
Vue.component('x-file-upload', XFileUpload)
Vue.component('x-confirm', XConfirm)
Vue.component('x-dialog', XDialog)
Vue.component('x-page', XPage)
Vue.component('x-multiple-selector', XMultipleSelector)
Vue.component('x-autocomplete', XAutocomplete)
Vue.component('x-filter', XFilter)
Vue.component('x-filter-item', XFilterItem)
Vue.component('x-datetime-picker', XDatetimePicker)
Vue.component('x-date-picker', XDatePicker)
Vue.component('x-date-picker-range', XDatePickerRange)
Vue.component('x-time-picker', XTimePicker)
Vue.component('x-cascade', XCascade)
Vue.component('x-area', XArea)
Vue.component('x-table-view', XTableView)
Vue.component('x-card-list-view', XCardListView)
Vue.component('x-number', XNumber)
Vue.component('x-select', XSelect)
Vue.component('x-combobox', XCombobox)
Vue.component('x-text-field', XTextField)
Vue.component('x-password-field', XPasswordField)
Vue.component('x-textarea', XTextarea)
Vue.component('x-editor', XEditor)
Vue.component('x-menu-btn', XMenuBtn)
Vue.component('x-image-upload', XImageUpload)
Vue.component('x-image-preview', XImagePreview)
Vue.component('x-upload', XUpload)
Vue.component('v-detail', VDetail)
Vue.component('x-cascader', XCascader)
Vue.component('v-text', VText)
Vue.component('x-img', XImg)

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// 中文简体
moment.locale('zh-cn')
Vue.filter(
  'dateformat',
  (dataStr: any, pattern: string = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(dataStr).format(pattern)
  }
)

// Register global directives
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach((key) => {
  Vue.filter(key, (filters as { [key: string]: Function })[key])
})

Vue.config.productionTip = false
export const eventBus = new Vue()
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')

// 检测路由配置是否有错误
if (process.env.NODE_ENV === 'development') {
  asyncRoutesTree()
}
