<template>
  <div>
    <el-dialog
      title="给角色分配权限点（1. 页面访问 2. 页面下功能）"
      :visible="showDialog"
      width="50%"
      @close="close"
    >
      <!-- 权限点树形列表
      node-key="id" // 选中时绑定的数据字段(唯一) 必传属性
      show-checkbox 开启选择
      check-strictly 关闭父子选择关联
      -->
      <el-tree
        ref="treePoints"
        :data="pointsList"
        :props="{ label: 'name' }"
        check-strictly
        default-expand-all
        show-checkbox
        node-key="id"
      ></el-tree>

      <span slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="assingPoints">分配权限</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 权限点列表数据接口
import { getPermissionList } from '@/api/permisson'
import { formatTreeData } from '@/utils'
// 获取角色选择过的权限点接口
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 权限点列表数据
      pointsList: [],
      // 角色ID
      roleId: ''
    }
  },
  created () {
    this.getPermissions()
  },
  methods: {
    // 给角色分配权限点
    async assingPoints () {
      /**
       * 1. 准备{id:角色id, permIds:[] 所有选中的节点的id组成的数组}接口参数
       * 2. 调用接口分配权限
       * 3. 提示并关闭弹层
       * getCheckedKeys 获取的是选中节点的id的数组 | getCheckedNodes 获取选中节点对象的数组
       */
      await assignPerm({ id: this.roleId, permIds: this.$refs.treePoints.getCheckedKeys() })
      this.$message.success('分配成功')
      this.close()
    },
    // 获取当前角色之前选择过的权限点=》回填
    // id 父组件传递的角色ID
    async getRoleSeledPoints (id) {
      const res = await getRoleDetail(id)
      console.log('当前角色选择的权限：', res.permIds)
      this.roleId = id
      // 回显
      this.$refs.treePoints.setCheckedKeys(res.permIds)
    },
    // 获取权限点数据
    async getPermissions () {
      const res = await getPermissionList()
      console.log('获取权限点数据:', res)
      this.pointsList = formatTreeData(res)
    },
    close () {
      // 清空上次选中的权限=> 避免上次回填闪现（非必须）
      this.$refs.treePoints.setCheckedKeys([])
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
