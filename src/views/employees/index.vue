<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
          <!-- <div slot="header"> -->
          <PageTools>
            <template #left> 总计{{ total }}条数据 </template>
            <template #right>
              <el-button
                v-if="checkPoints('em-excel-in')"
                type="primary"
                size="small"
                @click="$router.push('/import')"
              >
                导入excel
              </el-button>
              <el-button type="primary" size="small" @click="exportEmployees">
                导出excel
              </el-button>
              <el-button type="primary" size="small" @click="showDialog = true">
                新增员工
              </el-button>
            </template>
          </PageTools>
          <!-- </div> -->
        </template>
        <!-- card body -->
        <!-- table列表 -->
        <!-- :default-sort 可以指定当前页加载后，数据按照那一列进行排序
        prop指定排序列
        order 排序方式：ascending 升序 | descending 降序
         -->
        <el-table
          :data="list"
          border
          :default-sort="{ prop: 'workNumber', order: 'ascending' }"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column label="头像">
            <!-- 显示员工头像 -->
            <template #default="{ row }">
              <el-row type="flex" justify="center">
                <el-image
                  class="roundImg"
                  :src="row.staffPhoto"
                  fit="fill"
                  @click="drawCode(row.staffPhoto)"
                ></el-image>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column sortable prop="workNumber" label="工号" />
          <el-table-column label="聘用形式">
            <template #default="{ row }">
              <p>{{ formatEmployment(row.formOfEmployment) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <!-- 开启当前列数据排序 =》前端假排序（只能排序一页的数据）=》真排序后端排序（一般都由后端排序好，返给前端） -->
          <el-table-column sortable prop="timeOfEntry" label="入职时间" />
          <el-table-column label="账户状态">
            <el-switch v-model="active"> </el-switch>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <template #default="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >
                查看
              </el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">
                分配角色
              </el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :current-page="params.page"
            :page-size="params.size"
            :page-sizes="[2, 5, 10]"
            :total="total"
            layout="prev, pager, next, sizes"
            @current-change="changePage"
            @size-change="changeSize"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 新增员工弹层 -->
    <AddEmployee :show-dialog="showDialog" @close-dialog="showDialog = false" />
    <!-- 绘制头像二维码 -->
    <el-dialog title="头像二维码" :visible.sync="showCode" width="30%">
      <!-- 绘制二维码区域 -->
      <el-row type="flex" justify="center">
        <!-- 画布 -->
        <canvas ref="cas"></canvas>
      </el-row>
    </el-dialog>
    <!-- 分配角色 -->
    <AssignRole ref="arole" :show-dialog.sync="showRole" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
// 导入数据字典（枚举类型）
import dataTypes from '@/api/constant/employees'
import QrCode from 'qrcode'
console.log(dataTypes)
/**
 * 格式化el-talbe某一列数据：
 * 1. 使用作用域插槽获取当前行数据
 * 2. 在methods中定义格式化方法
 */
export default {
  components: {
    AddEmployee, AssignRole
  },
  data () {
    return {
      showRole: false,
      showCode: false,
      showDialog: false,
      // 账户状态
      active: true,
      // 员工列表
      list: [],
      // 分页参数
      params: {
        page: 1,
        size: 10
      },
      // list的总条数
      total: 0
    }
  },
  created () {
    // console.log('混入方法：', this.checkPoints)
    this.getList()
  },
  methods: {
    // 打开分配角色弹层
    // id 员工ID
    assignRole (id) {
      this.showRole = true
      // 调用子组件方法获取当前用户角色数据回填
      this.$refs.arole.getUserRoles(id)
    },
    // 绘制头像二维码
    drawCode (photoUrl) {
      /**
       * 1. 弹层打开
       * 2. 绘制二维码（里边包含photoUrl数据）
       */
      this.showCode = true
      /**
       * 问题：打开弹层，vue渲染弹层中的html是异步的=》下一行代码，不能获取到最新的html渲染结果=》this.$refs.cas
       * 解决：this.$nextTick(callback)=>可以获取最新DOM =》 this.$refs.cas
       * 使用场景：
       * 核心：二维码里包含的是一个url=>网页里包含特定功能
       * 1. 微信、QQ扫码加好友
       * 2. 扫码打游戏
       * 3. 扫码支付
       */
      this.$nextTick(() => {
        // toCanvas传递2个参数：1 canvasDOM对象（画布）2. 二维码中包含的数据（只能是字符串）
        QrCode.toCanvas(this.$refs.cas, photoUrl)
      })
    },
    // 导出员工列表的数据
    async exportEmployees () {
      //  按需加载js模块（懒加载）使用 => 依赖script-loader 包
      const excel = await import('@/utils/Export2Excel')
      console.log('模块导出的方法：', excel)
      // 指定导出数据的字段(映射关系)
      const maps = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 导出头
      const header = Object.keys(maps)
      // 过滤头
      const filterHeader = Object.values(maps)
      // console.log('转换二维数组：', this.transformList(this.list, filterHeader))
      // 转换二维数组
      const data = this.transformList(this.list, filterHeader)
      excel.export_json_to_excel({
        // 数据部分
        header,
        // header: ['姓名', '年龄', '收入'], // 导出表头
        // data: [
        //   ['刘备', '40', '100W'],
        //   ['关羽', '30', '80W'],
        //   ['张飞', '28', '60W']
        // ],
        data,
        filename: 'testExport', // 导出下载文件的名字
        autoWidth: true, // excel单元格自适应宽度
        bookType: 'xlsx' // 导出文件的格式
      })
    },
    // 把list列表数据转换成二维数组
    transformList (list, filterHeader) {
      /**
       * 1. 准备一个空数组=》存储转换的结果
       * 2. 第一层循环=》当前页的员工列表数据 =》forEach =》[{},{}]
       * 3. 第二层循环=> 循环当前员工对象数据 =》for in =》{}
       *    1. 创建一个空数组=> 只存储value值
       *    2. 然后把存完值的空数组push到外层定义的数组中
       * 4. 返回处理完的结果
       */
      const secondArr = []
      list.forEach(item => {
        // item => {}
        const newArr = []
        for (const key in item) {
          // 根据指定头=》过滤数据 => 只留下指定导出的数据项
          if (filterHeader.includes(key)) {
            // 判断如果是formOfEmployment需要格式化后push
            if (key === 'formOfEmployment') {
              newArr.push(this.formatEmployment(item[key]))
            } else {
              newArr.push(item[key])
            }
          }
        }
        secondArr.push(newArr)
      })
      return secondArr
    },
    // 删除员工
    // id 当前点击员工的ID
    delEmployee (id) {
      /**
       * 1. 用户确认=》确认后
       * 2. 调用接口删除
       * 3. 刷新列表
       */
      this.$confirm('确认删除吗？', '提示').then(async () => {
        // 确定执行
        await delEmployee(id)
        this.$message.success('删除成功')
        /**
         * 组件库bug: 处理最后一页数据全部删完后列表页码正确，但数据显示错误问题（刷新列表使用的是上次的页码）
         * 解决：解决页码错误问题，使用正确页码发送请求刷新
         * 例子：总共8页数据=》把第8页数据全删了 =》还剩下7页
         * 步骤：
         * 1. 重新计算页码 => 公式：总条数 - 1 / 每页条数 = 页码
         * 2. 和之前的页码作对比=》条件：之前页码 > 重新计算页码(不存在的) => 修正页码
         */
        // 纠正页码错误 => 因为：上边已经删除一条数据了，所以需要减一
        const newPage = Math.ceil((this.total - 1) / this.params.size)
        // 页码>0(默认页码最小是1)
        if (newPage > 0) {
          // 纠正页码
          this.params.page = this.params.page > newPage ? newPage : this.params.page
        }
        // 刷新列表
        this.getList()
      }).catch(console.log)
    },
    // 格式化聘用形式=> 通过数据字典 =》根据数字，找到数字代表的含义
    // type 1 | 2
    formatEmployment (type) {
      // console.log('数据字典：', dataTypes.hireType)
      /**
       * 1. 生成映射关系 =》{1:'正式', 2:'非正式'}
       * 2. 根据映射关系找对应数字的value值
       */
      const maps = {}
      dataTypes.hireType.forEach(item => {
        maps[item.id] = item.value
      })
      // console.log(maps)
      return maps[type]
    },
    // 切换每页数据条数
    changeSize (size) {
      // console.log(size)
      this.params.size = size
      this.getList()
    },
    // 分页切换列表数据
    changePage (newPage) {
      this.params.page = newPage
      this.getList()
    },
    // 获取员工列表
    async getList () {
      const { total, rows } = await getEmployeeList(this.params)
      // console.log(rows)
      console.table(rows)
      this.list = rows
      this.total = total
    }
  }
}
</script>

<style lang="scss" scoped>
.roundImg {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background: #fff;
}
</style>
