<template>
  <el-row v-show="visible" class="treeBox">
    <!-- 关闭按钮 -->
    <i class="el-icon-circle-close" @click="close"></i>
    <el-tree
      :data="treeData"
      :props="{ label: 'name' }"
      @node-click="selectNode"
    />
  </el-row>
</template>

<script>
// 导入组织架构接口和处理树形数据方法
import { getDepartments } from '@/api/departments'
import { formatTreeData } from '@/utils'

export default {
  name: 'ElDepSelect',
  props: {
    // 控制部门选择是否显示
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 部门选择数据
      treeData: []
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    // 关闭部门选择
    close () {
      // 子传父
      // this.$emit('close-dept')
      this.$emit('update:visible', false)
    },
    // 点击选择部门
    selectNode (node) {
      /**
       * 1. node当前点击选择的部门数据=》子传父
       * 2. 关闭
       */
      this.$emit('current-select', node)
      this.close()
    },
    // 获取部门数据
    async getTreeData () {
      const { depts } = await getDepartments()
      console.log('部门数据：', depts)
      this.treeData = formatTreeData(depts)
    }
  }
}
</script>

<style lang="scss" scoped>
.treeBox {
  position: relative;
  width: 280px;
  margin-top: 10px;
  border: 1px solid #eee;
  .el-icon-circle-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
    font-size: 16px;
    color: red;
    cursor: pointer;
  }
}
</style>
