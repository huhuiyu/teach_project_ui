<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NAvatar } from 'naive-ui'
import store from '../store'
import logger from '../tools/logger'
import server from '../tools/server'
const router = useRouter()
const route = useRoute()
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const props = defineProps(['title'])
const lazyUrl = 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'
const changeRouteInfo = (info: string) => {
  if (info == route.query.abc) {
    return
  }
  router.push({
    path: '/user/userinfo',
    query: {
      abc: info,
    },
  })
}
// 退出登录
const logout = () => {
  server.post('/user/auth/logout', {}, () => {
    storeInfo.updateLoginUser(() => {
      //退出登录返回主站
      router.push('/')
    })
  })
}
if (route.query.abc == '用户信息') logger.debug('aaaaaaaaaaaaaaaaaaaaaaaaaaa')
</script>
<template>
  <div>
    <header>
      <div class="header_title">
        <div><n-avatar round size="small" :src="lazyUrl"></n-avatar></div>
        <div>{{ props.title }}</div>
      </div>
      <div class="header_menu">
        <p v-if="loginUser.isLogin == false">黑暗骑士</p>
        <p v-else>欢迎，{{ loginUser.tbUser.nickname }}</p>
        <div v-if="route.query.abc == '用户信息'">
          <n-button @click="logout">退出登录 </n-button>
        </div>
        <div v-else>
          <n-button v-if="loginUser.isLogin" @click="changeRouteInfo('用户信息')">用户信息</n-button>
          <n-button v-else @click="router.push('/login')">登录</n-button>
        </div>
        <n-button @click="router.push('/')">主站</n-button>
      </div>
    </header>
  </div>
</template>
<style scoped>
p {
  margin: 0;
}
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
  font-size: 1.1rem;
}
.header_menu {
  display: flex;
  align-items: center;
}

.header_menu button {
  margin: 0 1rem;
}
</style>
