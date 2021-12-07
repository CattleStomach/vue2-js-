import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'salarys', // 后续权限控制会使用
      component: () => import('@/views/salarys'),
      meta: { title: '工资', icon: 'money' }
    }
  ]

}
