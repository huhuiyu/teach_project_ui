<script setup lang="ts">
import { NAvatar, NButton, NDropdown, NInput, NInputGroup, NSpace, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { h, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseResult from '../entity/BaseResult'
import store from '../store'
import dialogApi from '../tools/dialog'
import logger from '../tools/logger'
import server from '../tools/server'
//pinia
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
//路由
const router = useRouter()
const route = useRoute()
//用户信息下拉选项
const options = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader,
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: '我的主页',
    key: 'personalHome ',
    icon: () => {
      return h('i', { class: 'iconfont', innerHTML: '&#xe6da;' })
    },
  },
  {
    label: '用户设置',
    key: 'setup',
    icon: () => {
      return h('i', { class: 'iconfont', innerHTML: '&#xe602;' })
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

const emits = defineEmits(['queryInfo-change'])
const changeQueryInfo = () => {
  emits('queryInfo-change', messageQueryInfo.info)
  router.push({
    path: '/message/home',
    query: {
      info: messageQueryInfo.info,
    },
  })
  logger.debug(messageQueryInfo.info)
}
logger.debug(router, route)

let info: any = route.query.info
const messageQueryInfo = reactive({
  info: info,
  orderBy: '1',
  username: '',
})

function renderCustomHeader() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;',
    },
    [h('div', { style: 'text-align: center;' }, [h('div', { style: 'font-size: 20px;' }, [h(NText, { depth: 1 }, { default: () => loginUser.value.tbUser.nickname })]), h('div', { style: 'font-size: 12px;' }, [h(NText, { depth: 2 }, { default: () => (loginUser.value.tbUserInfo.info ? loginUser.value.tbUserInfo.info : '毫无疑问，你是办公室里最亮的星') })])])]
  )
}
const handleSelect = (key: string | number) => {
  logger.debug(key)
  if (key == 'logOut') {
    logOut()
    return
  }
  if (key == 'personalHome ') {
    router.push('/message/personal/' + loginUser.value.tbUser.username)
    return
  }
}
const logOut = () => {
  server.post('/user/auth/logout', {}, (data: BaseResult) => {
    if (data.success) {
      dialogApi.messageInfo(data.message)
      storeInfo.updateLoginUser(() => {
        router.push('/login')
      })
    }
  })
}
</script>
<template>
  <div>
    <n-space justify="space-around" align="center" size="large" class="header">
      <n-space align="center">
        <div><n-avatar round src="https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg"></n-avatar></div>
        <n-space class="left_Menu" style="column-gap: 25px; margin-left: 2rem">
          <n-button text @click="router.push('/message/home')"> 首页 </n-button>
          <n-button text> 占位 </n-button>
          <n-button text> 占位 </n-button>
        </n-space>
      </n-space>
      <div>
        <n-input-group>
          <n-input round clearable placeholder="想了解什么呢" v-model:value="messageQueryInfo.info">
            <template #prefix>
              <i class="iconfont">&#xe605;</i>
            </template>
          </n-input>
          <n-button round ghost @click="changeQueryInfo"> 搜索 </n-button>
        </n-input-group>
      </div>
      <n-space align="center">
        <n-space v-if="loginUser.isLogin" class="avatar">
          <n-dropdown trigger="hover" :options="options" :show-arrow="true" @select="handleSelect">
            <n-avatar round :src="loginUser.tbUserInfo.img ? loginUser.tbUserInfo.img : 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'"></n-avatar>
          </n-dropdown>
        </n-space>
        <n-space v-else>
          <n-button circle secondary size="medium" v-if="!loginUser.isLogin" @click="router.push('/login')">登录</n-button>
        </n-space>
        <n-space style="column-gap: 25px; margin-left: 0.5rem" align="center">
          <n-button text> 消息 </n-button>
          <n-button text @click="router.push('/message/privateMessage')"> 私信 </n-button>
          <n-button Ghost @click="router.push('/message/edit')">
            创作中心
            <template #icon>
              <i class="iconfont">&#xe61d; </i>
            </template>
          </n-button>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
.header {
  height: 58px;
  /* background-color: hsla(0, 0%, 100%, 0.6); */
  background-color: #fff;
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  padding: 0 5rem;
}
.left_Menu > div {
  margin: 0 1rem;
  cursor: pointer;
}
</style>
