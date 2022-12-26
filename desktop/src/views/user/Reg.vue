<template>
  <div class="main">
    <div class="text-center pd10 fs15">{{ title }}</div>
    <div>
      <el-card shadow="always">
        <div slot="header" class="fs12">
          <i class="iconfont">&#xe696;</i>
          <span>用户注册</span>
        </div>
        <div v-loading="loading">
          <el-form ref="myform" :model="user" :rules="rules">
            <el-form-item prop="username">
              <el-input placeholder="登录名" v-model="user.username">
                <i slot="prefix" class="el-input__icon iconfont">&#xe60a;</i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" show-password placeholder="密码" v-model="user.password">
                <i slot="prefix" class="el-input__icon iconfont">&#xe601;</i>
              </el-input>
            </el-form-item>
            <el-form-item prop="pwd2">
              <el-input type="password" show-password placeholder="确认密码" v-model="user.pwd2">
                <i slot="prefix" class="el-input__icon iconfont">&#xe620;</i>
              </el-input>
            </el-form-item>
            <el-form-item prop="nickname">
              <el-input placeholder="用户名称" v-model="user.nickname">
                <i slot="prefix" class="el-input__icon iconfont">&#xe6da;</i>
              </el-input>
            </el-form-item>

            <el-form-item class="text-center">
              <el-button type="primary" @click="reg"> <i class="iconfont">&#xe71c;</i> 注册 </el-button>
              <el-button type="danger" @click="resetForm"> <i class="iconfont">&#xe645;</i> 重填 </el-button>
              <el-button type="info" @click="toLogin"> <i class="iconfont">&#xe6dd;</i> 登录 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import logger from '../../js/logger'
export default {
  name: 'UserReg',
  data() {
    let validatePwd2 = (rule, value, callback) => {
      logger.debug(rule, value, callback)
      if (value === '') {
        callback(new Error('确认密码必须填写'))
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      title: '用户注册',
      user: {
        username: '',
        password: '',
        nickname: '',
        pwd2: '',
      },
      rules: {
        username: [
          { required: true, message: '登录名必须填写', trigger: 'blur' },
          { min: 4, max: 16, message: '登录名长度在4到16个字符', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码必须填写', trigger: 'blur' }],
        pwd2: [{ validator: validatePwd2, trigger: 'blur' }],
        nickname: [{ required: true, message: '用户名称必须填写', trigger: 'blur' }],
      },
    }
  },
  methods: {
    toLogin() {
      this.$router.push('/login')
    },
    reg() {
      let app = this
      app.$refs['myform'].validate((valid) => {
        if (!valid) {
          return false
        }
        app.loading = true
        app.user.pwd2 = ''
        app.user.password = app.$md5(app.user.password)
        app.$ajax('/user/auth/reg', app.user, (data) => {
          app.loading = false
          app.user.password = ''
          app.$alert(data.message, '注册')
        })
      })
    },
    resetForm() {
      this.$refs['myform'].resetFields()
    },
  },
}
</script>
<style>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.main > :last-child {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main > :first-child {
  background-color: #409eff;
  color: #ffffff;
}
</style>
