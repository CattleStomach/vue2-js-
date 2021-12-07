<template>
  <div>
    <el-dialog
      :title="form.id ? '编辑部门' : '新增部门'"
      :visible="showDialog"
      width="45%"
      @close="close"
    >
      <!-- 新增部门表单 -->
      <el-form ref="fm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="form.name"
            style="width: 80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="form.code"
            style="width: 80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="form.manager"
            style="width: 80%"
            placeholder="请选择"
          >
            <!-- label 选项显示的值 value选中某个lable后保存的值 -->
            <el-option
              v-for="item in managers"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="form.introduce"
            style="width: 80%"
            placeholder="1-300个字符"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <!-- 具名插槽 -->
      <span slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addDept">{{
          form.id ? "编辑" : "新增"
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  props: {
    // 控制弹层显示
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作部门数据
    currentNode: {
      type: Object,
      default: () => ({})
    },
    // 所有部门数据
    allTreeData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    // 需求：新增部门填写部门的编码全局唯一
    /**
     * value 当前部门编码值
     * cb(函数） 是否校验通过
     */
    const validateCode = (rule, value, cb) => {
      // 怎么判断一个值是全局唯一=》和所有数据（所有部门数据）对比没有重复
      // 技术：arr.some(item=> value === item.code )
      /**
       * 新增和编辑不同状态校验规则的处理
       * 1. 新增=》不存在一个部门 全局唯一
       * 2. 编辑 =》存在一个部门 =》排除自身
       */
      let flag
      if (this.form.id) {
        // 编辑
        flag = this.allTreeData.some(item => value === item.code && value !== this.currentNode.code)
      } else {
        // 新增
        flag = this.allTreeData.some(item => value === item.code)
      }

      if (flag) {
        // 和之前已经存在的部门编码有重复
        cb(new Error('新增部门编码重复！'))
      } else {
        // 校验通过了（必须）
        cb()
      }
    }

    return {
      // 部门负责人数据
      managers: [],
      // 表单数据=>跟后台定义的属性保持一致
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 校验规则 =》1. 对象结构 2. 校验规则的属性和要校验表单数据的属性一一对应 3 校验规则值是数组
      rules: {
        name: [
          // 必填项（非空校验） =》 触发方式 ['blur', 'change']数组多种方式触发校验规则
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          // 长度校验
          { min: 2, max: 50, message: '部门名称要求2-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 50, message: '部门编码要求2-50个字符', trigger: ['blur', 'change'] },
          // 复杂校验
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 2, max: 300, message: '部门介绍要求2-300个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getManagers()
  },
  methods: {
    // 获取某个部门的详情数据=》回填使用
    // id 部门ID
    async getDepet (id) {
      // console.log('获取某个部门的详情数据=》回填使用', id)
      const res = await getDepartDetail(id)
      console.log(res)
      // 回填数据
      this.form = res
    },
    // 新增部门
    addDept () {
      this.$refs.fm.validate(async (isOk) => {
        // isOk 整体校验是否通过 =》true 通过/false 不通过
        if (isOk) {
          // 通过校验
          if (this.form.id) {
            // 编辑
            await updateDepartments(this.form)
            this.$message.success('更新成功！')
          } else {
            // 新增
            // pid 父部门的ID？父传子currentNode
            // 1. pid传空 添加的顶层的父部门 2. pid有值添加的就是一级往下的部门
            await addDepartments({ ...this.form, pid: this.currentNode.id || '' })
            this.$message.success('添加成功！')
          }
          // 刷新列表=》告诉父组件刷新
          this.$emit('update-tree')
          // 关闭弹层
          this.close()
        }
      })
    },
    // 获取部门负责人数据=》给新增部门做选择使用
    async getManagers () {
      const res = await getEmployeeSimple()
      console.log(res)
      this.managers = res
    },
    // 关闭弹层=>点击叉号或者遮罩层会触发
    close () {
      console.log('关闭弹层')
      // 通知父组件关闭
      this.$emit('close-dialog')
      // 手动清空=》编辑部门功能需要 =》清除多余数据
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 清空校验和数据
      // 注意：1. 没有校验的数据不能清除 2. 多出来的数据也不能清除
      this.$refs.fm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
