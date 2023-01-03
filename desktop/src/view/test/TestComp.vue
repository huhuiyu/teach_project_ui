<script setup lang="ts">
import { NButton } from 'naive-ui'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UserInfoComp from '../../component/UserInfoComp.vue'
import PageComp from '../../component/PageComp.vue'
import dialogApi from '../../tools/dialog'

import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'
import BaseResult from '../../entity/BaseResult'

import { storeToRefs } from 'pinia'
import store from '../../store/index'

const { loginUser } = storeToRefs(store())

const router = useRouter()
const route = useRoute()

const title = '教学演示项目'
logger.debug('路由参数', route.params.comp)

const links = ref([
  { title: '分页', link: 'page' },
  { title: '用户', link: 'user' },
])

const toPage = (link: string) => {
  router.push(`/test/comp/${link}`)
}

const queryInfo = ref({
  orderBy: 1,
})
const list = ref([] as any[])
const page = ref({
  pageSize: 5,
  pageNumber: 1,
} as any)

const query = () => {
  server.post('/message/queryAll', tools.concatJson(queryInfo.value, page.value), (data: BaseResult) => {
    if (data.success) {
      list.value = data.list
      page.value = data.page
      return
    }
    dialogApi.messageError(data.message)
  })
}

const changePage = (pageInfo: any) => {
  logger.debug('更新的page信息：', pageInfo)
  page.value = pageInfo
  query()
}

query()
</script>

<template>
  <div>
    {{ title }}
  </div>

  <div v-if="route.params.comp == 'user'">
    <div>{{ loginUser }}</div>
    <hr />
    <UserInfoComp></UserInfoComp>
  </div>
  <div v-else-if="route.params.comp == 'page'">
    <span class="mr05" v-for="d in list">{{ d.title }}</span>
    <PageComp @page-change="changePage" :page="page" show-size-picker>
      <span>帖子分页：</span>
      <template v-slot:page-end>
        <span>总页数：{{ page.pageCount }}</span>
      </template>
    </PageComp>
    <PageComp @page-change="changePage" :page="page"></PageComp>
  </div>
  <div v-else> 无效的组件选择 </div>
  <div>
    <n-button size="medium" class="mr05" v-for="d in links" :key="d.link" @click="toPage(d.link)" :type="d.link == route.params.comp ? 'error' : 'info'">
      {{ d.title }}
    </n-button>
  </div>
</template>
