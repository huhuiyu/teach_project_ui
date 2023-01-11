<script setup lang="ts">
import { NCard, NForm, NInput, NFormItemRow, NSpin, NTabPane, NTabs, NButton, FormInst, FormItemRule } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseResult from '../entity/BaseResult'
import store from '../store'
import dialog from '../tools/dialog'
import server from '../tools/server'
import tools from '../tools/tools'
//路由
const router = useRouter()
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const loginRef = ref<FormInst | null>(null)
const registerRef = ref<FormInst | null>(null)
const loginForm = reactive({
  loginInfo: {
    username: '',
    password: '',
  },
  loading: false,
  rules: {
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: ['input', 'blur'],
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger: ['input', 'blur'],
      },
    ],
  },
})
const login = () => {
  loginRef.value?.validate().then(() => {
    loginForm.loading = true
    loginForm.loginInfo.password = tools.md5(loginForm.loginInfo.password)
    server.post('/user/auth/login', loginForm.loginInfo, (data: BaseResult) => {
      loginForm.loading = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
        storeInfo.updateLoginUser(() => {
          router.push('/')
        })
      }
      loginForm.loginInfo.password = ''
    })
  })
}
const registerForm = reactive({
  registerInfo: {
    username: '',
    nickname: '',
    password: '',
  },
  loading: false,
  rules: {
    username: [
      {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
          if (!/^[a-zA-Z][a-zA-Z0-9_-]{4,16}$/g.test(value)) return new Error('登录名必须是4-16位长度的字母和数字以及_-的组合，必须是字母开头')
          return true
        },
        message: '登录名必须是4-16位长度的字母和数字以及_-的组合，必须是字母开头',
        trigger: ['input', 'blur'],
      },
    ],
    nickname: [
      {
        required: true,
        message: '请输入昵称',
        trigger: ['input', 'blur'],
      },
    ],
    password: [
      {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
          if (!/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,16}$/g.test(value)) return new Error('密码由6-16位数字、字母或符号组成 至少含2种以上字符')
          return true
        },
        message: '密码由8-16位数字、字母或符号组成 至少含2种以上字符',
        trigger: ['input', 'blur'],
      },
    ],
  },
})
const register = () => {
  registerRef.value?.validate().then(() => {
    registerForm.loading = true
    let pwd = registerForm.registerInfo.password
    registerForm.registerInfo.password = tools.md5(registerForm.registerInfo.password)
    server.post('/user/auth/reg', registerForm.registerInfo, (data: BaseResult) => {
      registerForm.loading = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message + '即将自动登录',
          duration: 2000,
          keepAliveOnHover: true,
        })
        server.post('/user/auth/login', { username: registerForm.registerInfo.username, password: tools.md5(pwd) }, (data: BaseResult) => {
          if (data.success) {
            dialog.notifyInfo({
              content: data.message,
              duration: 2000,
              keepAliveOnHover: true,
            })
            storeInfo.updateLoginUser(() => {
              router.push('/')
            })
          }
        })
      }

      registerForm.registerInfo.password = ''
    })
  })
}
</script>
<template>
  <div class="container">
    <main>
      <n-card>
        <n-tabs default-value="signin" size="large" justify-content="space-evenly">
          <n-tab-pane name="signin" tab="登录">
            <n-form ref="loginRef" :model="loginForm.loginInfo" :rules="loginForm.rules">
              <n-form-item-row label="用户名" path="username">
                <n-input v-model:value="loginForm.loginInfo.username" placeholder="请输入用户名" clearable minlength="4" maxlength="16" />
              </n-form-item-row>
              <n-form-item-row label="密码" path="password">
                <n-input v-model:value="loginForm.loginInfo.password" type="password" clearable placeholder="请输入密码" show-password-on="mousedown" minlength="8" maxlength="16" />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong :loading="loginForm.loading" @click="login" :disabled="loginForm.loginInfo.password == ''"> 登录 </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form :model="registerForm.registerInfo" ref="registerRef" :rules="registerForm.rules">
              <n-form-item-row label="用户名" path="username">
                <n-input v-model:value="registerForm.registerInfo.username" clearable placeholder="请输入用户名" minlength="4" maxlength="16" />
              </n-form-item-row>
              <n-form-item-row label="昵称" path="nickname">
                <n-input v-model:value="registerForm.registerInfo.nickname" clearable placeholder="请输入昵称" minlength="4" maxlength="16" />
              </n-form-item-row>
              <n-form-item-row label="密码" path="password">
                <n-input v-model:value="registerForm.registerInfo.password" type="password" show-password-on="mousedown" clearable placeholder="请输入密码" minlength="8" maxlength="16" />
              </n-form-item-row>
            </n-form>
            <n-button type="primary" block secondary strong :loading="registerForm.loading" @click="register" :disabled="registerForm.registerInfo.password == ''"> 注册 </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </main>
  </div>
</template>
<style scoped>
.container {
  background-color: rgb(246, 246, 246);
  height: 100vh;
  overflow-x: hidden;
}
main {
  margin: 10rem auto;
  width: 25vw;
}
</style>
