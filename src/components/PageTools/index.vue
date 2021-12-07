<template>
  <div class="page-tools">
    <!-- 左侧 -->
    <div class="left">
      <div class="tips">
        <i class="el-icon-info" />
        <span>
          <!-- 左边内容自定义具名插槽left -->
          <slot name="left"> 这里展新文字信息 </slot>
        </span>
      </div>
    </div>
    <div class="right">
      <!-- 右侧 左边内容自定义具名插槽right -->
      <slot name="right">
        <!-- 默认内容 -->
        <el-button type="primary" size="small">历史归档</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </slot>
      <!-- <el-button type="primary" size="small">历史归档</el-button>
      <el-button type="primary" size="small">导出</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  // 组件名=》作为注册组件的标签名
  name: 'PageTools'
}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
