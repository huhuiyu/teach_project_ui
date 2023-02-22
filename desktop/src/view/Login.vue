<script setup lang="ts">
import { NCard, NForm, NInput, NFormItemRow, NTabPane, NTabs, NButton, FormInst, FormItemRule } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseResult from '../entity/BaseResult'
import store from '../store'
import dialog from '../tools/dialog'
import logger from '../tools/logger'
import server from '../tools/server'
import tools from '../tools/tools'
//路由
const router = useRouter()
const storeInfo = store()
const route = useRoute()

//登录ref
const loginRef = ref<FormInst | null>(null)
const emailLoginRef = ref<FormInst | null>(null)
const emailRegRef = ref<FormInst | null>(null)
//注册ref
const phoneRegRef = ref<FormInst | null>(null)
const phoneLoginRef = ref<FormInst | null>(null)
const registerRef = ref<FormInst | null>(null)
//账号登录相关
const loginForm = reactive({
  loginInfo: {
    username: '',
    password: '',
  },
  loading: false,
  oldUrl: '/',
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
if (route.query.oldUrl != '' && route.query.oldUrl != undefined) {
  loginForm.oldUrl = route.query.oldUrl + ''
}
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
          router.push(loginForm.oldUrl)
        })
      }
      loginForm.loginInfo.password = ''
    })
  })
}
//邮箱登录相关
const emailLoginForm = reactive({
  loginInfo: {
    email: '',
    info: '',
  },
  loading: false,
  codeLoading: false,
  rules: {
    email: [
      {
        required: true,
        message: '请输入正确的邮箱格式',
        key: 'email',
        validator: (_: any, value: string) => {
          if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(value)) return new Error('请输入正确的邮箱格式')
          return true
        },
        trigger: ['input', 'blur'],
      },
    ],
    info: [
      {
        required: true,
        message: '请输入正确的邮箱验证码',
        validator: (_: any, value: string) => {
          if (!/^\d{6}$/.test(value)) return new Error('请输入正确的邮箱验证码')
          return true
        },
        trigger: ['input', 'blur'],
      },
    ],
  },
})
//邮箱注册相关
const emailRegisterForm = reactive({
  regInfo: {
    email: '',
    info: '',
  },
  loading: false,
  codeLoading: false,
  rules: tools.concatJson({}, emailLoginForm.rules),
})
//发送邮箱验证码（登录/注册）
const sendEmailCode = (mode: string) => {
  logger.debug(emailRegisterForm.rules)
  mode == 'login'
    ? emailLoginRef
    : emailRegRef.value?.validate(
        (errors) => {
          if (!errors) {
            mode == 'login' ? (emailLoginForm.codeLoading = true) : (emailRegisterForm.codeLoading = true)
            server.post(
              '/tool/sendEmailCode',
              {
                email: mode == 'login' ? emailLoginForm.loginInfo.email : emailRegisterForm.regInfo.email,
              },
              (data: BaseResult) => {
                mode == 'login' ? (emailLoginForm.codeLoading = false) : (emailRegisterForm.codeLoading = false)
                if (data.success) {
                  dialog.notifyInfo({
                    content: data.message,
                    duration: 2000,
                    keepAliveOnHover: true,
                  })
                } else {
                  dialog.notifyError({
                    content: data.message,
                    duration: 2000,
                    keepAliveOnHover: true,
                  })
                }
              },
              true
            )
          }
        },
        (rule) => {
          return rule?.key === 'email'
        }
      )
}
const emailLogin = () => {
  emailLoginRef.value?.validate().then(() => {
    emailLoginForm.loading = true
    server.post('/user/auth/emailLogin', emailLoginForm.loginInfo, (data: BaseResult) => {
      emailLoginForm.loading = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
        storeInfo.updateLoginUser(() => {
          router.push(loginForm.oldUrl)
        })
      }
      emailLoginForm.loginInfo.info = ''
    })
  })
}
const emailReg = () => {
  emailRegRef.value?.validate().then(() => {
    emailRegisterForm.loading = true
    server.post('/user/auth/emailReg', emailRegisterForm.regInfo, (data: BaseResult) => {
      emailRegisterForm.loading = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message + '请勿操作稍后即将登录',
          duration: 2000,
          keepAliveOnHover: true,
        })
        emailLoginForm.loginInfo.email = emailRegisterForm.regInfo.email
        emailLoginForm.loginInfo.info = emailRegisterForm.regInfo.info
        emailLogin()
      }
      emailRegisterForm.regInfo.info = ''
    })
  })
}
//手机号登录相关
const phoneLoginForm = reactive({
  loginInfo: {
    phone: '',
    info: '',
  },
  code: {
    imgCode: '',
    imgUrl: '',
  },
  loading: false,
  phoneLoading: false,
  imgLoading: false,
  rules: {
    phone: [
      {
        required: true,
        message: '请输入正确的手机格式',
        key: 'phone',
        validator: (_: any, value: string) => {
          if (!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
          return true
        },
        trigger: ['input', 'blur'],
      },
    ],
    info: [
      {
        required: true,
        message: '请输入正确的手机验证码',
        validator: (_: any, value: string) => {
          if (!/^\d{6}$/.test(value)) return new Error('请输入正确的手机验证码')
          return true
        },
        trigger: ['input', 'blur'],
      },
    ],
    imgCode: [
      {
        key: 'imgCodeKey',
        required: true,
        message: '图片验证码',
        validator: (_: any, value: string) => {
          logger.debug(_, value)
          if (!/^[0-9A-Za-z]{4}$/.test(phoneLoginForm.code.imgCode != '' ? phoneLoginForm.code.imgCode : phoneRegForm.code.imgCode)) return new Error('图片验证码')
          return true
        },

        trigger: ['input', 'blur'],
      },
    ],
  },
})
//手机号注册相关
const phoneRegForm = reactive({
  regInfo: {
    phone: '',
    info: '',
  },
  code: {
    imgCode: '',
    imgUrl: '',
  },
  loading: false,
  phoneLoading: false,
  imgLoading: false,
  rules: tools.concatJson({}, phoneLoginForm.rules),
})
const sendImgCode = () => {
  server.post('/tool/getImageCode', {}, (data: BaseResult) => {
    phoneLoginForm.code.imgUrl = data.message
    phoneRegForm.code.imgUrl = data.message
  })
}
sendImgCode()
const sendPhoneCode = (mode: string) => {
  mode == 'login'
    ? phoneLoginRef.value
    : phoneRegRef.value
        ?.validate(
          () => {},
          (rule) => {
            return rule?.key === 'phone'
          }
        )
        .then(() => {
          mode == 'login'
            ? phoneLoginRef
            : phoneRegRef.value
                ?.validate(
                  () => {},
                  (rule2) => {
                    return rule2?.key === 'imgCodeKey'
                  }
                )
                .then(() => {
                  mode == 'login' ? (phoneLoginForm.loading = true) : (phoneRegForm.loading = true)
                  server.post(
                    '/tool/sendValidateCode',
                    {
                      imageCode: mode == 'login' ? phoneLoginForm.code.imgCode : phoneRegForm.code.imgCode,
                      phone: mode == 'login' ? phoneLoginForm.loginInfo.phone : phoneRegForm.regInfo.phone,
                    },
                    (data: BaseResult) => {
                      mode == 'login' ? (phoneLoginForm.loading = false) : (phoneRegForm.loading = false)
                      dialog.notifyWarning({
                        content: data.message,
                        duration: 2000,
                        keepAliveOnHover: true,
                      })
                      if (!data.success) sendImgCode()
                    },
                    true
                  )
                })
                .catch((error) => {
                  logger.error(error)
                })
        })
        .catch((error) => {
          logger.error(error)
        })
}
const phoneLogin = () => {
  phoneLoginRef.value?.validate().then(() => {
    phoneLoginForm.loading = true
    server.post('/user/auth/phoneLogin', phoneLoginForm.loginInfo, (data: BaseResult) => {
      phoneLoginForm.loading = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
        storeInfo.updateLoginUser(() => {
          router.push(loginForm.oldUrl)
        })
      }
      phoneLoginForm.loginInfo.info = ''
    })
  })
}

