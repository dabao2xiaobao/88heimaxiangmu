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
