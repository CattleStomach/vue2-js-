import Layout from '@/layout'

export default {
  path: '/departments',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'departments', // 后续权限控制会使用
      component: () => import('@/views/departments'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]

}
