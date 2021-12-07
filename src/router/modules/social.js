import Layout from '@/layout'
export default {
  path: '/social',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'social_securitys', // 后续权限控制会使用
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'table' }
    }
  ]

}
