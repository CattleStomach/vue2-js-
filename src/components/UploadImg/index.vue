<template>
  <div>
    <!-- 饿了吗图片上传组件
    关键属性说明：
    1. action 后台上传图片的接口地址
    2. show-file-list 是否显示上传完图片
    3. on-success 上传成功会执行
    4. before-upload 上传之前执行
    http-request 自定义上传（自己发请求上传）=>不走action，同时也不会执行on-success
    注意：action是必传项
    -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :http-request="uploadSelf"
      :before-upload="beforeAvatarUpload"
    >
      <!-- 显示成功上传的图片 -->
      <img v-if="src" :src="src" class="avatar" />
      <!-- 默认显示+号 -->
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <!-- 进度条组件 -->
      <el-progress
        v-if="showProgess"
        type="line"
        :percentage="percentage"
        status="success"
        :stroke-width="6"
      ></el-progress>
    </el-upload>
  </div>
</template>

<script>
// 引入腾讯云js-sdk（方法合集/工具库）包
import Cos from 'cos-js-sdk-v5'
// 初始化cos => 提供上传图片的方法
const cos = new Cos({
  SecretId: 'AKIDNHyR3QTP7mJhUoJERRGvPh0BB2WP9g6M', // 身份识别ID
  SecretKey: 'HD0znQcaKn5zeplWliS3ZM2RCjAg2BUa' // 身份秘钥
})

export default {
  name: 'UploadImg',
  props: {
    // 父组件传递的图片地址
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 上传成功图片地址（服务器）
      // imageUrl: '',
      // 控制进度条是否显示
      showProgess: false,
      // 上传进度 =》 0-100
      percentage: 0
    }
  },
  methods: {
    // 自定义上传
    // 获取图片的file对象需要结构
    uploadSelf ({ file }) {
      console.log('自定义上传:', file)
      // 开始上传=》显示进度
      this.showProgess = true
      // 调用cos方法上传图片
      // putObject 方法参数：1. 上传文件基本参数 2. 回调函数(注意：写成箭头函数，避免this拿不到)=》获取上传成功的图片地址
      cos.putObject({
        Bucket: 'hrsass-1255477649', /* 存储桶名称 必须 */
        Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
        Key: file.name, /* 文件唯一的标识 必须 */
        StorageClass: 'STANDARD', // 标准存储
        Body: file, // 上传文件File对象
        onProgress: (progressData) => {
          // 获取上传进度 progressData
          console.log(JSON.stringify(progressData))
          // 存储上传进度
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        // 》获取上传成功的图片地址
        // console.log(data)
        if (data.statusCode === 200) {
          setTimeout(() => {
            // 上传成功后显示存储到服务器的图片
            // this.imageUrl = `https://${data.Location}`
            this.$emit('update:src', `https://${data.Location}`)
            // 关闭进度条
            this.showProgess = false
          }, 800)
        }
      })
    },
    // 上传成功回调=》可以获取后台返回图片地址
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    // 上传之前校验图片格式和大小
    beforeAvatarUpload (file) {
      console.log('上传之前：', file)
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
