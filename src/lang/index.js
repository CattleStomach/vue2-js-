/**
 * 初始化i18n国际化插件
 * ==系统文字的翻译==
 * 1.如果使用了组件库需要单独翻译组件库里的组件文字的多语言
 * 2.系统自己组件内的自定义内容的翻译
 *
 * 翻译实现的步骤：
 * 1.要翻译的文字=》提供对应语种的翻译结果=》语言包（中文和英文两个包）
 * 2.把语言包传入翻译实例中
 *
 * 翻译的核心原理：读取不同语种的语言包实现不同语言的网站
 *
 * 语言包如何定义：
 * 1.数据结构是一个对象
 * 2.在对象中可以按照模块或页面划分翻译的属性{login:{},navbar:{}}
 * 3.在对应模块或页面的属性下使用一个新对象放置翻译结果{login:{title:''},navbar:{github:''}}
 *
 */

import Vue from 'vue'
import VueI18n from 'vue-i18n'

// 组件库的
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包

// 自己的语言包
import customEN from './language/en'
import customZH from './language/zh'

import cookie from 'js-cookie'

// 注册国际化插件
Vue.use(VueI18n)

// 2.初始化i18n实例
const i18n = new VueI18n({
  // locale 指定messages中支持的语言包
  locale: cookie.get('hr-lang') || 'zh',
  // 接收支持的语言包
  messages: {
    en: {
      ...elementEN,
      ...customEN
    },
    zh: {
      ...elementZH,
      ...customZH
    }
  }
})

// 3.导出i18n实例
export default i18n

