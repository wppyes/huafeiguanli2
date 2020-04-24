

import Layout from '@/view/layout/Layout'
const readonlyRouter = {
  path: '/readonly',
  component: Layout,
  alwaysShow: true,
  redirect: '/readonly/chargeorder',
  name:'readonly',
  title: 'title',
  children: [
    {
      path: 'chargeorder',
      component: () => import('@/view/readonly/chargeorder'),
      meta: {
        title: '话费订单列表'
      }
    },
    {
      path: 'ncustomer',
      component: () => import('@/view/readonly/ncustomer'),
      meta: {
        title: '客户列表'
      }
    },
  ]
}
export default readonlyRouter
