<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- card body -->
        <!-- 标签页组件 -->
        <el-tabs>
          <!-- 放置页签1 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRole"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 =》列表数据-->
            <el-table :data="roleList">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <!-- 使用默认插槽自定义显示操作按钮 -->
                <template #default="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assingPoints(row.id)"
                  >
                    分配权限
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >
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
              <!-- 分页组件 -->
              <el-pagination
                :current-page="pages.page"
                :total="total"
                :page-size="pages.pagesize"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 页签2 -->
          <el-tab-pane label="公司信息">
            <h1>黑马程序员129</h1>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增角色弹出层 -->
    <el-dialog
      :title="roleForm.id ? '编辑角色' : '新增角色'"
      :visible.sync="showDialog"
      width="50%"
      @close="close"
    >
      <!-- 表单 -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <span slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRole">确定</el-button>
      </span>
    </el-dialog>
    <!-- 角色分配权限 -->
    <AssignPoints ref="ap" :show-dialog.sync="showPoints" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, addRole, getRoleDetail, updateRole } from '@/api/setting'
import AssignPoints from './components/assign-points.vue'
export default {
  components: {
    AssignPoints
  },
  data () {
    return {
      showPoints: false,
      // 角色表单数据
      roleForm: {
        name: '',
        description: ''
      },
      // 角色表单校验
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          // 生效
          { min: 2, max: 10, message: '角色名长度为2~10位', trigger: 'blur' }
        ]
      },
      // 控制弹层显示
      showDialog: false,
      //  角色列表
      roleList: [],
      // 总条数
      total: 0,
      // 分页数据
      pages: {
        page: 1,
        pagesize: 10
      }
    }
  },
  created () {
    this.getRole()
  },
  methods: {
    // 打开给角色分配权限的弹层
    assingPoints (roleId) {
      this.showPoints = true
      this.$refs.ap.getRoleSeledPoints(roleId)
    },
    // 新增/编辑角色
    submitRole () {
      /**
       * 1. 整体校验
       * 2. 校验通过调用接口新增
       * 3. 刷新列表和关闭弹层
       */
      this.$refs.roleForm.validate(async (isOk) => {
        console.log(isOk)
        if (isOk) {
          if (this.roleForm.id) {
            // 编辑
            await updateRole(this.roleForm)
            this.$message.success('更新角色成功')
          } else {
            // 新增
            await addRole(this.roleForm)
            this.$message.success('新增角色成功')
          }

          this.showDialog = false
          this.pages.page = 1
          this.getRole()
        }
      })
    },
    // 编辑角色
    async editRole (id) {
      const res = await getRoleDetail(id)
      console.log(res)
      this.roleForm = res
      this.showDialog = true
    },
    // 新增打开弹层
    addRole () {
      this.showDialog = true
    },
    // 关闭弹层
    close () {
      console.log('close')
      // 清空表单数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
    },
    // 删除角色
    delRole (id) {
      console.log('当前点击行角色的ID：', id)
      /**
       * 1. 让用户确认=》确认后执行删除
       * 2. 调用接口删除=》提示
       * 3. 刷新列表
       */
      this.$confirm('确认删除吗？', '提示').then(async () => {
        // 点击确认
        await deleteRole(id)
        this.$message.success('删除成功！')
        // 重置页码
        this.pages.page = 1
        this.getRole()
      }).catch(console.log)
    },
    // 获取角色列表数据
    async getRole () {
      const { total, rows } = await getRoleList(this.pages)
      console.table(rows)
      // 存储列表数据
      this.roleList = rows
      // 总条数
      this.total = total
    },
    // 切换页码
    changePage (newPage) {
      console.log(newPage)
      // 1. 修改页码
      this.pages.page = newPage
      // 2. 重新调用接口刷新列表
      this.getRole()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
