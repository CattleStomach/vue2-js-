// 公共布局组件
import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  // hidden: true,
  children: [
    {
      path: '',
      name: 'approvals', // 后续权限控制会使用
      component: () => import('@/views/approvals'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]

}
