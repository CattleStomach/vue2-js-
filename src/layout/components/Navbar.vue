<template>
  <div class="navbar">
    <!-- 控制菜单折叠展开组件 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <div class="app-breadcrumb">
      <!-- 江苏传智播客教育科技股份有限公司 -->
      <!-- 动态翻译 $t 根据locale指定的语言包，读取这个语言包中对应属性的翻译结果
            替换写死的文字=》{{$t("要翻译文字在语言包中的属性名.属性名找到 键 ")}}
            需要自己调用 $t 一个个翻译 （体力活。。。）
       -->
      {{ $t("navbar.title") }}
      <span class="breadBtn">体验版</span>
    </div>
    <!-- 面包屑组件 -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <!-- 右侧下拉菜单
    1. 后续会放一些工具图标
    2. 展示当前登录人信息
     -->
    <div class="right-menu">
      <!-- 多语言组件 -->
      <Lang class="ricon" />
      <!-- 全屏组件 -->
      <ScreenFull class="ricon" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 默认头像图片 -->
          <!-- <img src="@/assets/common/bigUserHeader.png" class="user-avatar" /> -->
          <img v-imgError="defaultTx" :src="avatar" class="user-avatar" />
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="http://ihrm-java.itheima.net/">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data () {
    return {
      // 默认头像（图片加载失败显示默认）
      defaultTx: require('@/assets/common/bigUserHeader.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      // 登录人数据
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout () {
      /**
       * 1. 避免误操作=》让用户确认
       * 2. 确认了才执行退出
       */
      this.$confirm('确定退出吗?', '提示').then(async () => {
        // 点击确定=》走这里
        await this.$store.dispatch('user/logoutAction')
        // 跳回登录
        // 退出登录的时候把上次访问页面的地址传递给登录页
        this.$router.push(`/login`)
      }).catch((e) => {
        // 点击取消=>走这里
        console.log('取消：', e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #fff;
  // 头部组件的背景色
  background-image: -webkit-linear-gradient(left, #5b8cff, #3d6df8);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // 公司信息
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;
    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    // 控制图标的位置
    .ricon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      // 右侧头像等显示控制
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
