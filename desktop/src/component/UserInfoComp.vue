<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import store from '../store/index'
import server from '../tools/server'
import tools from '../tools/tools'
import logger from '../tools/logger'
import BaseResult from '../entity/BaseResult'
import { NButton, NInput } from 'naive-ui'

// 组件事件
const emits = defineEmits(['login-change'])

// store数据
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)

// 登录相关
const formdata = reactive({
  user: {
    username: '',
    password: '',
  },
  pwd: '',
})

// 事件处理部分
const login = () => {
  formdata.user.password = tools.md5(formdata.pwd)
  formdata.pwd = ''
  server.post('/user/auth/login', formdata.user, (data: BaseResult) => {
    logger.debug(data)
    if (data.success) {
      storeInfo.updateLoginUser(() => {
        emits('login-change')
      })
    }
  })
}

const logout = () => {
  server.post(
    '/user/auth/logout',
    {},
    () => {
      storeInfo.updateLoginUser(() => {
        emits('login-change')
      })
    },
    true
  )
}
</script>

<template>
  <!-- 登录的显示区域 -->
  <div v-if="loginUser.isLogin">
    <div>{{ loginUser.tbUser.nickname }}({{ loginUser.tbUser.username }}) </div>
    <div>
      <n-button type="primary" size="medium" @click="logout">安全退出</n-button>
    </div>
  </div>
  <!-- 没有登录的显示区域 -->
  <div v-else>
    <div>
      <n-input v-model:value="formdata.user.username" type="text" placeholder="登录名" size="medium" clearable></n-input>
      <n-input v-model:value="formdata.pwd" type="password" placeholder="登录密码" size="medium" clearable></n-input>
      <n-button type="primary" size="medium" @click="login">登录</n-button>
    </div>
  </div>
</template>
