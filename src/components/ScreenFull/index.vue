<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 全局图标组件 -->
    <svg-icon
      :icon-class="isFull ? 'exit-fullscreen' : 'fullscreen'"
      class="fullscreen"
      @click="toggleScreen"
    />
  </div>
</template>

<script>
import sf from 'screenfull'
export default {
  name: 'ScreenFull',
  data () {
    return {
      // 是否是全屏响应数据
      isFull: false
    }
  },
  created () {
    this.onScreen()
  },
  beforeDestroy () {
    // 解绑自己写的事件  关闭监控
    sf.off('change')
  },
  methods: {
    // 监控浏览器的全屏状态
    // 语法：`screenfull.on('change',callback)`
    onScreen () {
      sf.on('change', () => {
        console.log(sf.isFullscreen)
        // sf.isFullscreen 返回true全屏状态，相反就是关闭全屏状态
        if (sf.isFullscreen) {
          this.isFull = true
        } else {
          this.isFull = false
        }
      })
    },
    // 开启或关闭全屏
    toggleScreen () {
      /**
       * 需求：点击icon图标切换全屏
       * 使用技术：选择screenfull插件=》1.浏览器兼容性判断  2.提供了好用简洁的方法
       * 1.判断兼容性=>sf.isEnabled 返回true说明当前浏览器支持，相反不支持
       * 2.点击执行调用screenfull包里提供的方法
       */
      if (!sf.isEnabled) {
        // 不支持
        return this.$message.error('浏览器不支持全屏功能！换个谷歌浏览器试试!')
      }
      // 支持
      // request() => 只能全屏
      // sf.request()
      // toggle() =》切换全屏功能
      sf.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
