<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 表单title -->
      <div class="title-container">
        <!-- <h3 class="title">Login Form</h3> -->
        <img src="@/assets/common/login-logo.png" alt="" />
      </div>
      <!-- 表单项 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <!-- 全局图标组件 -->
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 自定义组件绑定原生事件的时候，需要加.native修饰符当前事件才会生效
        原因：el-input不是html的元素
        .native修饰符起到事件穿透作用=》穿过自定义元素=》把事件应用到里边html元素身上
         -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 提交 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        Login
      </el-button>
      <!-- 提示 -->
      <div class="tips" :style="{ color: styles.test }">
        <span style="margin-right: 20px" @click="styles.test = 'blue'">
          <!-- 人资中台的账号密码提示 -->
          username: 13800000002
        </span>
        <span> password: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 导入可复用的校验方法
import { validMobile } from '@/utils/validate'
// import { login } from '@/api/user'
/**
 * css in js怎么使用？
 * 1. 导入对应的样式
 * 2. 把导入的样式挂载到data上
 */
import styles from '@/styles/variables.scss'

export default {
  name: 'Login',
  data () {
    /**
     *  value 当前输入手机号的值
     *  callback 校验是否通过
     */
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        //  错误提示
        callback(new Error('手机号格式不正确！'))
      } else {
        // 通过校验
        callback()
      }
    }

    return {
      // 表单所有数据
      loginForm: {
        mobile: '13800000002', // 手机号
        password: '123456' // 密码
      },
      // 验证规则
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        password: [
          { required: true, message: '密码为必填！', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度为6~10！', trigger: 'blur' }
        ]
      },
      // 提交loading效果
      loading: false,
      passwordType: 'password',
      // 存储回跳地址
      redirect: undefined,
      // 挂载css样式
      styles
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      // 立即执行handler回调
      immediate: true
    }
  },
  created () {
    console.log('导入的样式：', styles)
  },
  methods: {
    // 控制密码是否可见
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 提交登录
    handleLogin () {
      // 表单整体校验
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 所有表单项校验通过
          // 开启提交loading动画
          try {
            this.loading = true
            // const res = await login(this.loginForm)
            // console.log(res)
            // // 存储token到vuex
            // this.$store.commit('user/updateToken', res)
            // this.loading = false
            // 调用action
            // 注意：加个await等到token获取并存储了，才进行跳转
            await this.$store.dispatch('user/loginAction', this.loginForm)
            // 跳转到首页
            this.$router.replace(this.redirect || '/')
          } catch (error) {
            console.log(error)
            // 关闭loading=》用户可以继续操作
            this.loading = false
          }

          // this.$store.dispatch('user/login', this.loginForm).then(() => {
          //   this.$router.push({ path: this.redirect || '/' })
          //   this.loading = false
          // }).catch(() => {
          //   this.loading = false
          // })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
// 避免覆盖子组件样式使用/deep/
$bg: #283443;
// 输入框颜色
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
// 样式中使用@（src）=》一定要注意加上~@/path
.login-container {
  background-image: url("~@/assets/common/login.jpg"); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
// 当前页面的样式（局部）
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    padding: 10px;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
