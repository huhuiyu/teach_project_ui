<script setup lang="ts">
import { reactive, onMounted, onUnmounted, h } from 'vue'
import { storeToRefs } from 'pinia'
import store from '../store/index'
import logger from '../tools/logger'
import chat_service from '../tools/chat_service'
import { ChatInfo } from '../entity/ChatInfo'
import { useRouter } from 'vue-router'
import { NCard, NSpace, NInput, NThing, NButton, NBreadcrumb, NBreadcrumbItem, NText, NDropdown, NAvatar, NGradientText, NTime } from 'naive-ui'
import server from '../tools/server'
import dialogApi from '../tools/dialog'

const title = '教学演示项目-网站通用聊天室'

const router = useRouter()

// store数据
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)

if (!loginUser.value.isLogin) {
  dialogApi.showWarning({
    title: '警告',
    content: `请登录后访问`,
    positiveText: '确定',
    closable: false,
    maskClosable: false,
    onPositiveClick: () => {
      router.back()
    },
  })
}
// 聊天相关信息
const viewinfo = reactive({
  info: '',
  infos: new Array<ChatInfo>(),
  inBaseQuery: false,
})

// 聊天室相关事件
const sendInfo = () => {
  logger.debug('发送消息：', viewinfo.info)
  chat_service.sendMessage(viewinfo.info)
  viewinfo.info = ''
}
const onopenchat = () => {
  logger.debug('成功连接')
  if (viewinfo.inBaseQuery) {
    return
  }
  // 基本信息查询
  viewinfo.inBaseQuery = true
  chat_service.query()
}
const onclosechat = () => {
  logger.debug('连接关闭')
}
const onquerychat = (info: Array<ChatInfo>) => {
  logger.debug('查询结果：', info)
  viewinfo.infos = info.concat(viewinfo.infos)
  checkMaxInfo()
}
const onjoinchat = (info: ChatInfo) => {
  logger.debug('用户加入：', info)
  info.info = '加入聊天室'
  viewinfo.infos = [info].concat(viewinfo.infos)
  checkMaxInfo()
}
const oninfocchat = (info: ChatInfo) => {
  logger.debug('用户消息：', info)
  viewinfo.infos = [info].concat(viewinfo.infos)
  checkMaxInfo()
}
const onleavechat = (info: ChatInfo) => {
  logger.debug('用户离开：', info)
  info.info = '离开聊天室'
  viewinfo.infos = [info].concat(viewinfo.infos)
  checkMaxInfo()
}
const MAX = 200
const FLOAT = 150
const checkMaxInfo = () => {
  if (viewinfo.infos.length >= MAX) {
    viewinfo.infos.length = FLOAT
  }
}

// 初始化聊天室
const init = () => {
  logger.debug('初始化聊天室')
  //事件绑定
  chat_service.setOnOpen(onopenchat)
  chat_service.setOnClose(onclosechat)
  chat_service.setOnQuery(onquerychat)
  chat_service.setOnJoin(onjoinchat)
  chat_service.setOnInfo(oninfocchat)
  chat_service.setOnLeave(onleavechat)
  // 连接服务器
  chat_service.connect()
}
onMounted(init)
onUnmounted(() => {
  logger.debug('销毁聊天室')
  chat_service.disconnect()
})
// 用户信息下拉选项
const options = [
  {
    key: 'header',
    type: 'render',
    render(row: any) {
      return h(
        'div',
        {
          style: 'display: flex; align-items: center; justify-content: center; padding:12px 8px 0px 8px;',
        },
        [h('div', { style: 'text-align: center;' }, [h('div', { style: 'font-size: 20px;' }, [h(NText, { depth: 1 }, { default: () => loginUser.value.tbUser.nickname })]), h('div', { style: 'font-size: 12px;' }, [h(NText, { depth: 2 }, { default: () => (loginUser.value.tbUserInfo.info ? loginUser.value.tbUserInfo.info : '毫无疑问，你是办公室里最亮的星') })])])]
      )
    },
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: '用户信息',
    key: 'personalHome ',
    icon: () => {
      return h('i', { class: 'iconfont', innerHTML: '&#xe6da;' })
    },
  },
  {
    label: '退出登录',
    key: 'logOut',
    icon: () => {
      return h('i', { class: 'iconfont', innerHTML: '&#xe612;' })
    },
  },
]
const handleSelect = (key: string | number) => {
  if (key == 'logOut') {
    logout()
    return
  }
  if (key == 'personalHome ') {
    router.push('/user/userinfo')
    return
  }
}
const logout = () => {
  server.post('/user/auth/logout', {}, () => {
    storeInfo.updateLoginUser(() => {
      router.push('/')
    })
  })
}
</script>

<template>
  <n-space class="topNav" align="center" justify="space-between">
    <n-breadcrumb>
      <n-breadcrumb-item @click="router.push('/')"> 主站</n-breadcrumb-item>
      <n-breadcrumb-item> {{ title }}</n-breadcrumb-item>
    </n-breadcrumb>
    <NSpace v-if="loginUser.isLogin">
      <NDropdown trigger="hover" :options="options" :show-arrow="true" @select="handleSelect">
        <n-avatar round :src="loginUser.tbUserInfo.img ? loginUser.tbUserInfo.img : 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'"></n-avatar>
      </NDropdown>
    </NSpace>
    <n-space v-else>
      <n-button v-if="!loginUser.isLogin" @click="router.push('/login')">登录</n-button>
    </n-space>
  </n-space>
  <div v-if="loginUser.isLogin">
    <div class="infos">
      <div v-for="d in viewinfo.infos">
        <n-thing>
          <template #header>
            {{ d.nickname }}
            <n-gradient-text
              size="14px"
              :gradient="{
                from: 'rgb(85, 85, 85)',
                to: 'rgb(85, 85, 85)',
              }"
            >
              ( {{ d.username }})
            </n-gradient-text>
            <n-time :time="d.createDate" style="font-size: small" />
          </template>
          <n-space :wrap="false" class="mr05">
            <n-card size="small" class="is-you">{{ d.info }}</n-card>
          </n-space>
        </n-thing>
      </div>
    </div>
    <n-input
      v-model:value="viewinfo.info"
      style="background-color: rgb(250, 250, 254)"
      type="textarea"
      show-count
      autofocus
      maxlength="300"
      size="large"
      :autosize="{
        maxRows: 5,
        minRows: 5,
      }"
    >
      <template #suffix>
        <n-button @click="sendInfo" :disabled="viewinfo.info.trim() == '' || !chat_service.isConnected()">发送</n-button>
      </template>
    </n-input>
  </div>

  <!-- <div>
    {{ viewinfo }}
  </div> -->
</template>
<style scoped>
.color {
  color: rgb(85, 85, 85);
}
.show {
  display: block;
}
.hide {
  display: none;
}
.infos {
  overflow-y: auto;
  height: 70vh;
  border-radius: 5px;
  margin-bottom: 5px;
}
.infos > div {
  padding: 1rem;
}
.topNav {
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  background-color: hsla(0, 0%, 100%, 0.6);
  padding: 1rem 4rem;
}
.is-you {
  border-radius: 16px 16px 16px 0px;
  border-top-right-radius: 16px;
  border-top-left-radius: 0px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  background-color: rgb(244, 245, 245);
}
</style>
