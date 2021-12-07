/**
 * 维护公共布局左侧菜单数据
 * menuList数据：1. 静态路由 2. 根据权限点过滤的路由（动态）
 */
import { constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    // 菜单数据
    menuList: []
  },
  mutations: {
    // 存储菜单数据
    // 根据权限点过滤的路由（动态）
    setMenuList (state, filterRoutes) {
      state.menuList = [...constantRoutes, ...filterRoutes]
    }
  }
}
