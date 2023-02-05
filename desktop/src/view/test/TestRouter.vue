<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import logger from '../../tools/logger'
// 路由相关
const router = useRouter()
const route = useRoute()

const title = '教学演示项目'
const changeRouteInfo = (info: string) => {
  if (info == route.query.abc) {
    return
  }
  router.push({
    path: '/test/router',
    query: {
      abc: info,
    },
  })
}

const logRouteInfo = () => {
  logger.debug('路由参数信息：', route.query.abc)
}

const abc = computed(() => {
  logRouteInfo()
  return route.query.abc
})
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
    {{ abc }}
  </div>
</template>
