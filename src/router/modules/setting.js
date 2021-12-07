import Layout from '@/layout'

export default {
  path: '/setting',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'settings', // 后续权限控制会使用
      component: () => import('@/views/setting'),
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]

}
