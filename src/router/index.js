import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/view/layout/Layout'
import managerRouter from './modules/manager'
import chargeRouter from './modules/charge'
import newsRouter from './modules/news'
import statisticsRouter from './modules/statistics'
import readonlyRouter from './modules/readonly'
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/view/login/index'),
    hidden: true,
    meta: {
      title: '登录'
    }
  },  
  {
    path: '/console',
    component: Layout,
    redirect: 'console',
    children: [
      {
        path: '/console',
        component: () => import('@/view/dashboard/index'),
        meta: {
          title: '控制台'
        }
      }
    ]
  },  
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/view/errorPage/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/view/errorPage/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  managerRouter,
  chargeRouter,
  newsRouter,
  statisticsRouter,
  readonlyRouter
]
const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export const asyncRouterMap = [
  managerRouter,
  chargeRouter,
  newsRouter,
  statisticsRouter,
  readonlyRouter]
  
export default router