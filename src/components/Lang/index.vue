<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <!-- 默认显示图标 -->
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <!-- 下拉菜单内容 -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="'zh' === $i18n.locale">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="'en' === $i18n.locale">
        en
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import cookie from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    // 动态切换多语言=>点击可以获取对应菜单项上绑定的  command="zh"的值
    changeLanguage (command) {
      // 切换多语言=>this.$i18n.locale 重新赋值
      this.$i18n.locale = command // 设置给本地的i18n插件
      /**
       * 语法：cookie.set(key,value,{expires:day/date对象})
       * 默认存的session形式=》关闭浏览器，这个数据就会被删除
       * cookie.set('hr-lang',{expires:传数字代表几天后过期})
       * cookie.set('hr-lang',{expires:3})
       * cookie.set('hr-lang',{expires:传date类型时间对象=》3小时过期})
       * cookie.set('hr-lang',{expires:new Date(Date.now()+3 *60*60*1000)})
       */
      // 本地持久化存储当前语言标识=》
      cookie.set('hr-lang', command)
      this.$message.success(`成功切换成${command}语言！`)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
