<template>
  <div class="app-container">
    <!-- 放置表单 -->
    <el-form ref="fm" :model="userData" :rules="rules" label-width="60px">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userData.username" style="width: 300px" />
      </el-form-item>
      <el-form-item label="密码:">
        <el-input
          v-model="userData.password"
          disabled
          type="password"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUserName">更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入更新接口
import { saveUserDetailById } from '@/api/employees'
export default {
  props: {
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      // 校验规则
      rules: {
        username: [
          { required: true, min: 2, max: 20, message: '请输入长度2~20用户名', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 更新账户用户名
    updateUserName () {
      /**
       * 1. 整体校验
       * 2. 调用更新接口
       */
      this.$refs.fm.validate(async (isOk) => {
        if (isOk) {
          // 获取变化的数据=> 正常应该提供独立接口，传递修改的数据=》更新
          // const { username, id, mobile } = this.userData
          // await saveUserDetailById({ username, id, mobile })
          await saveUserDetailById(this.userData)
          this.$message.success('更新账户成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
