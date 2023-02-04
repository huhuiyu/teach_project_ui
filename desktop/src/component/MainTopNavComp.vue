<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import store from '../store'
import logger from '../tools/logger'
const router = useRouter()
const stoerInfo = store()
const { loginUser } = storeToRefs(stoerInfo)
const props = defineProps(['title', 'logo'])
logger.debug('saudifhhiuasdhfffiupojgoiusdfhgoiuh')
</script>
<template>
  <div>
    <header>
      <div class="header_title">
        <img :src="props.logo" alt="" />
        <div>{{ props.title }}</div>
      </div>
      <div class="header_menu">
        <p v-if="loginUser.isLogin == false">黑暗骑士</p>
        <p v-else>{{ loginUser.tbUser.nickname }}</p>
        <n-button @click="router.push('/')">主站</n-button>
        <n-button @click="router.push('/login')">用户</n-button>
      </div>
    </header>
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
}
.header_menu {
  display: flex;
  align-items: center;
}

.header_menu button {
  margin: 0 1rem;
}
img {
  width: 8%;
}
</style>
