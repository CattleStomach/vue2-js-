import Vue from 'vue'

// 重置浏览器默认样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// 导入elment组件库
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

if (process.env.NODE_ENV === 'development') {
  // 只有开发环境引入element样式=》因为生产环境以cdn方式引入了css
  // 因为import 不能写到语句块内， 所以使用require导入样式
  require('element-ui/lib/theme-chalk/index.css')
}

// 多语言班配置
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 全局样式
import '@/styles/index.scss' // global css

// 根组件
import App from './App'
// 导入vuex
import store from './store'
import router from './router'

import '@/icons' // icon
// 添加路由拦截=》页面访问控制
import '@/permission' // permission control

// 导入注册项目全局组件插件
import GlobleComponents from '@/components'

// 导入指令
// import * as 起个名 from 'module' 把所有导出放到一个对象上
import * as directives from '@/directives'

// 导入功能权限点mixin方法
import ckp from '@/utils/mixin'

// 导入echarts插件
import echartsPlugin from '@/utils/echarts'

import i18n from './lang'

// 注册echartsPlugin插件
Vue.use(echartsPlugin)

// 混入方法到所有组件
Vue.mixin(ckp)
console.log('指令：', directives, directives.imgError)
// 注册多个全局指令
Object.keys(directives).forEach(dname => {
  Vue.directive(dname, directives[dname])
})
// set ElementUI lang to EN
// 默认是中文 => use方法执行流程：1. 接收插件对象（install方法）2. 调用install方法，传入Vue大对象
Vue.use(ElementUI, {
  // 传入i18n实例 翻译 element 组件库的多语言
  i18n: (k, v) => i18n.t(k, v)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 注册全局组件插件
Vue.use(GlobleComponents)

Vue.config.productionTip = false

console.log('读取环境变量：', process.env)

new Vue({
  el: '#app',
  // 挂载路由实例
  router,
  // 挂载vuex实例
  store,
  // 挂载翻译插件i18n实例
  i18n,
  render: h => h(App)
})
