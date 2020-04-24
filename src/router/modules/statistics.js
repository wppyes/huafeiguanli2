

import Layout from '@/view/layout/Layout'
const statisticsRouter = {
  path: '/statistics',
  component: Layout,
  alwaysShow: true,
  redirect: '/statistics/hfstatistics',
  name:'statistics',
  title: 'title',
  children: [
    {
      path: 'hfstatistics',
      component: () => import('@/view/statistics/hfstatistics'),
      meta: {
        title: '客户账户余额'
      }
    },
    {
      path: 'UserPayment',
      component: () => import('@/view/statistics/UserPayment'),
      meta: {
        title: '用户加款统计'
      }
    },
    {
      path: 'tongji',
      component: () => import('@/view/statistics/tongji'),
      meta: {
        title: '账单统计'
      }
    }
  ]
}
export default statisticsRouter
