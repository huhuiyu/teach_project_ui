<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import store from '../../store/index'
const title = '教学演示项目用户信息测试页面'
// 登录用户信息相关
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)

// 路由相关
const router = useRouter()

const back = () => {
  router.push('/test')
}
</script>

<template>
  <div>
    {{ title }}
  </div>
  <hr />
  <button @click="back">返回</button>
  <hr />
  <div>
    {{ loginUser }}
  </div>
</template>
