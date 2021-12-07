<template>
  <div>
    <el-switch
      v-model="cg"
      active-text="开启数据切换"
      inactive-text="关闭数据切换"
      :active-value="true"
      :inactive-value="false"
      @change="loop"
    >
    </el-switch>
    <!-- 准备绘制radar图表的盒子 -->
    <div ref="radar" class="radarBox"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 开关
      cg: false,
      // 配置项
      opt: {
        tooltip: {},
        radar: {
          // shape: 'circle',
          // 雷达图数据指标（数据项或属性）
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [{
          type: 'radar',
          data: [

          ]
        }]
      }
    }
  },
  mounted () {
    this.drawRadar()
  },
  beforeDestroy () {
    clearInterval(this.st)
  },
  methods: {
    // 轮询绘制图表
    loop () {
      if (this.st) {
        // 根据定时器是否有值=》有值=》关闭定时器
        clearInterval(this.st)
        this.st = null
        return
      }
      // 定时器ID
      this.st = setInterval(this.change, 1000)
    },
    // 造假数据=》重新绘制
    change () {
      const data = []
      // 外层循环造3条数据
      for (let index = 0; index < 3; index++) {
        const per = { value: [], name: `李${index}` }
        // 造6个指标项的数据=》value
        for (let j = 0; j < 6; j++) {
          per.value.push(Math.floor(Math.random() * 100 + 1))
        }
        data.push(per)
      }
      // 绘制图表=》1. 改数据
      this.opt.series[0].data = data
      // 2. 重新绘制=》setOption
      this.myChart.setOption(this.opt)
    },
    // 绘制图表
    drawRadar () {
      // 基于准备好的dom，初始化echarts实例
      // this上存储echarts实例=》跨方法调用
      this.myChart = this.echarts.init(this.$refs.radar)
      // 绘制图表：1. 准备对应图表的配置文件 2. 调用setOption传入配置绘制
      // 绘制指定图表的配置文件
      // const opt =
      this.opt.series[0].data = [{
        value: [10, 1, 100, 5, 100, 0],
        name: '张三'
      },
      {
        value: [50, 50, 50, 50, 50, 10],
        name: '李四'
      }]
      this.myChart.setOption(this.opt)
    }
  }
}
</script>

<style lang="scss" scoped>
.radarBox {
  width: 100%;
  height: 400px;
}
</style>
