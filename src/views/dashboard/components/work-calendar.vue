<template>
  <div>
    <el-calendar v-if="show" v-model="value">
      <!-- dateCell具名插槽，自定义单元格内容
      作用域插槽：
      1. date 日期对象Date类型=》获取日期相关的数据
      2. data 当前日期的数据=>data.day获取完整的日期
      -->
      <template #dateCell="{ date, data }">
        <div class="date-content">
          <!-- 日子 -->
          <span class="text">{{ getDay(data.day) }}</span>
          <!-- 是否是双休日
          技术：new Date().getDay() 返回一周中某一天 =》1-6 周一到周六 | 0 周日
           -->
          <span v-if="isRest(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
/**
 * 问题：动态翻译element日历组件，星期不翻译问题=》刷新可以解决
 * 根源：星期是写死的，除非组件被重新创建
 * 解决：通过v-if销毁日历组件=》再重新创建
 * 什么时候销毁？=》$i19n.locale变化的时候  点击切换中英文的时候=》watch监听
 */
export default {
  data () {
    return {
      show: true,
      value: new Date()
    }
  },
  watch: {
    // 监听一个对象上某个属性
    async '$i18n.locale' (newValue) {
      // 干掉组件=》销毁组件
      this.show = false
      await this.$nextTick()
      // 等销毁成功之后 再重新创建
      this.show = true
    }
  },
  methods: {
    // 获取当前日数据
    // date:string 2021-07-16
    getDay (date) {
      // 获取年月日数据放到数组里
      const _date = date.split('-')
      return _date[2]
    },
    // 判断是否是周六日
    isRest (date) {
      const day = date.getDay()
      return day === 0 || day === 6
    }
  }
}
</script>

<style lang="scss" scoped>
// 覆盖日历组件单元格高度
::v-deep .el-calendar-day {
  height: 50px;
}
// 自定义日期显示样式
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
// 休息时间
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
// 当前日期
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
</style>
