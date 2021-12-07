<template>
  <div class="department-container">
    <div class="app-container">
      <!-- el-card当做容器组件使用 -->
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 具名插槽header=> 指定卡片头部内容 -->
        <!-- <div slot="header"> -->
        <template #header>
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <!-- 公司名字 -->
              <span>{{ companyInfo.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>负责人</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- 向公司下添加部门=》一级部门 -->
                      <el-dropdown-item @click.native="addDept()">
                        添加子部门
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        <!-- </div> -->
        <!-- card body =》默认插槽指定卡片内容 -->
        <div>
          <!-- <slot :data="node" :index="index"  /> -->
          <el-tree
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <!--
            1. 自定义树的节点结构和样式
            2. 借助作用域插槽获取树节点数据
             -->
            <template #default="{ data }">
              <el-row style="width: 100%">
                <el-col :span="20">
                  <!--左侧： 部门名字 -->
                  <span>{{ data.name }}</span>
                </el-col>
                <el-col :span="4">
                  <!-- 右侧 -->
                  <el-row type="flex" justify="end">
                    <!-- 两个内容 -->
                    <!-- 部门负责人 -->
                    <el-col>{{ data.manager || "ceo" }}</el-col>
                    <el-col>
                      <!-- 下拉菜单 element -->
                      <el-dropdown>
                        <span> 操作<i class="el-icon-arrow-down" /> </span>
                        <!-- 下拉菜单 =》部门操作按钮 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addDept(data)">
                            添加子部门
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="editDept(data)">
                            编辑部门
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="delDepet(data)">
                            删除部门
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-tree>
        </div>
      </el-card>
    </div>
    <!-- 新增部门       :all-tree-data="" -->
    <AddDept
      ref="edit"
      :show-dialog="showDialog"
      :current-node="currentNode"
      :all-tree-data="allTreeData"
      @close-dialog="showDialog = false"
      @update-tree="getAll"
    />
  </div>
</template>

<script>
import { getDepartments, delDepartments } from '@/api/departments'
import { formatTreeData } from '@/utils'
// 导入新增部门组件
import AddDept from './components/add-dept'

export default {
  components: {
    AddDept
  },
  data () {
    return {
      // 控制弹层
      showDialog: false,
      // 公司信息
      companyInfo: { name: '' },
      // 公司组织架构数据
      /**
       * 数据结构：树形数据结构(父子嵌套关系)
       * 处理树形结构：找规律=》父子部门的关系
       * 后台数据规律：
       * 1. 父部门的pid是空
       * 2. 子部门的pid有值=》是父部门的ID
       * [
       * // 顶级部门
       *   {
       *     name:'总裁办'
       *   },
       *   {
       *     name:'研发部',
       *     children:[
       *        {
       *          name:'前端'
       *        },
       *        {
       *          name:'后端'
       *        }
       *     ]
       *   }
       * ]
       */
      treeData: [],
      // 自定义树形组件数据属性名
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 所有部门数据
      allTreeData: [],
      // 当前点击的部门数据
      currentNode: null
    }
  },
  created () {
    this.getAll()
  },
  methods: {
    // 打开添加弹层 => 新增
    addDept (node) {
      // 存储当前点击的部门数据=> 新增部门使用
      this.currentNode = node
      this.showDialog = true
    },
    // 打开编辑部门弹层
    editDept (node) {
      this.currentNode = node
      this.showDialog = true
      // 回填当前编辑部门的数据=》调用接口获取最新的部门数据
      // 打开的时候获取到当前编辑部门的ID=》调用接口
      // 父组件调用子组件方法=》技术：使用ref
      // console.log(this.$refs.edit)
      this.$refs.edit.getDepet(node.id)
    },

    // data 当前点击节点的数据
    handleNodeClick (data) {
      console.log(data)
    },
    // 获取所有部门数据
    async getAll () {
      const { companyName, depts } = await getDepartments()
      console.table(depts)
      // 存储所有部门数据
      this.allTreeData = depts
      // 存储公司信息
      this.companyInfo.name = companyName
      // 存储部门数据
      // 格式化部门数据=》处理树形结构
      // 课外知识：深拷贝：JSON.parse(JSON.stringify(depts))=》回炉重造
      this.treeData = formatTreeData(depts)
      // this.treeData = depts
    },
    // 删除部门
    delDepet (node) {
      console.log('当前操作的部门：', node)
      /**
       * 步骤：
       * 1. 判断是否是父级部门=》如果是不能删除
       * 2. 子部门可以删除
       * 3. 数据库删除：调用接口
       * 4. 提示并刷新列表
       */
      if (node.children && node.children.length > 0) {
        return this.$message({
          message: '不能删除父部门，请先删除子部门！',
          type: 'warning'
        })
      }
      // 提示用户是否确认删除
      this.$confirm(`确认删除${node.name}吗？`, '提示').then(async () => {
        // 点击确定
        await delDepartments(node.id)
        this.$message.success(
          '删除成功！'
        )
        // 刷新列表
        this.getAll()
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
//scss使用 ::v-deep 作为深度作用选择符（less的 /deep/）
::v-deep .el-tree-node__content {
  margin: 3px 0;
  font-size: 14px;
}
</style>
