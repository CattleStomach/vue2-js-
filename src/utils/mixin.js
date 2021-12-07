/**
 * mixin一般用来复用逻辑（方法）
 */
import store from '@/store'
export default {
  methods: {
    // 检查页面下的功能点
    // point 功能点的权限标识
    checkPoints (point) {
      /**
       * 1. 获取登录人的功能点的权限标识列表
       * 2. 根据传入的权限点标识去第1步的数组中查找=》找到返回true/相反返回false
       */
      const { userInfo } = store.state.user
      // ?作用：增加代码健壮性
      return userInfo.roles?.points.includes(point)
    }
  }
}
