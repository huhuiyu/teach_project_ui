<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { NSpin } from 'naive-ui'
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import store from '../../store/index'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'
import TestUserInfoComp from './TestUserInfoComp.vue'
import FileInfo from '../../entity/FileInfo'

const title = '教学演示项目测试页面'
logger.debug('测试debug输出', { message: 'debug' })
logger.info('测试info输出', { message: 'info' })
logger.error('测试错误输出', { message: 'error' })
logger.debug('格式化时间：', tools.formatDate(new Date()), tools.formatDate(1671952711000, 'yyyy-MM-dd ms yyyy年'), tools.formatDate(new Date(), 'hh:mm:ss:ms'))

// 路由相关
const router = useRouter()
const route = useRoute()

// 登录用户信息相关
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)

tools.changeTitle('测试页')

// 业务逻辑
const echo = ref('')
const echoResult = ref({})

const sendEcho = () => {
  server.get('/', { echo: echo.value }, (data: any) => {
    echoResult.value = data
  })
}

const loading = ref(false)
const password = ref('')

const login = () => {
  loading.value = true
  server.post(
    '/user/auth/login',
    {
      username: 'user',
      password: tools.md5(password.value),
    },
    (data: any) => {
      password.value = ''
      logger.debug(data)
      if (data.success) {
        storeInfo.updateLoginUser((user: any) => {
          loading.value = false
          logger.debug('用户信息：', user)
        })
        return
      }
      loading.value = false
    }
  )
}
// 如果自动弹出信息，就无法处理处理回调
const errorLogin = () => {
  loading.value = true
  server.post(
    '/user/auth/login',
    {
      username: 'user',
      password: '',
    },
    (data: any) => {
      loading.value = false
      logger.debug(data)
      alert(data.message)
    },
    true
  )
}

const logout = () => {
  loading.value = true
  server.post('/user/auth/logout', {}, () => {
    storeInfo.updateLoginUser(() => {
      loading.value = false
    })
  })
}

const toUserInfo = () => {
  router.push({
    path: '/test/userinfo',
    query: {
      formurl: route.path,
    },
  })
}
// 文件上传的部分 =================================================
const fileinfo = ref('')
const upfileinfo = ref(new FileInfo())
const browserFile = () => {
  upfileinfo.value = new FileInfo()
  imgdata.value = ''
  tools.openFile((file: FileInfo) => {
    upfileinfo.value = file
    if (file.file == null) {
      return
    }
    tools.readImg(file.file, (result: string) => {
      imgdata.value = result
    })
  })
}
const imgdata = ref('')
const upload = () => {
  logger.debug('上传文件中。。。')
  if (upfileinfo.value.file == null) {
    return
  }
  server.upload(
    '/user/file/upload',
    upfileinfo.value.file,
    {
      fileinfo: fileinfo.value,
    },
    (data: any) => {
      logger.debug('文件上传的结果：', data)
      if (data.success) {
        logger.debug('文件地址：', server.getDownloadUrl(data.data.fid))
        alert(server.getDownloadUrl(data.data.fid))
      }
    }
  )
}
logger.debug('下载地址信息判定：', server.isDownloadUrl('https://service.huhuiyu.top/teach_project_service/user/file/download?fid=32'), server.isDownloadUrl('1https://service.huhuiyu.top/teach_project_service/user/file/download?fid=32'), server.isDownloadUrl('https://service.huhuiyu.top/teach_project_download/32bataman-01.jpg'))

// 生命周期和计算属性================================================
onBeforeMount(() => {
  logger.debug('页面挂载之前')
})
onMounted(() => {
  logger.debug('页面挂载完成')
})
onBeforeUpdate(() => {
  logger.debug('页面更新之前')
})
onUpdated(() => {
  logger.debug('页面更新完成')
})
onBeforeUnmount(() => {
  logger.debug('页面销毁之前')
})
onUnmounted(() => {
  logger.debug('页面销毁完成')
})

const x = ref(0)
const y = ref(0)

const add = computed(() => {
  return `${x.value}+${y.value}=${parseInt(x.value.toString()) + parseInt(y.value.toString())}`
})
</script>

<template>
  <div>
    {{ title }}
  </div>
  <hr />
  <div>
    {{ loginUser }}
  </div>
  <hr />
  <div>
    {{ echo }}
    <input type="text" v-model="echo" />
    <button @click="sendEcho">发送</button>
    {{ echoResult }}
  </div>
  <hr />
  <div>
    <n-spin :show="loading" size="medium">
      <input type="password" v-model="password" placeholder="密码" />
      <button @click="login">登录测试</button>
      <button @click="logout">安全退出</button>
      <button @click="toUserInfo">跳转用户测试页面</button>
      <button @click="errorLogin">错误登录测试</button>
    </n-spin>
  </div>
  <div>
    <TestUserInfoComp></TestUserInfoComp>
  </div>
  <hr />
  <input type="text" v-model="fileinfo" placeholder="文件描述信息" />
  <button @click="browserFile">浏览文件</button>
  <button :disabled="upfileinfo.file == null || !loginUser.isLogin" @click="upload">上传文件</button>
  <div>{{ upfileinfo }}</div>
  <!-- <div>{{ imgdata }}</div> -->
  <div v-if="upfileinfo.type == 'image'">
    <img :src="imgdata" alt="" />
  </div>
  <hr />
  <div>
    {{ tools.md5('abc') }}
    <br />
    {{ tools.formatDate(new Date()) }}
    <br />
    {{ tools.formatFileSize(1125024) }}
  </div>
  <hr />
  <div>
    <input type="number" v-model="x" />
    <input type="number" v-model="y" />
    {{ add }}
  </div>
</template>
<style>
img {
  display: block;
  max-width: 20rem;
  height: auto;
}
</style>
