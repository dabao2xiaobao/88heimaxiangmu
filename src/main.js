import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import axios from 'axios'
import 'nprogress/nprogress.css'
import JSONbig from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'

axios.defaults.transformResponse = [function (data, headers) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    console.log(err)
    return {}
  }
}]
// axios 请求拦截器
axios.interceptors.request.use(function (config) {
  // 在请求拦截器函数中的 config 是本次请求相关的配置对象
  // config 就是最后要发给后端的那个配置对象
  // 我们可以在拦截器中对 config 进行统一配置定制
  console.log('请求拦截器', config)

  const token = window.localStorage.getItem('user-token')

  // 统一添加 token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // return config 是通行的规则
  return config
}, function (error) {
  return Promise.reject(error)
})

// axios 响应拦截器
axios.interceptors.response.use(function (response) {
  console.log('响应拦截器', response)
  return response
}, function (error) {
  return Promise.reject(error)
})
Vue.prototype.$axios = axios // 共享axios所有实例上使用
Vue.use(ElementUI, {
  // 项目中所有拥有 size 属性的组件的默认尺寸均为 'small'
  size: 'small'
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
