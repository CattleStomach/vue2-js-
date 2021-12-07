/**
 * 用户相关数据维护和管理模块（token、登录人信息）
 */
import { setToken, getToken, removeToken } from '@/utils/auth'
// 导入后台接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

export default {
  namespaced: true,
  // 存和定义用户数据
  state: {
    // 登录之后的token数据
    // 一定要先从本地cookie读取
    token: getToken() || '',
    // 登录人信息
    userInfo: {}
  },
  // 修改state中数据（同步）
  mutations: {
    // 存储token
    /**
     *
     * @param {*} state 所有state数据
     * @param {*} token 外部传递的参数
     */
    updateToken (state, token) {
      state.token = token
      // 本地存一份
      setToken(token)
    },
    // 删除token
    delToken (state) {
      state.token = ''
      // 本地删除
      removeToken()
    },
    // 存储用户信息
    updateUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    // 删除用户信息
    delUserInfo (state) {
      state.userInfo = {}
    }
  },
  // 获取后台数据（异步）
  actions: {
    // 退出登录=》清除本地状态数据
    logoutAction ({ commit }) {
      /**
       * 1. 如果有退出接口=>调用
       * 2. 清除本地登录存储的数据=》token、userInfo
       * 3. 重置路由实例=》resetRouter
       * 4. 重置菜单的vuex数据
       */
      commit('delToken')
      commit('delUserInfo')
      resetRouter()
      // { root: true } 开启父模块权限=》可以调用兄弟模块的mucations方法
      commit('menu/setMenuList', [], { root: true })
    },
    // 调用登录接口=》获取token存储
    async loginAction ({ commit }, payload) {
      // 调接口
      const token = await login(payload)
      // 存token
      commit('updateToken', token)
    },
    // 获取登录人数据
    // 什么时候调用登录人信息 =》可以在permisson.js => 前门保安里调用
    async userInfoAction (ctx) {
      // 1. 用户基本信息
      const userInfo = await getUserInfo()
      // 2. 获取用户头像
      const avator = await getUserDetailById(userInfo.userId)
      console.log('登录人信息：', userInfo, avator)
      // {...userInfo, ...avator} 合并两个对象数据
      ctx.commit('updateUserInfo', { ...userInfo, ...avator })
      // 返回权限点数据
      return userInfo.roles
    }
  }
}
