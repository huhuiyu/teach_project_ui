<script setup lang="ts">
import { NAvatar, NBackTop, NButton, NCard, NCarousel, NGi, NGrid, NList, NListItem, NMenu, NNumberAnimation, NSkeleton, NSpace, NTime, NEmpty } from 'naive-ui'
import { reactive } from 'vue'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import store from '../../store'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import server, { serverInfo } from '../../tools/server'
import { MessageDetail, Announcement } from '../../entity/MessageDetailResult'
import tools from '../../tools/tools'
import PageComp from '../../component/PageComp.vue'
import dialogApi from '../../tools/dialog'
import { convert } from '../../entity/PortableInfo'
import logger from '../../tools/logger'

//pinia
const storeInfo = store()
const { loginUser, countInfo } = storeToRefs(storeInfo)
//路由
const router = useRouter()
const route = useRoute()
const toolsData = reactive({
  messageCarousel: {
    carousel1: '',
    carousel2: '',
    carousel3: '',
    carousel4: '',
  },
  lazyUrl: 'https://service.huhuiyu.top/oss/ossinfo/openOssFile?oiid=81',
})
const queryMessageCarousel = () => {
  server.post(
    '/portable/message/queryAll',
    {
      accessKey: serverInfo.accessKey,
      messageGroup: 'messageCarousel',
      pageSize: 1000,
      pageNumber: 1,
    },
    (data: BaseListResult<any>) => {
      toolsData.messageCarousel = convert(data.list)
    }
  )
}
queryMessageCarousel()

const messageData = reactive({
  queryInfo: {
    info: route.query.info || '',
    orderBy: '1',
    username: '',
  },
  page: new PageInfo(),
  list: [] as MessageDetail[],
  loading: false,
})

//排序方式选项
const orderByMenuOptions = [
  {
    label: '最新',
    key: '1',
  },
  {
    label: '最热',
    key: '7',
  },
  {
    label: '好评',
    key: '5',
  },
]
//网站资讯
const webSiteInformation = reactive({
  total: 0,
  lastupdate: 0,
  visitors: 0,
})
if (countInfo.value != '' && countInfo.value != undefined) {
  webSiteInformation.visitors = parseInt(countInfo.value)
}

logger.debug(webSiteInformation.visitors, countInfo)
//查询所有留言信息
const queryMessage = () => {
  messageData.loading = true
  server.post('/message/queryAll', tools.concatJson(messageData.queryInfo, messageData.page), (data: BaseListResult<MessageDetail>) => {
    messageData.loading = false
    messageData.list = data.list
    messageData.page = data.page
  })
}
// 查询网站资讯
const queryMessageWebSiteInformation = () => {
  server.post('/message/queryAll', {}, (data: BaseListResult<any>) => {
    webSiteInformation.total = data.page.total
    webSiteInformation.lastupdate = data.list[0].lastupdate
  })
}
queryMessageWebSiteInformation()
//搜索部分留言信息
const searchMessage = (info: string) => {
  messageData.queryInfo.info = info
  queryMessage()
}
//当前登录用户信息
const userMessage = reactive({
  list: [new MessageDetail()],
  supportAll: 0,
  hits: 0,
})
if (loginUser.value.isLogin) {
  userMessage.supportAll = loginUser.value.userOtherInfo.supporteMessage + loginUser.value.userOtherInfo.supporteReply
  userMessage.hits = loginUser.value.userOtherInfo.totalHits
}
/* //通过姓名查询留言板
const queryMessageByUsername = (username: string) => {
  server.post(
    '/message/queryAll',
    {
      username: username,
    },
    (data: BaseListResult<MessageDetail>) => {
      userMessage.list = []
      userMessage.list = data.list
    }
  )
} */
queryMessage()
const noLoginTips = () => {
  if (!loginUser.value.isLogin) {
    dialogApi.messageWarning('请登录后再进行操作哦')
    return false
  } /* else {
    queryMessageByUsername(loginUser.value.tbUser.username)
  } */
  return true
}
//未登录提示
noLoginTips()
//点赞/取消赞留言板
const supportMessage = (umid: string = '') => {
  if (noLoginTips()) {
    server.post('/message/support', { umid: umid }, (data: BaseResult) => {
      if (data.success) {
        // queryMessageByUsername(loginUser.value.tbUser.username)
        queryMessage()
        return
      }
    })
  }
}
// 点击跳留言详情页面
const messageList = (umid: number) => {
  router.push({ path: '/message/edits', query: { umid: umid } })
}
//网站公告列表
const announcement = reactive({
  list: [] as Announcement[],
  loading: false,
  page: new PageInfo(),
})

