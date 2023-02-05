<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
// 路由相关
const router = useRouter()
const route = useRoute()

const title = '教学演示项目'
const changeRouteInfo = (info: string) => {
  router.push({
    path: '/test/router',
    query: {
      abc: info,
    },
  })
}
</script>

<template>
  <div>
    {{ title }}
  </div>
  <div>
    <a href="javascript:void(0)" @click="changeRouteInfo('黑暗骑士')">测试一</a>
    |
    <a href="javascript:void(0)" @click="changeRouteInfo('batman')">测试二</a>
    |
    <a href="javascript:void(0)" @click="changeRouteInfo('' + new Date().getTime())">测试三</a>
  </div>
  <div>
    {{ route.query.abc }}
  </div>
</template>
