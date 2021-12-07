import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'employees', // 后续权限控制会使用=>注意：name值和后台权限标识的值一致
      component: () => import('@/views/employees'),
      meta: { title: '员工管理', icon: 'people' }
    },
    // 员工详情页 => 后续页面都需要加 hidden: true
    {
      path: '/employees/detail/:id',
      name: 'detail',
      hidden: true,
      component: () => import('@/views/employees/detail.vue')
    }
  ]

}
