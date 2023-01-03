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
import { BaseListResult } from '../../entity/BaseResult'

import { storeToRefs } from 'pinia'
import store from '../../store/index'
import { MessageDetail, MessageReply, MessageDetailResult } from '../../entity/MessageDetailResult'

import { PageInfo } from '../../entity/BaseResult'

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
  orderBy: 3,
})
const list = ref([] as any[])
const page = ref(new PageInfo())

// 帖子列表
const query = () => {
  server.post('/message/queryAll', tools.concatJson(queryInfo.value, page.value), (data: BaseListResult<any>) => {
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

// 帖子详情
const detail = ref(new MessageDetail())
const dlist = ref([] as MessageReply[])
const dpage = ref(new PageInfo())
const dquery = ref({
  umid: 0,
  orderBy: 1,
})

const queryDetail = (umid: number) => {
  dquery.value.umid = umid
  server.post('/message/queryDetail', tools.concatJson(dquery.value, dpage.value), (data: MessageDetailResult) => {
    if (data.success) {
      detail.value = data.info
      dlist.value = data.list
      dpage.value = data.page
    }
  })
}
const changeDPage = (pageInfo: any) => {
  logger.debug('更新的page信息：', pageInfo)
  dpage.value = pageInfo
  queryDetail(detail.value.umid)
}
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
    <span class="mr05" v-for="d in list" @click="queryDetail(d.umid)">{{ d.title }}</span>
    <PageComp @page-change="changePage" :page="page" show-size-picker>
      <span>帖子分页：</span>
      <template v-slot:page-end>
        <span>总页数：{{ page.pageCount }}</span>
      </template>
    </PageComp>

    <h1>详情部分</h1>
    <div v-if="detail.title.length > 0">
      <div v-html="detail.info"></div>
      <div>
        <span class="mr05" v-for="d in dlist" :key="d.umrid">{{ d.info }}</span>
      </div>
      <PageComp @page-change="changeDPage" :page="dpage"></PageComp>
    </div>
  </div>
  <div v-else> 无效的组件选择 </div>
  <div>
    <n-button size="medium" class="mr05" v-for="d in links" :key="d.link" @click="toPage(d.link)" :type="d.link == route.params.comp ? 'error' : 'info'">
      {{ d.title }}
    </n-button>
  </div>
</template>
