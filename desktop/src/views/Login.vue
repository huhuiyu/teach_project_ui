<template>
  <div class="main">
    <div class="text-center pd10 fs15">{{ title }}</div>
    <div>
      <el-card shadow="always">
        <div slot="header" class="fs12">
          <i class="iconfont">&#xe64a;</i>
          <span>用户登录</span>
        </div>
        <div v-loading="loading">
          <el-form :model="user" :rules="rules" ref="myform">
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

            <el-form-item class="text-center">
              <el-button type="primary" @click="login"> <i class="iconfont">&#xe6dd;</i> 登录 </el-button>
              <el-button type="danger" @click="resetForm"> <i class="iconfont">&#xe645;</i> 重填 </el-button>
              <el-button type="info" @click="toReg"> <i class="iconfont">&#xe6d6;</i> 注册 </el-button>
              <el-button type="text" @click="toFindPwd"> <i class="iconfont">&#xe6d6;</i> 找回密码 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
// 角色跳转路径信息
let pathInfo = {
  user: '/user/main',
  admin: '/admin/main',
  'app-admin': '/appadmin/main',
}
export default {
  name: 'Login',
  data() {
    return {
      title: '用户登录',
      loading: false,
      rules: {
        username: [
          { required: true, message: '登录名必须填写', trigger: 'blur' },
          { min: 4, max: 16, message: '登录名长度在4到16个字符', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码必须填写', trigger: 'blur' }],
      },
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    toFindPwd() {
      this.$router.push('/findpwd')
    },
    toReg() {
      this.$router.push('/user/reg')
    },
    login() {
      let app = this
      app.$refs['myform'].validate((valid) => {
        if (!valid) {
          return false
        }
        app.loading = true
        app.user.password = app.$md5(app.user.password)
        app.$ajax('/user/auth/login', app.user, (data) => {
          app.loading = false
          app.user.password = ''
          app.$alert(data.message, '登录', {
            callback: function () {
              if (data.success) {
                let loginInfo = {
                  tbUser: data.tbUser,
                  tbUserInfo: data.tbUserInfo,
                  isLogin: true,
                }
                app.$store.commit('setLoginInfo', loginInfo)
                app.$router.push(pathInfo[data.tbUser.role])
              }
            },
          })
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
