<template>
  <div class="import-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <span>批量导入员工</span>
        </div>
        <!-- card body -->
        <!-- excel导入组件 => 读取excel中的员工数据
        用法总结：
        父传子：
        :before-upload="beforeUpload" 校验文件
        :on-success="handleSuccess" 校验通过后，获取读取到的excel数据的
        -->
        <UploadExcel
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
// 导入excel时间格式化通用方法
import { formatExcelDate } from '@/utils'
// 导入后台接口上传读取到的excel员工数据接口
import { importEmployees } from '@/api/employees'
export default {
  methods: {
    // 读取选择的excel文件之前会先执行这个校验函数
    // 用法：校验通过返回true，失败返回false（不会执行handleSuccess函数）
    // 作用：校验大小
    beforeUpload (file) {
      console.log('文件信息：', file)
      // 小于1M可以上传 =》file.size 单位：字节Byte   1M 1024KB  1024B
      // const isLt1M = file.size / 1024 / 1024 < 1

      // if (isLt1M) {
      //   return true
      // }

      // this.$message({
      //   message: 'Please do not upload files larger than 1m in size.',
      //   type: 'warning'
      // })
      return true
    },
    // 校验通过后执行
    /**
     *  result:{header, results}  读取到的excel数据
     */
    async handleSuccess ({ header, results }) {
      // console.log('读取到的excel数据:', header, results)
      // console.table(results)
      // console.log(this.transformResults(results))
      await importEmployees(this.transformResults(results))
      this.$message.success('导入员工数据成功')
      // 返回员工列表=>查看导入到数据
      this.$router.back()
    },
    // 转换读取员工数据中文key=》转换为英文key
    /**
     * results 接口要转换的数据
     */
    transformResults (results) {
      // 中英对照（映射关系）
      // 说明：根据读取的数据 设置中文key对应的后台中的英文key
      const zhToen = {
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      /**
       * 1. 准备一个新数组
       * 2. 循环外层数组=》所有中文key的员工数据 [{姓名：'张三'},{姓名：'李四'}] =》forEach
       * 3. 里层循环的是当前遍历的中文key的员工数据 {姓名：'张三'} =》for in
       *    获取中文key =》 通过zhToen关系 =》zhToen[中文key] 替换中文key为英文key
       *    push到新数据
       * 4. 返回新数组
       * 问题说明：excel 读取时间不对 =》excel时间要比正确时间多70年
       */
      const newArr = []
      results.forEach(item => {
        // item 中文key的员工数据
        // newItem 存储当前英文key员工数据
        const newItem = {}
        for (const zhKey in item) {
          // 获取enKey英文属性
          const enKey = zhToen[zhKey]
          // 处理excel读取到的时间 =》timeOfEntry correctionTime
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            newItem[enKey] = formatExcelDate(item[zhKey], '-')
          } else {
            // 放到新对象上并赋值
            newItem[enKey] = item[zhKey]
          }
        }
        // push到新数据
        newArr.push(newItem)
      })
      // 返回新数组(处理完的数据)
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