const phoneReg = () => {
  phoneRegRef.value?.validate().then(() => {
    phoneRegForm.loading = true
    server.post('/user/auth/phoneReg', phoneRegForm.regInfo, (data: BaseResult) => {
      phoneRegForm.loading = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message + '请勿操作稍后即将登录',
          duration: 2000,
          keepAliveOnHover: true,
        })
        phoneLoginForm.loginInfo.phone = phoneRegForm.regInfo.phone
        phoneLoginForm.loginInfo.info = phoneRegForm.regInfo.info
        phoneLogin()
      }

      phoneRegForm.regInfo.info = ''
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
              router.push(loginForm.oldUrl)
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
        <n-tabs default-value="signin" type="segment" size="large" justify-content="space-evenly" animated>
          <n-tab-pane name="signin" tab="登录">
            <n-tabs default-value="accountNumberLogin" animated>
              <n-tab-pane name="accountNumberLogin" tab="账号登录">
                <n-form ref="loginRef" :model="loginForm.loginInfo" :rules="loginForm.rules" label-placement="left">
                  <n-form-item-row path="username">
                    <n-input v-model:value="loginForm.loginInfo.username" placeholder="请输入用户名" clearable minlength="4" maxlength="16" />
                  </n-form-item-row>
                  <n-form-item-row path="password">
                    <n-input v-model:value="loginForm.loginInfo.password" type="password" clearable placeholder="请输入密码" show-password-on="mousedown" minlength="8" maxlength="16" />
                  </n-form-item-row>
                </n-form>
                <n-button type="primary" block secondary strong :loading="loginForm.loading" @click="login" :disabled="loginForm.loginInfo.password == ''"> 登录 </n-button>
              </n-tab-pane>
              <n-tab-pane name="emailLogin" tab="邮箱登录">
                <n-form ref="emailLoginRef" :model="emailLoginForm.loginInfo" :rules="emailLoginForm.rules" label-placement="left">
                  <n-form-item-row path="email">
                    <n-input v-model:value="emailLoginForm.loginInfo.email" placeholder="请输入邮箱" clearable />
                  </n-form-item-row>
                  <n-form-item-row path="info">
                    <n-input v-model:value="emailLoginForm.loginInfo.info" clearable placeholder="请输入邮箱验证码" minlength="6" maxlength="6" />
                    <n-button dashed @click="sendEmailCode('login')" :loading="emailLoginForm.codeLoading" :disabled="emailLoginForm.loginInfo.email == ''"> 发送邮箱验证码 </n-button>
                  </n-form-item-row>
                </n-form>
                <n-button type="primary" block secondary strong :loading="emailLoginForm.loading" @click="emailLogin" :disabled="emailLoginForm.loginInfo.info == ''"> 登录 </n-button>
              </n-tab-pane>
              <n-tab-pane name="phoneLogin" tab="手机登录">
                <n-form ref="phoneLoginRef" :model="phoneLoginForm.loginInfo" :rules="phoneLoginForm.rules" label-placement="left">
                  <n-form-item-row path="phone">
                    <n-input v-model:value="phoneLoginForm.loginInfo.phone" placeholder="请输入手机号" clearable minlength="11" maxlength="11" />
                  </n-form-item-row>
                  <n-form-item-row path="imgCode">
                    <n-input placeholder="图片验证码" clearable v-model:value="phoneLoginForm.code.imgCode" :maxlength="4" />
                    <img :src="phoneLoginForm.code.imgUrl" @click="sendImgCode" />
                  </n-form-item-row>
                  <n-form-item-row path="info">
                    <n-input v-model:value="phoneLoginForm.loginInfo.info" clearable placeholder="请输入手机验证码" minlength="6" maxlength="6" />
                    <n-button dashed @click="sendPhoneCode('login')" :loading="phoneLoginForm.phoneLoading" :disabled="phoneLoginForm.code.imgCode == ''"> 发送手机验证码 </n-button>
                  </n-form-item-row>
                </n-form>
                <n-button type="primary" block secondary strong :loading="phoneLoginForm.loading" @click="phoneLogin" :disabled="phoneLoginForm.loginInfo.info == ''"> 登录 </n-button>
              </n-tab-pane>
            </n-tabs>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-tabs accountNumberLogin="accountReg" animated>
              <n-tab-pane name="accountReg" tab="账号注册">
                <n-form :model="registerForm.registerInfo" ref="registerRef" :rules="registerForm.rules" label-placement="left">
                  <n-form-item-row path="username">
                    <n-input v-model:value="registerForm.registerInfo.username" clearable placeholder="请输入用户名" minlength="4" maxlength="16" />
                  </n-form-item-row>
                  <n-form-item-row path="nickname">
                    <n-input v-model:value="registerForm.registerInfo.nickname" clearable placeholder="请输入昵称" minlength="4" maxlength="16" />
                  </n-form-item-row>
                  <n-form-item-row path="password">
                    <n-input v-model:value="registerForm.registerInfo.password" type="password" show-password-on="mousedown" clearable placeholder="请输入密码" minlength="8" maxlength="16" />
                  </n-form-item-row>
                </n-form>
                <n-button type="primary" block secondary strong :loading="registerForm.loading" @click="register" :disabled="registerForm.registerInfo.password == ''"> 注册 </n-button>
              </n-tab-pane>
              <n-tab-pane name="emailReg" tab="邮箱注册">
                <n-form ref="emailRegRef" :model="emailRegisterForm.regInfo" :rules="emailRegisterForm.rules" label-placement="left">
                  <n-form-item-row path="email">
                    <n-input v-model:value="emailRegisterForm.regInfo.email" placeholder="请输入邮箱" clearable />
                  </n-form-item-row>
                  <n-form-item-row path="info">
                    <n-input v-model:value="emailRegisterForm.regInfo.info" clearable placeholder="请输入邮箱验证码" minlength="6" maxlength="6" />
                    <n-button dashed @click="sendEmailCode('reg')" :loading="emailRegisterForm.codeLoading" :disabled="emailRegisterForm.regInfo.email == ''"> 发送邮箱验证码 </n-button>
                  </n-form-item-row>
                </n-form>
                <n-button type="primary" block secondary strong :loading="emailRegisterForm.loading" @click="emailReg" :disabled="emailRegisterForm.regInfo.info == ''"> 注册 </n-button>
              </n-tab-pane>
              <n-tab-pane name="phoneReg" tab="手机注册">
                <n-form ref="phoneRegRef" :model="phoneRegForm.regInfo" :rules="phoneRegForm.rules" label-placement="left">
                  <n-form-item-row path="phone">
                    <n-input v-model:value="phoneRegForm.regInfo.phone" placeholder="请输入手机号" clearable minlength="11" maxlength="11" />
                  </n-form-item-row>
                  <n-form-item-row path="imgCode">
                    <n-input placeholder="图片验证码" clearable v-model:value="phoneRegForm.code.imgCode" :maxlength="4" />
                    <img :src="phoneRegForm.code.imgUrl" @click="sendImgCode" />
                  </n-form-item-row>
                  <n-form-item-row path="info">
                    <n-input v-model:value="phoneRegForm.regInfo.info" clearable placeholder="请输入手机验证码" minlength="6" maxlength="6" />
                    <n-button dashed @click="sendPhoneCode('reg')" :loading="phoneRegForm.phoneLoading" :disabled="phoneRegForm.code.imgCode == ''"> 发送手机验证码 </n-button>
                  </n-form-item-row>
                </n-form>
                <n-button type="primary" block secondary strong :loading="phoneRegForm.loading" @click="phoneReg" :disabled="phoneRegForm.regInfo.info == ''"> 注册 </n-button>
              </n-tab-pane>
            </n-tabs>
          </n-tab-pane>
        </n-tabs>
        <template #footer> <div style="font-size: 12px; color: #18a058">登录方式和注册方式相对应、绑定邮箱或手机并不影响。</div> </template>
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
