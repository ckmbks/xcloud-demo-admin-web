const express = require('express')
const app = express()
const path = require('path')
const history = require('connect-history-api-fallback')
app.use(history())

// const proxyIp = 'http://test.uiinee.com.cn'
// const httpProxy = require('http-proxy-middleware')
// const proxy = {
//   '/xclouddemoadminapi': {
//     target: proxyIp,
//     changeOrigin: true,
//     ws: true
//   }
// }
// for (const key in proxy) {
//   app.use(key, httpProxy.createProxyMiddleware(proxy[key]))
// }
const options = { maxAge: 31536000 } // 缓存365天

app.use('/xclouddemoadmin', express.static(path.join(__dirname, 'dist'), options))
app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'dist/tinymce'), options)
)
app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(11001)
console.log('app start!')
