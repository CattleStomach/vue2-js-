/**
 * 插件作用：全局注册echarts核心方法
 */
// 全量引入
// import * as echarts from 'echarts'
// 按需引入=》1. 核心组件代码 2. 当前使用的图表组件
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart=>按需引入项目页面使用的图表=》用什么引入什么图表
import {
  RadarChart
} from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component（配套组件）
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
  CanvasRenderer
} from 'echarts/renderers'

// 注册必须的组件
echarts.use(
  [TitleComponent, TooltipComponent, GridComponent, RadarChart, CanvasRenderer]
)
export default {
  install (Vue) {
    // 把echarts挂载到原型链上（复用）
    Vue.prototype.echarts = echarts
  }
}
