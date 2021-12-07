import Layout from '@/layout'
export default {
  path: '/permission',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'permissions', // 后续权限控制会使用
      component: () => import('@/views/permission'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]

}
