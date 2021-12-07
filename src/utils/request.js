import axios from 'axios'
// elment组件库提供的消息提示
import { Message } from 'element-ui'
// 导入vuex实例
import store from '@/store'
// 导入路由实例
import router from '@/router'

// create an axios instance
// 创建axios实例
const service = axios.create({
  // 动态配置请求的url=》开发环境和生成环境请求地址不一样的
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
// 请求拦截器=》请求还没有发出去
// 作用：可以向header中统一添加token
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // 根据api文档添加
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 响应拦截器=》已经获取到数据了
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // http状态码是200进入这里
    /**
     * 1. 简化数据的返回
     * 2. 处理请求错误并提示
     */
    // 请求成功进入这里
    const { success, data, message } = response.data
    // 处理请求的成功或失败
    if (success) {
      // 成功就把页面需要的data返回
      return data
    } else {
      // 请求失败
      // 错误提示
      Message({
        message,
        type: 'error',
        duration: 3 * 1000
      })
      // 中断promise并抛出错误提示
      return Promise.reject(new Error(message))
    }

    // 异常处理
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    // 注意：一定要返回response，这样页面才能获取都数据
    // return response
    // }
  },
  error => {
    // http状态码非200进入这里
    // 请求失败执行到这里
    console.dir(error) // for debug
    /**
     * 处理token失效
     * 1. 根据http状态码401判断
     * 2. 如果401就跳回登录
     */
    if (error.response && error.response.status === 401) {
      // 处理某些页面多个请求多次401重复跳转问题，造成重新登录后不能正确跳转到上次访问页面问题
      if (router.currentRoute.path === '/login') return
      // 跳转之前清除本地登录状态数据
      store.dispatch('user/logoutAction')
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
    }

    // 错误信息提示
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 3 * 1000
    })

    return Promise.reject(error)
  }
)

// 导出axios实例
export default service
