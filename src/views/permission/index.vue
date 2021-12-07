<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <el-button type="primary" @click="addPoint(1, '0')">
              添加权限
            </el-button>
          </el-row>
        </div>
        <!-- card body -->
        <!--
          怎么开启树形table渲染：
          1. data数据满足树形结构
          2. el-table上加row-key="id"
         -->
        <el-table row-key="id" :data="list" default-expand-all border>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPoint(2, row.id)"
              >
                添加
              </el-button>
              <el-button type="text" @click="editPonint(row.id)">
                编辑
              </el-button>
              <el-button type="text" @click="delPoint(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增/编辑 -->
    <el-dialog
      :visible.sync="showDialog"
      :title="formData.id ? '编辑权限' : '新增权限'"
      @close="close"
    >
      <el-form ref="fm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="submit">{{
            formData.id ? "编辑" : "新增"
          }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
import { formatTreeData } from '@/utils'

export default {
  data () {
    return {
      showDialog: false,
      // 权限点列表
      list: [],
      // 权限表单数据
      // formData字段说明：
      // enVisible	string 是否启用 0-不启用/1-启用
      // name	string 权限点名称
      // code	string 权限点标识（开发权限控制会使用）
      // description	string	权限点描述
      // type	number	权限类型 1-页面访问 2-页面下功能
      // pid	string	权限点父节点ID（'0'代表是页面权限 | '604f7df5f900be1850edb152'代表页面下功能权限）
      formData: {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      // 表单校验规则
      rules: {
        name: [{ required: true, message: '权限点名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限点标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 删除权限点
    // row 当前点击权限点数据
    delPoint (row) {
      /**
       * 1. 判断是否是父=》如果是，不能直接删除
       * 2. 确认后调用接口删除
       * 3. 提示并刷新列表
       */
      if (row.children && row.children.length) {
        return this.$message.error('不能直接删除父权限点！')
      }
      // console.log('go')
      this.$confirm('确认删除吗', '温馨提示').then(async () => {
        // 确定
        await delPermission(row.id)
        this.getList()
        this.$message.success('删除成功')
      }).catch(console.log)
    },
    // 编辑权限点
    // id:权限点ID
    async editPonint (id) {
      /**
       * 1. 打开新增弹层（复用）
       * 2. 调用接口获取数据回填弹层里的表单
       */
      this.showDialog = true
      const res = await getPermissionDetail(id)
      console.log(res)
      // 数据回填
      this.formData = res
    },
    // 添加权限点
    /**
     * type 权限点的类型 1-页面访问  2-页面下的功能
     * pid 父节点 如果是页面权限'0'，相反传递父ID
     */
    addPoint (type, pid) {
      /**
       * 需求：点击添加新权限点：1. 页面访问  2. 页面下的功能
       * 1. 打开弹层
       * 2. 存储type和pid=>目的提交新增调用接口使用
       */
      this.showDialog = true
      console.log(type, pid)
      // 存储type和pid
      this.formData.type = type
      this.formData.pid = pid
    },
    // 关闭弹层执行
    close () {
      // 因为新增和编辑使用同一个谈层组件需要清除状态
      // 手动清除
      this.formData = {
        enVisible: '1', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
      // 只能清除添加了校验的数据和规则
      this.$refs.fm.resetFields()
    },
    // 提交新增或编辑=》点击确定
    submit () {
      /**
       * 1. 整体校验
       * 2. 调用接口新增
       * 3. 提示并刷新列表
       * 4. 关闭弹层
       */
      this.$refs.fm.validate(async (isOk) => {
        if (isOk) {
          if (this.formData.id) {
            // 编辑
            await updatePermission(this.formData)
            this.$message.success('更新成功')
          } else {
            // 新增
            await addPermission(this.formData)
            this.$message.success('新增成功')
          }

          this.getList()
          this.showDialog = false
        }
      })
    },
    // 获取权限点列表
    async getList () {
      const res = await getPermissionList()
      console.table(res)
      // 处理树形结构
      this.list = formatTreeData(res)
      // console.log('树形：', this.list)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
