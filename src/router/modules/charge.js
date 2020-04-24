

import Layout from '@/view/layout/Layout'
const chargeRouter = {
  path: '/charge',
  component: Layout,
  alwaysShow: true,
  redirect: '/charge/chargeorder',
  name:'charge',
  title: 'title',
  children: [
    {
      path: 'chargeorder',
      component: () => import('@/view/charge/chargeorder'),
      meta: {
        title: '话费订单管理'
      }
    },
    {
      path: 'chargephone',
      component: () => import('@/view/charge/chargephone'),
      meta: {
        title: '批量话费充值'
      }
    },
    {
      path: 'batchrecharge',
      component: () => import('@/view/charge/batchrecharge'),
      meta: {
        title: '批量会员充值'
      }
    },
    {
      path: 'telephone',
      component: () => import('@/view/charge/telephone'),
      meta: {
        title: '话费充值（自用）'
      }
    },
    {
      path: 'memberrecharge',
      component: () => import('@/view/charge/memberrecharge'),
      meta: {
        title: '会员充值（自用）'
      }
    },
    {
      path: 'videoviporder',
      component: () => import('@/view/charge/videoviporder'),
      meta: {
        title: '视频会员订单'
      }
    },
    {
      path: 'batchfailrecord',
      component: () => import('@/view/charge/batchfailrecord'),
      meta: {
        title: '批量失败订单统计'
      }
    },
    {
      path: 'chargeSplit',
      component: () => import('@/view/charge/chargeSplit'),
      meta: {
        title: '拆分订单'
      }
    }
  ]
}
export default chargeRouter
