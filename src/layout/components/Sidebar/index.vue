<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- 菜单上边logo组件 -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 菜单组件（饿了吗组件库提供） -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 自定义菜单项的组件
        配置完的路由数据在这里v-for遍历显示到菜单
        sidebar-item组件接口当前路由配置数据item
         -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // 计算路由配置
    routes () {
      console.log('获取所有路由配置数据：', this.$router.options.routes)
      // this.$router.options.routes 只能获取静态路由=》addRoutes的路由获取不到
      // return this.$router.options.routes
      return this.$store.state.menu.menuList
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    // 控制菜单折叠展开的vuex的数据
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
