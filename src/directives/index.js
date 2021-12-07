/**
 * 定义项目全局指令
 * Vue.directive('指令名称', {
    // 会在当前指令作用的dom元素 插入之后执行
    // options 里面是指令的表达式 =》通过options.value 获取指令绑定的变量值
    inserted: function (dom,options) {
      // 操作DOM
    }
})
 */

// 处理图片加载错误=》显示一个默认图片
export const imgError = {
  inserted (dom, options) {
    console.log(dom, options)
    // 注册图片加载失败事件onerror
    dom.onerror = () => {
      // 显示默认图片
      dom.src = options.value
    }
  }
}

// 测试(第二个指令)
export const imgs = {

}

