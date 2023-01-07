<script setup lang="ts">
import { FormInst, FormItemInst, NAvatar, NButton, NCard, NForm, NFormItem, NInput, NSpin } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseResult from '../../entity/BaseResult'
import dialog from '../../tools/dialog'
// import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'
//路由
const store = useRouter()
//找回密码的模式
const phoneOrEmail = ref(false)
//步骤
const steps = ref({
  mode: 'phone',
  step: 1,
})
//下一步是否允许
const stepNext = ref({
  first: true,
  second: true,
  third: true,
})
const loading = ref({
  imgCode: false,
  phoneCode: false,
  phonePwd: false,
  emailCode: false,
  emailPwd: false,
})
//图片验证码参数
const imgCode = ref({
  url: '',
})
//邮箱找回密码参数
const emailInfo = ref({
  code: '',
  username: '',
  password: '',
  okPwd: '',
})
//邮箱找回密码校验规则
const emailRules = {
  code: [
    {
      required: true,
      validator: () => {
        if (!/^\d{6}$/.test(emailInfo.value.code)) return new Error('请输入邮箱的验证码')
        return true
      },
      message: '请输入邮箱的验证码',
      trigger: ['input', 'blur'],
    },
  ],
  username: [
    {
      key: 'username',
      required: true,
      validator: () => {
        if (emailInfo.value.username == '') return new Error('请输入用户名')
        return true
      },
      message: '请输入用户名',
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      validator: () => {
        if (!/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,16}$/g.test(emailInfo.value.password)) return new Error('密码由6-16位数字、字母或符号组成 至少含2种以上字符')
        return true
      },
      message: '密码由8-16位数字、字母或符号组成 至少含2种以上字符',
      trigger: ['input', 'blur'],
    },
  ],
  okPwd: [
    {
      required: true,
      validator: () => {
        if (emailInfo.value.password != emailInfo.value.okPwd) return new Error('两次密码不相同')
        return true
      },
      message: '两次密码不相同',
      trigger: ['input', 'blur'],
    },
  ],
}
//手机号找回密码参数
const phoneInfo = ref({
  username: '',
  password: '',
  imgCode: '',
  code: '',
  okPwd: '',
})
//手机号找回密码校验规则
const phoneRules = {
  username: [
    {
      key: 'username',
      required: true,
      validator: () => {
        if (phoneInfo.value.username == '') return new Error('请输入用户名')
        return true
      },
      message: '请输入用户名',
      trigger: ['input', 'blur'],
    },
  ],
  imgCode: [
    {
      key: 'imgCode',
      required: true,
      validator: () => {
        if (!/^[0-9A-Za-z]{5}$/.test(phoneInfo.value.imgCode)) return new Error('图片验证码')
        return true
      },
      message: '请输入图片验证码',
      trigger: ['input', 'blur'],
    },
  ],
  code: [
    {
      key: 'code',
      required: true,
      validator: () => {
        if (!/^\d{6}$/.test(phoneInfo.value.code)) return new Error('六位数验证码')
        return true
      },
      message: '请输入手机的验证码',
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      validator: () => {
        if (!/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,16}$/g.test(phoneInfo.value.password)) return new Error('密码由6-16位数字、字母或符号组成 至少含2种以上字符')
        return true
      },
      message: '密码由8-16位数字、字母或符号组成 至少含2种以上字符',
      trigger: ['input', 'blur'],
    },
  ],
  okPwd: [
    {
      required: true,
      validator: () => {
        if (phoneInfo.value.password != phoneInfo.value.okPwd) return new Error('两次密码不相同')
        return true
      },
      message: '两次密码不相同',
      trigger: ['input', 'blur'],
    },
  ],
}
//第一步找回密码模式的ref
const phoneRef = ref<FormItemInst | null>(null)
const emailRef = ref<FormItemInst | null>(null)
const imgCodeRef = ref<FormItemInst | null>(null)
const emailCodeRef = ref<FormItemInst | null>(null)
const phoneUpdateRef = ref<FormInst | null>(null)
const emailUpdateRef = ref<FormInst | null>(null)

//判断是否能够进行下一步
/**
 *
 * @param mode 找回模式
 * @param steps 第几步
 */
