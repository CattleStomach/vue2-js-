/**
 * 挂载注册所有的全局公共组件
 * 软件架构：高内聚低耦合（模块化）
 */
// 导入组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ElDepSelect from './DepSel'
import UploadImg from './UploadImg'
import ScreenFull from './ScreenFull/index.vue'
import Lang from './Lang'

// console.log('组件对象：', PageTools)
/**
 * 批量注册多个组件：
 * 1. 把所有组件都放入到一个数组中
 * 2. 循环数组注册所有组件
 */
const components = [Lang, PageTools, UploadExcel, ElDepSelect, UploadImg, ScreenFull]

// vue插件写法：声明一个对象，同时里边放一个install方法(能拿到Vue构造函数)
export default {
  install (Vue) {
    // 挂载全局方法属性、注册全局组件、指令
    Vue.prototype.test = 1
    // 注册全局组件
    // Vue.component('PageTools', PageTools)
    components.forEach(cp => {
      Vue.component(cp.name, cp)
    })
  }
}

