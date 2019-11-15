import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home'
import Layout from '../views/layout'
import Login from '../views/login'
import Home from '@/views/home'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  {
    path: '/',
    // name: 'home',
    component: Layout,
    children: [
      {
        // 首页
        path: '',
        component: Home
      }
    ]
  },
  {
    // 一级路由登录页
    path: '/login',
    component: Login
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
