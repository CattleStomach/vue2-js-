<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <!-- 页签 -->
        <el-tabs v-model="active">
          <el-tab-pane name="account" label="登录账户设置">
            <LoginSetting :user-data="userData" />
          </el-tab-pane>
          <el-tab-pane name="detail" label="个人详情">
            <UserInfo :user-data="userData" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import LoginSetting from './components/login-setting.vue'
import UserInfo from './components/user-info.vue'
// 引入详情接口（登录账户设置和详情数据）
import { getUserDetailById } from '@/api/user'
export default {
  components: {
    LoginSetting,
    UserInfo
  },
  data () {
    return {
      // 默认选中的页签
      active: 'detail',
      userData: {}
    }
  },
  created () {
    this.getUserData()
  },
  methods: {
    // 获取用户相关数据
    async getUserData () {
      // 1. this.$route.params获取动态路由参数 2. 配置路由的时候：this.$route.params.:参数名
      const res = await getUserDetailById(this.$route.params.id)
      console.log(res)
      this.userData = res
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
