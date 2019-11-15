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
// 开启进度条
import NProgress from 'nprogress'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
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
// 路由的拦截器 beforeEach 方法，该方法接收一个函数作为参数
// 参数1：to，表示去哪里的路由信息
// 参数2：from，表示来自哪里的路由信息
// 参数3：next，它是一个方法，用于路由放行
// 我们具体要做的就是：判断用户的登录状态，有就通过，没有就跳转到登录页。
router.beforeEach((to, from, next) => {
  // 开启顶部导航进度条特效
  NProgress.start()
  // 如果访问的是登录页面就直接放行
  if (to.path === '/login') {
    next()
    return
  }
  // 2. 非登录页面，校验登录状态

  // 2.1 获取用户 token
  const token = window.localStorage.getItem('user-token')
  // 判断是否有 token，有就通过
  if (token) {
    // 导航通过，放行，访问哪里就往哪里走
    next()
  } else {
    // 没有，就跳转到登录页
    next('/login') // 跳转到指定路由
    // 如果在登录页并且是非登陆状态访问非登录页面，这里手动的终止进度条,否则进度条不会停止
    NProgress.done()
  }
})
router.afterEach((to, from) => {
  // 结束顶部的进度条
  NProgress.done()
})
export default router
