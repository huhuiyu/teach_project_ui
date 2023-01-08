<script setup lang="ts">
import { NButton } from 'naive-ui'
import { reactive } from 'vue'
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

const links = reactive([
  { title: '分页', link: 'page' },
  { title: '用户', link: 'user' },
])

const queryData = reactive({
  queryInfo: { orderBy: 3 },
  page: new PageInfo(),
  list: new Array<MessageDetail>(),
})

queryData.page.pageSize = 5

const toPage = (link: string) => {
  router.push(`/test/comp/${link}`)
}

// 帖子列表
const query = () => {
  server.post('/message/queryAll', tools.concatJson(queryData.queryInfo, queryData.page), (data: BaseListResult<MessageDetail>) => {
    if (data.success) {
      queryData.list = data.list
      queryData.page = data.page
      return
    }
    dialogApi.messageError(data.message)
  })
}

const changePage = (pageInfo: PageInfo) => {
  logger.debug('更新的page信息：', pageInfo)
  queryData.page = pageInfo
  query()
}

query()

// 帖子详情

const queryReplyData = reactive({
  detail: new MessageDetail(),
  page: new PageInfo(),
  list: new Array<MessageReply>(),
  queryInfo: {
    umid: 0,
    orderBy: 1,
  },
})

queryReplyData.page.pageSize = 5

const queryDetail = (umid: number) => {
  queryReplyData.queryInfo.umid = umid
  server.post('/message/queryDetail', tools.concatJson(queryReplyData.queryInfo, queryReplyData.page), (data: MessageDetailResult) => {
    if (data.success) {
      queryReplyData.detail = data.info
      queryReplyData.list = data.list
      queryReplyData.page = data.page
    }
  })
}
const changeDPage = (pageInfo: any) => {
  logger.debug('更新的page信息：', pageInfo)
  queryReplyData.page = pageInfo
  queryDetail(queryReplyData.detail.umid)
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
    <span class="mr05" v-for="d in queryData.list" @click="queryDetail(d.umid)">{{ d.title }}</span>
    <PageComp @page-change="changePage" :page="queryData.page" show-size-picker>
      <span>帖子分页：</span>
      <template v-slot:page-end>
        <span>总页数：{{ queryData.page.pageCount }}</span>
      </template>
    </PageComp>

    <h1>详情部分</h1>
    <div v-if="queryReplyData.detail.title.length > 0">
      <div v-html="queryReplyData.detail.info"></div>
      <div>
        <span class="mr05" v-for="d in queryReplyData.list" :key="d.umrid">{{ d.info }}-{{ d.user.nickname }}</span>
      </div>
      <PageComp @page-change="changeDPage" :page="queryReplyData.page"></PageComp>
    </div>
  </div>
  <div v-else> 无效的组件选择 </div>
  <div>
    <n-button size="medium" class="mr05" v-for="d in links" :key="d.link" @click="toPage(d.link)" :type="d.link == route.params.comp ? 'error' : 'info'">
      {{ d.title }}
    </n-button>
  </div>
</template>
