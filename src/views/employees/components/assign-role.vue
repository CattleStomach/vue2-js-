<template>
  <div>
    <el-dialog
      title="给员工分配角色"
      :visible="showDialog"
      width="50%"
      @close="close"
    >
      <!-- 分配角色列表=》多选
       1. seledRoles 存储多选的值
       2. 选项存的值由label属性决定
       -->
      <el-checkbox-group v-model="seledRoles">
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{
          role.name
        }}</el-checkbox>
        <!-- <el-checkbox label="2">CEO</el-checkbox>
        <el-checkbox label="3">CTO</el-checkbox> -->
      </el-checkbox-group>

      <span slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="assignRole">分配角色</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入角色列表接口
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 角色列表
      roleList: [],
      // 选中角色的ID
      seledRoles: [],
      // 用户ID
      currentUserId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取当前点击用户之前分配过的角色数据=》回填
    async getUserRoles (id) {
      const userRoles = await getUserDetailById(id)
      console.log(userRoles)
      // 存储当前用户ID
      this.currentUserId = id
      // 回填选中
      this.seledRoles = userRoles.roleIds || []
    },
    close () {
      // 清空上次选择
      this.seledRoles = []
      this.$emit('update:showDialog', false)
    },
    // 分配角色
    async assignRole () {
      /**
       * 1. 获取用户ID和选中的角色ID数组
       * 2. 调用分配角色接口传入参数
       * 3. 提示并关闭弹层
       */
      await assignRoles({ id: this.currentUserId, roleIds: this.seledRoles })
      this.$message.success('分配成功')
      this.close()
    },
    // 获取角色列表
    // params:{page 页码, pagesize 每页条数}
    async getRoleList () {
      const { rows } = await getRoleList({ page: 1, pagesize: 1000 })
      console.log('角色列表：', rows)
      this.roleList = rows
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