//查询留言板公告
const queryAnnouncement = () => {
  announcement.loading = true
  server.post('/message/queryNotice', { pageNumber: 1, pageSize: 3 }, (data: BaseListResult<Announcement>) => {
    announcement.loading = false
    if (data.success) {
      announcement.list = data.list
      announcement.page = data.page
    }
  })
}
queryAnnouncement()
//查看公告详情
const queryAnnouncementDetail = (announcement: Announcement) => {
  dialogApi.showInfo({
    title: announcement.title,
    content: announcement.info,
  })
}
</script>
<template>
  <div class="container">
    <header>
      <MessageTopNavComp @queryInfo-change="searchMessage"></MessageTopNavComp>
      <n-carousel show-arrow autoplay>
        <img class="carousel-img" :src="toolsData.messageCarousel.carousel1" />
        <img class="carousel-img" :src="toolsData.messageCarousel.carousel2" />
        <img class="carousel-img" :src="toolsData.messageCarousel.carousel3" />
        <img class="carousel-img" :src="toolsData.messageCarousel.carousel4" />
        <template #arrow="{ prev, next }">
          <div class="custom-arrow">
            <button type="button" class="custom-arrow--left" @click="prev"> <i class="iconfont">&#xebef;</i></button>
            <button type="button" class="custom-arrow--right" @click="next"> <i class="iconfont">&#xe648;</i></button>
          </div>
        </template>
        <template #dots="{ total, currentIndex, to }">
          <ul class="custom-dots">
            <li v-for="index of total" :key="index" :class="{ ['is-active']: currentIndex === index - 1 }" @click="to(index - 1)" />
          </ul>
        </template>
      </n-carousel>
    </header>
    <main>
      <n-grid cols="6" x-gap="12px">
        <n-gi span="4">
          <n-card>
            <n-menu v-model:value="messageData.queryInfo.orderBy" mode="horizontal" :options="orderByMenuOptions" @update:value="queryMessage" />
            <n-card :bordered="false" v-if="messageData.loading">
              <n-space style="flex-wrap: nowrap">
                <n-skeleton height="40px" circle />
                <n-skeleton text :repeat="2" width="180px" />
                <n-skeleton text :repeat="1" width="180px" style="visibility: hidden" />
              </n-space>
              <n-skeleton text :repeat="2" />
              <n-space justify="end"> <n-skeleton text :repeat="1" width="150px" /></n-space>
            </n-card>
            <n-card v-for="item in messageData.list" :key="item.uid" :bordered="false" class="message-item" size="small" v-else>
              <template #header>
                <n-space align="center" @click="router.push(`/message/personal/${item.user.username}`)" style="cursor: pointer">
                  <div id="image-scroll-container">
                    <n-space vertical>
                      <n-avatar
                        round
                        lazy
                        :src="item.userInfo.img ? item.userInfo.img : toolsData.lazyUrl"
                        :intersection-observer-options="{
                          root: '#image-scroll-container',
                        }"
                        object-fit="cover"
                      ></n-avatar>
                    </n-space>
                  </div>
                  <n-space vertical style="gap: 0px">
                    <div>{{ item.user.nickname }}</div>
                    <div style="font-size: 12px">{{ tools.formatDate(item.lastupdate) }}</div>
                  </n-space>
                </n-space>
              </template>
              <n-button @click="messageList(item.umid)" text size="large" style="margin-left: 2.7rem">
                {{ item.title }}
              </n-button>
              <template #footer>
                <n-space justify="end" align="center">
                  <n-button @click="supportMessage(item.umid + '')" text :type="item.praise ? 'primary' : 'default'">
                    {{ item.praiseCount }}点赞
                    <template #icon>
                      <i class="iconfont">&#xec7f;</i>
                    </template>
                  </n-button>
                  <n-button text>
                    {{ item.hits }}点击量
                    <template #icon>
                      <i class="iconfont">&#xe619;</i>
                    </template>
                  </n-button>
                  <n-button text>
                    {{ item.replyCount }}评论
                    <template #icon>
                      <i class="iconfont">&#xe630;</i>
                    </template>
                  </n-button>
                </n-space>
              </template>
            </n-card>
            <PageComp :page="messageData.page" :showSizePicker="true" @number-change="queryMessage" @page-change="queryMessage" @size-change="queryMessage"></PageComp>
            <n-card v-if="!messageData.loading" :bordered="false">
              <n-empty description="暂时没有留言哦" v-if="messageData.list.length < 1 && !messageData.queryInfo.info">
                <template #icon>
                  <i class="iconfont">&#xe624;</i>
                </template>
              </n-empty>
              <n-empty description="没有找到您想看的内容哦" v-if="messageData.list.length < 1 && messageData.queryInfo.info">
                <template #icon>
                  <i class="iconfont">&#xe624;</i>
                </template>
              </n-empty>
            </n-card>
          </n-card>
        </n-gi>
        <n-gi span="2" x-gap="12px">
          <n-card style="margin-bottom: 12px">
            <template #header>
              <i style="font-size: 14px"> <i class="iconfont">&#xe696;</i> 创作中心</i>
            </template>
            <n-space justify="space-around" align="center">
              <n-button text>
                总点赞量
                <br />
                <br />
                <n-number-animation show-separator :from="0" :to="userMessage.supportAll" />
              </n-button>
              <n-button text>
                总点击量
                <br />
                <br />
                <n-number-animation show-separator :from="0" :to="userMessage.hits" />
              </n-button>
            </n-space>
            <template #footer>
              <n-button style="width: 100%" @click="tools.jumpRoute_Blank('/message/edit')">
                <template #icon>
                  <i class="iconfont">&#xe61d; </i>
                </template>
                开始创作
              </n-button>
            </template>
          </n-card>
          <n-card style="margin-bottom: 12px">
            <template #header>
              <i style="font-size: 14px"> <i class="iconfont">&#xe604;</i> 网站公告</i>
            </template>
            <n-list>
              <n-list-item class="announcement" v-for="a in announcement.list" :key="a.niid">
                <n-button text @click="queryAnnouncementDetail(a)">{{ a.title }}</n-button>
              </n-list-item>
            </n-list>
          </n-card>
          <n-card>
            <template #header>
              <i style="font-size: 14px"> <i class="iconfont">&#xe604;</i> 网站资讯</i>
            </template>
            <n-list>
              <n-list-item>
                <n-space justify="space-between">
                  <div>总留言数</div>
                  <div><n-number-animation show-separator :from="0" :to="webSiteInformation.total" /></div>
                </n-space>
              </n-list-item>
              <n-list-item>
                <n-space justify="space-between">
                  <div>本站总访客</div>
                  <div><n-number-animation show-separator :from="0" :to="parseInt(countInfo)" /></div>
                </n-space>
              </n-list-item>
              <n-list-item>
                <n-space justify="space-between">
                  <div>最后更新时间</div>
                  <div> <n-time :time="webSiteInformation.lastupdate" /></div>
                </n-space>
              </n-list-item>
            </n-list>
          </n-card>
        </n-gi>
      </n-grid>
    </main>
    <footer>
      <n-space align="center" vertical>
        <n-space style="margin-top: 12px">©2020 - 2022 By huhuiyu</n-space>
        <n-space>Vue3 | Pinia | TypeScript</n-space>
        <n-space>Hi, welcome to simple message</n-space>
      </n-space>
    </footer>
    <n-back-top :right="100" />
  </div>
</template>
<style scoped>
.container {
  background-color: rgb(246, 246, 246);
  height: 100%;
  justify-content: space-between;
}
.greyBg {
  background-color: rgb(246, 246, 246);
}

main {
  width: 60%;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
}
.message-item {
  border-top: 1px solid rgb(239, 239, 245);
}
.message-item :deep() .n-card-header {
  padding-top: 10px;
}
/* 轮播样式 */
.n-carousel {
  width: 60%;
  margin: 1rem auto;
  cursor: pointer;
  margin-bottom: 0;
}
.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.custom-arrow {
  display: flex;
  position: absolute;
  bottom: 25px;
  right: 10px;
}

.custom-arrow button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 12px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-width: 0;
  border-radius: 8px;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-arrow button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.custom-arrow button:active {
  transform: scale(0.95);
  transform-origin: center;
}

.custom-dots {
  display: flex;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.custom-dots li {
  display: inline-block;
  width: 12px;
  height: 4px;
  margin: 0 3px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.4);
  transition: width 0.3s, background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.custom-dots li.is-active {
  width: 40px;
  background: #fff;
}

footer {
  background-color: #495a80;
  height: 14vh;
  color: #fff;
}
</style>
