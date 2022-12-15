import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import i18n from '@/i18n'
import '@/assets/styles/vuetify/overrides.sass'
import '@/assets/styles/vuetify/common.sass'
import zhHans from 'vuetify/src/locale/zh-Hans'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify)

Vue.use(Vuetify)

const theme = {
  primary: '#089DAD',
  secondary: '#ffb317',
  accent: '#82B1FF',
  error: '#BB1C2C',
  info: '#1078F5',
  success: '#4ECD79',
  warning: '#FD9523'
}
export default new Vuetify({
  lang: {
    locales: { zhHans },
    current: 'zhHans'
  },
  theme: {
    themes: {
      dark: theme,
      light: theme
    }
  },
  icons: {
    iconfont: 'mdi' // 默认值 - 仅用于展示目的
  }
})