function nextStep(mode: string, steps: number) {
  if (steps == 1) {
    if (mode == 'phone') {
      phoneRef.value
        ?.validate()
        .then(() => {
          stepNext.value.first = false
        })
        .catch(() => {
          stepNext.value.first = true
        })
      return
    }
    if (mode == 'email') {
      emailRef.value
        ?.validate()
        .then(() => {
          stepNext.value.first = false
        })
        .catch(() => {
          stepNext.value.first = true
        })
      return
    }
    if (mode == '') {
      stepNext.value.first = true
      return
    }
  } else if (steps == 2) {
    if (mode == 'phone') {
      imgCodeRef.value
        ?.validate()
        .then(() => {
          stepNext.value.second = false
        })
        .catch(() => {
          stepNext.value.second = true
        })
    } else if ('email') {
      emailCodeRef.value
        ?.validate()
        .then(() => {
          stepNext.value.second = false
        })
        .catch(() => {
          stepNext.value.second = true
        })
    }
    return
  } else if (steps == 3) {
    if (mode == 'phone') {
      phoneUpdateRef.value
        ?.validate()
        .then(() => {
          stepNext.value.third = false
        })
        .catch(() => {
          stepNext.value.third = true
        })
    } else if ('email') {
      emailUpdateRef.value
        ?.validate()
        .then(() => {
          stepNext.value.third = false
        })
        .catch(() => {
          stepNext.value.third = true
        })
    }
    return
  }
}
//根据模式判断下一步
function modeNext() {
  if (phoneOrEmail.value) {
    steps.value.mode = 'email'
    steps.value.step = 2
  } else {
    steps.value.mode = 'phone'
    steps.value.step = 2
  }
}
//切换找回模式
function changeMode() {
  phoneOrEmail.value = !phoneOrEmail.value
  phoneInfo.value.username = ''
  emailInfo.value.username = ''
  nextStep('', 1)
}
//发送图片验证码
function sendImgCode() {
  loading.value.imgCode = true
  server.post('/tool/getImageCode', {}, (data: BaseResult) => {
    loading.value.imgCode = false
    imgCode.value.url = data.message
  })
}
sendImgCode()
//发送手机验证码
function sendPhoneCode() {
  loading.value.phoneCode = true
  server.post(
    '/tool/sendUserValidateCode',
    { imageCode: phoneInfo.value.imgCode, username: phoneInfo.value.username },
    (data: BaseResult) => {
      loading.value.phoneCode = false
      if (data.success) {
        steps.value.step = 3
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
        sendImgCode()
        phoneInfo.value.imgCode = ''
        if (data.message == '验证码长期有效，无需重复发送') {
          steps.value.step = 3
          return
        }
      }
    },
    true
  )
}
//手机找回修改密码
function updatePwdByPhone() {
  loading.value.phonePwd = true
  server.post(
    '/user/auth/findPwdByPhone',
    {
      code: phoneInfo.value.code,
      username: phoneInfo.value.username,
      password: tools.md5(phoneInfo.value.password),
    },
    (data: BaseResult) => {
      loading.value.phonePwd = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
        phoneInfo.value.password = ''
        phoneInfo.value.okPwd = ''
      } else {
        dialog.notifyWarning({
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
      }
      phoneInfo.value.password = ''
      phoneInfo.value.okPwd = ''
    },
    true
  )
}
//发送邮箱验证码
function sendEmailCode() {
  loading.value.emailCode = true
  server.post(
    '/tool/sendUserEmailCode',
    {
      username: emailInfo.value.username,
    },
    (data: BaseResult) => {
      loading.value.emailCode = false
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
//邮箱找回修改密码
function updatePwdByEmail() {
  loading.value.emailPwd = true
  server.post(
    '/user/auth/findPwdByEmail',
    {
      code: emailInfo.value.code,
      username: emailInfo.value.username,
      password: tools.md5(emailInfo.value.password),
    },
    (data: BaseResult) => {
      loading.value.emailPwd = false
      if (data.success) {
        dialog.notifyInfo({
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
        emailInfo.value.password = ''
        emailInfo.value.okPwd = ''
      } else {
        dialog.notifyWarning({
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
      }
    },
    true
  )
}
function reset() {
  steps.value.mode = 'phone'
  steps.value.step = 1
  for (const key in phoneInfo.value) {
    phoneInfo.value[key] = ''
  }
  for (const key in emailInfo.value) {
    emailInfo.value[key] = ''
  }
}
</script>
<template>
  <div>
    <header>
      <div class="header_title">
        <n-avatar round size="small" src="https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg"></n-avatar>
        <div>用户安全中心</div>
      </div>
      <div class="header_menu">
        <n-button text @click="reset">重新选择</n-button>
        <n-button text>反馈问题</n-button>
        <n-button text @click="store.push('/login')">登录</n-button>
      </div>
    </header>

    <main>
      <n-card title="| 找回密码" style="padding: 4rem" hoverable>
        <n-form v-if="steps.step == 1">
          <n-form-item label="通过手机号找回" v-if="!phoneOrEmail" :rule="phoneRules.username" ref="phoneRef">
            <n-input placeholder="请输入用户名" v-model:value="phoneInfo.username" @update:value="nextStep('phone', 1)" maxlength="16" />
          </n-form-item>
          <n-form-item label="通过邮箱找回" v-else :rule="emailRules.username" ref="emailRef">
            <n-input placeholder="请输入用户名" v-model:value="emailInfo.username" @update:value="nextStep('email', 1)" />
          </n-form-item>
          <n-form-item>
            <n-button type="info" round style="width: 100%" :disabled="stepNext.first" @click="modeNext">下一步</n-button>
          </n-form-item>
          <n-button text style="width: 100%" @click="changeMode">{{ phoneOrEmail ? '使用手机号找回密码' : '使用邮箱找回密码' }}</n-button>
        </n-form>
        <div v-if="steps.mode == 'phone'">
          <n-form v-if="steps.step == 2">
            <div style="margin: 0px 0px 10px 3.5px"> 通过手机号找回</div>
            <n-form-item label="请输入图片验证码" :rule="phoneRules.imgCode" ref="imgCodeRef">
              <n-input placeholder="请输入图片验证" v-model:value="phoneInfo.imgCode" maxlength="5" @update:value="nextStep('phone', 2)" />
              <n-spin :show="loading.imgCode">
                <img :src="imgCode.url" alt="图片验证码" @click="sendImgCode" />
              </n-spin>
            </n-form-item>
            <n-form-item>
              <n-button type="info" round style="width: 100%" :disabled="stepNext.second" @click="sendPhoneCode" :loading="loading.phoneCode">发送手机验证</n-button>
            </n-form-item>
          </n-form>
          <n-form v-if="steps.step == 3" ref="phoneUpdateRef" :rules="phoneRules">
            <div style="margin: 0px 0px 10px 3.5px"> 通过手机号找回</div>
            <n-form-item label="请输入手机验证码" path="code">
              <n-input placeholder="请输入手机验证" v-model:value="phoneInfo.code" maxlength="6" @update:value="nextStep('phone', 3)" />
            </n-form-item>
            <n-form-item label="新密码" path="password">
              <n-input placeholder="请输入新密码" type="password" show-password-on="mousedown" v-model:value="phoneInfo.password" maxlength="16" @update:value="nextStep('phone', 3)" />
            </n-form-item>
            <n-form-item label="确认密码" path="okPwd">
              <n-input placeholder="再次输入密码" type="password" show-password-on="mousedown" v-model:value="phoneInfo.okPwd" maxlength="16" @update:value="nextStep('phone', 3)" />
            </n-form-item>
            <n-form-item>
              <n-button type="info" round style="width: 100%" :disabled="stepNext.third" @click="updatePwdByPhone" :loading="loading.phonePwd">修改</n-button>
            </n-form-item>
          </n-form>
        </div>
        <div v-else>
          <n-form v-if="steps.step == 2">
            <div style="margin: 0px 0px 10px 3.5px"> 通过邮箱找回</div>
            <n-form-item label="用户名" :rule="emailRules.username">
              <n-input placeholder="请输入用户名" v-model:value="emailInfo.username" disabled />
            </n-form-item>
            <n-form-item label="请输入邮箱验证码" :rule="emailRules.code" ref="emailCodeRef">
              <n-input placeholder="请输入邮箱验证码" v-model:value="emailInfo.code" maxlength="6" @update:value="nextStep('email', 2)" />
              <n-button dashed @click="sendEmailCode" :loading="loading.emailCode"> 发送邮箱验证码 </n-button>
            </n-form-item>
            <n-form-item>
              <n-button type="info" round style="width: 100%" :disabled="stepNext.second" @click="steps.step = 3" :loading="loading.phoneCode">下一步</n-button>
            </n-form-item>
          </n-form>
          <n-form v-if="steps.step == 3" ref="emailUpdateRef" :rules="emailRules">
            <div style="margin: 0px 0px 10px 3.5px"> 通过邮箱找回</div>
            <n-form-item label="新密码" path="password">
              <n-input placeholder="请输入新密码" type="password" show-password-on="mousedown" v-model:value="emailInfo.password" maxlength="16" @update:value="nextStep('mail', 3)" />
            </n-form-item>
            <n-form-item label="确认密码" path="okPwd">
              <n-input placeholder="再次输入密码" type="password" show-password-on="mousedown" v-model:value="emailInfo.okPwd" maxlength="16" @update:value="nextStep('email', 3)" />
            </n-form-item>
            <n-form-item>
              <n-button type="info" round style="width: 100%" :disabled="stepNext.third" @click="updatePwdByEmail" :loading="loading.emailPwd">修改</n-button>
            </n-form-item>
          </n-form>
        </div>
      </n-card>
    </main>
  </div>
</template>
<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsla(0, 0%, 100%, 0.6);
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  padding: 15px 50px;
}

.header_title {
  display: flex;
  font-size: 1.2rem;
  align-items: center;
}

.header_menu {
  display: flex;
  align-items: center;
}
.header_menu > button:not(:last-of-type)::after {
  content: '|';
  margin: 0 1rem;
}
main {
  width: 35vw;
  margin: 4rem auto;
}
</style>
