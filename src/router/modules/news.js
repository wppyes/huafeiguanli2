

import Layout from '@/view/layout/Layout'
const newsRouter = {
  path: '/news',
  component: Layout,
  alwaysShow: true,
  redirect: '/news/ncustomerpackage',
  name:'news',
  title: 'title',
  children: [
    {
      path: 'ncustomerpackage',
      component: () => import('@/view/news/ncustomerpackage'),
      meta: {
        title: '加款管理'
      }
    },
    {
      path: 'ncustomer',
      component: () => import('@/view/news/ncustomer'),
      meta: {
        title: '客户管理'
      }
    },
    {
      path: 'nchannelsetting',
      component: () => import('@/view/news/nchannelsetting'),
      meta: {
        title: '通道管理'
      }
    },
    {
      path: 'nchannelproduct',
      component: () => import('@/view/news/nchannelproduct'),
      meta: {
        title: '通道产品管理'
      }
    },
    {
      path: 'npackageproduct',
      component: () => import('@/view/news/npackageproduct'),
      meta: {
        title: '套餐产品设置'
      }
    },
    {
      path: 'setprodut',
      component: () => import('@/view/news/setprodut'),
      meta: {
        title: '产品配置'
      }
    },
  ]
}
export default newsRouter
