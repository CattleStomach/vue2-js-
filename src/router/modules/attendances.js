import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'attendances', // 后续权限控制会使用
      component: () => import('@/views/attendances'),
      meta: { title: '考勤', icon: 'skill' }
    }
  ]

}
