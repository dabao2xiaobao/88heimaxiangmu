import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home'
import Layout from '@/views/layout'
import Login from '@/views/login'
import Home from '@/views/home'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
import Image from '@/views/image'
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
      },
      {
        path: '/article',
        component: Article
      },
      {
        path: '/publish',
        component: Publish
      },
      {
        path: '/comment',
        component: Comment
      },
      {
        path: '/image',
        component: Image
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
