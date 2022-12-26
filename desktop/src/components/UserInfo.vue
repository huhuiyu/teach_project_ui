<template>
  <div>
    <div v-loading="loading">
      <div class="userinfo" v-if="loginInfo.isLogin">
        <el-dropdown split-button type="primary" @command="handleCommond">
          <span>
            <i class="iconfont">&#xe60a;</i>
            {{ loginInfo.tbUser.nickname }}
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <i class="iconfont">&#xe64a;</i>
              <span>用户信息</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <i class="iconfont">&#xe612;</i>
              <span>安全退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="login" v-if="!loginInfo.isLogin">
        <el-form :inline="true" :model="user" ref="myform">
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
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      loading: false,
      isLogin: false,
      user: {
        username: '',
        password: '',
      },
      loginInfo: {
        tbUser: '',
        tbUserInfo: '',
      },
    }
  },
  methods: {
    handleCommond(command) {
      if ('logout' == command) {
        this.logout()
      }
    },
    login() {
      let app = this
      app.loading = true
      app.user.password = app.$md5(app.user.password)
      app.$ajax('/user/auth/login', app.user, (data) => {
        app.user.password = ''
        app.$alert(data.message, '登录', {
          callback: function () {
            if (data.success) {
              app.getUserInfo()
            } else {
              app.loading = false
            }
          },
        })
      })
    },
    resetForm() {
      this.$refs['myform'].resetFields()
    },
    logout() {
      this.loading = true
      this.$ajax('/user/auth/logout', {}, (data) => {
        this.loading = false
        this.loginInfo = {
          tbUser: '',
          tbUserInfo: '',
          isLogin: false,
        }
        this.$store.commit('removeLoginInfo')
        this.$emit('user-changed', false)
        this.$alert(data.message, '安全退出')
      })
    },
    getUserInfo() {
      this.loading = true
      this.$ajax('/user/auth/getUserInfo', {}, (data) => {
        this.loading = false
        if (data.success) {
          this.loginInfo = {
            tbUser: data.tbUser,
            tbUserInfo: data.tbUserInfo,
            isLogin: true,
          }
          this.$store.commit('setLoginInfo', this.loginInfo)
        } else {
          this.loginInfo.isLogin = false
          this.$store.commit('removeLoginInfo')
        }
        this.$emit('user-changed', data.success)
      })
    },
  },
  created() {
    this.getUserInfo()
  },
}
</script>
<style scoped>
.login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 1rem;
}

.userinfo {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 0.5rem;
}
</style>
