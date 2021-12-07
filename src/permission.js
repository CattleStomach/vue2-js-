// 路由实例
import router, { asyncRoutes } from './router'
// vuex实例
import store from './store'
// 加载进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 白名单=》不需要token也可以访问的页面
const whiteList = ['/login', '/404']

// 添加前门保安=》根据是否有token拦截页面的访问
/**
 * to 去哪
 * from 从哪来
 * next 放行（页面可以正常访问）
 */
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 为了避免重复登录=》跳到首页
      next('/')
    } else {
      // 放行
      next()
      // 获取登录人信息=》存储到vuex
      if (!store.getters.name) {
        // 如果没有获取过执行action获取
        const points = await store.dispatch('user/userInfoAction')
        // 后续逻辑
        /**
         * 需求：根据登录后获取的权限点数据=》动态添加路由规则=》目的：做页面访问控制
         * 1. 获取权限点数据
         * 2. 根据权限点数据过滤动态路由=》留下有全权限的页面路由配置
         * 3. 把过滤出来的路由动态添加到路由
         * 注意：
         * 1. 配置动态路由的时候，第一个子路由的name值和后台对应页面的权限标识一一对应
         * 2. 动态添加路由是添加到404路由配置后边，会造成刷新404=》加到404前边
         */
        console.log('权限点数据：', points)
        // filterAsyncRoutes =》代表当前登录人可以访问的页面路由配置
        const filterAsyncRoutes = asyncRoutes.filter((route) => {
          // 1. route.children[0].name) 获取路由配置的name
          // 2. 获取路由配置的name和登录人的menus数组中的值匹配
          // * 匹配到=》有这个route的访问权限 2. 相反就没有
          return points.menus.includes(route.children[0].name)
        })
        // 存储合并菜单数据=》渲染菜单
        store.commit('menu/setMenuList', filterAsyncRoutes)
        console.log('可以访问的页面路由配置:', filterAsyncRoutes)
        // 动态添加路由生效 => 确保404路由配置在最后面，解决动态路由刷新404问题
        router.addRoutes([...filterAsyncRoutes, { path: '*', redirect: '/404', hidden: true }])
      }
    }
  } else {
    // 不存在token
    if (whiteList.includes(to.path)) {
      // 在白名单是存在的
      next()
    } else {
      next('/login')
    }
  }
  // 关闭进度条
  NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
