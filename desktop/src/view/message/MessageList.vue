<script setup lang="ts">
import { reactive } from 'vue'
import { NBackTop, NEmpty, NAvatar, NButton, NCard, NTime, NGi, NInput, NTabs, NTabPane, NGrid, NSkeleton, NSpace } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
import BaseResult, { PageInfo } from '../../entity/BaseResult'
import { MessageDetail, MessageDetailResult, MessageReply } from '../../entity/MessageDetailResult'
import dialogApi from '../../tools/dialog'
import server from '../../tools/server'
import tools from '../../tools/tools'
import store from '../../store'
import { storeToRefs } from 'pinia'
import PageComp from '../../component/PageComp.vue'
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const Route = useRoute()
const router = useRouter()
const queryUmid = reactive({
  umid: Route.query.umid,
})
const loadings = reactive({
  loading: false,
})
const comments = reactive({
  info: '',
  umid: Route.query.umid,
})
const MessageDataList = reactive({
  info: new MessageDetail(),
  list: [] as MessageReply[],
  page: new PageInfo(),
})
const lazyUrl = 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'
const queryMessageList = reactive({
  umid: queryUmid.umid,
  orderBy: '2',
})
const successTrue = (message: any) => {
  dialogApi.notifyInfo({
    title: '成功',
    content: message,
    duration: 2000,
    keepAliveOnHover: true,
  })
}
const successFalse = (message: any) => {
  dialogApi.notifyError({
    title: '失败',
    content: message,
    duration: 2000,
    keepAliveOnHover: true,
  })
}
// 获取评论详细信息
const searchMessageList = () => {
  MessageDataList.list = []
  MessageDataList.info = new MessageDetail()
  MessageDataList.page = new PageInfo()
  loadings.loading = true
  server.post('/message/queryDetail', tools.concatJson(queryMessageList, MessageDataList.page), (data: MessageDetailResult) => {
    if (data.success) {
      loadings.loading = false
      MessageDataList.page = data.page
      MessageDataList.list = data.list
      MessageDataList.info = data.info
    } else {
      successFalse(data.message)
    }
  })
}
searchMessageList()

// 切换标签页
const updatequerymessageLise = () => {
  searchMessageList()
}
// 点赞与取消
const supportMessage = (value: string) => {
  loadings.loading = true
  if (!loginUser.value.isLogin) {
    dialogApi.messageWarning('请登录后再进行操作哦')
    return false
  } else {
    server.post('/message/supportReply', { umrid: value }, (data: BaseResult) => {
      if (data.success) {
        loadings.loading = false
        searchMessageList()
      }
    })
  }
}
// 关注取消关注
const actionconcern = (username: string) => {
  loadings.loading = true
  if (!loginUser.value.isLogin) {
    dialogApi.messageWarning('请登录后再进行操作哦')
    return false
  } else {
    server.post('/message/followUser', { username: username }, (data: BaseResult) => {
      if (data.success) {
        loadings.loading = false
        searchMessageList()
        if (MessageDataList.info.userOtherInfo.mineFollow) {
        } else {
          successTrue('操作成功')
        }
      } else {
        successFalse(data.message)
      }
    })
  }
}
// 发布评论
const pushComments = () => {
  // comments
  loadings.loading = true
  if (!loginUser.value.isLogin) {
    dialogApi.messageWarning('请登录后再进行操作哦')
    return false
  } else {
    server.post('/message/addReply', comments, (data: BaseResult) => {
      if (data.success) {
        loadings.loading = false
        searchMessageList()
        successTrue('发布成功')
        comments.info = ''
      }
    })
  }
}
// 发布用户删除评论
const delMessageData = (umrid: number) => {
  loadings.loading = true
  if (!loginUser.value.isLogin) {
    dialogApi.messageWarning('请登录后再进行操作哦')
    return false
  } else {
    server.post('/message/manage/deletUserMessageReply', { umrid: umrid }, (data: BaseResult) => {
      if (data.success) {
        loadings.loading = false
        searchMessageList()
        successTrue('删除成功')
      }
    })
  }
}
</script>
<template>
  <div class="container">
    <header>
      <MessageTopNavComp></MessageTopNavComp>
    </header>
    <main>
      <n-grid cols="1">
        <n-gi span="1">
          <!-- 帖子信息骨架框 -->
          <n-card class="messageListTitle" v-if="loadings.loading">
            <n-space vertical size="large" style="flex-wrap: nowrap">
              <n-space>
                <n-skeleton text height="40px" circle />
                <n-space vertical>
                  <n-skeleton text height="15px" width="300px" />
                  <n-skeleton text height="15px" width="300px" />
                </n-space>
              </n-space>
              <n-skeleton text :repeat="4" />
              <n-space justify="end">
                <n-skeleton :repeat="1" text width="150px" />
              </n-space>
            </n-space>
          </n-card>
          <!-- 帖子信息详情 -->
          <n-card v-else>
            <n-space vertical size="large" style="flex-wrap: nowrap">
              <n-space justify="space-between">
                <n-space align="center">
                  <n-avatar
                    size="small"
                    lazy
                    round
                    :src="MessageDataList.info.userInfo.img ? MessageDataList.info.userInfo.img : lazyUrl"
                    :intersection-observer-options="{
                      root: '#image-scroll-container',
                    }"
                    object-fit="cover"
                  />
                  <n-space text size="large" vertical style="gap: 0px">
                    <div>{{ MessageDataList.info.user.nickname }}</div>
                    <div><n-time :time="MessageDataList.info.userInfo.lastupdate"></n-time></div>
                  </n-space>
                </n-space>
                <n-space>
                  <n-button strong secondary type="warning" @click="actionconcern(MessageDataList.info.user.username)" v-if="MessageDataList.info.userOtherInfo.mineFollow"> 取消关注 </n-button>
                  <n-button strong secondary type="info" @click="actionconcern(MessageDataList.info.user.username)" v-else> 关注 </n-button>
                </n-space>
              </n-space>
              <n-space text size="large">
                <div style="text-indent: 3em" v-html="MessageDataList.info.info"></div>
              </n-space>
              <n-space justify="end">
                <n-button @click="supportMessage(MessageDataList.info.umid + '')" text :type="MessageDataList.info.praise ? 'primary' : 'default'">
                  {{ MessageDataList.info.praiseCount }}点赞
                  <template #icon>
                    <i class="iconfont">&#xec7f;</i>
                  </template>
                </n-button>
                <n-button text>
                  {{ MessageDataList.info.hits }}点击量
                  <template #icon>
                    <i class="iconfont">&#xe619;</i>
                  </template>
                </n-button>
                <n-button text>
                  举报
                  <template #icon>
                    <i class="iconfont">&#xe630;</i>
                  </template>
                </n-button>
              </n-space>
            </n-space>
          </n-card>
          <!-- 评论排序 -->
          <n-card>
            <n-tabs type="line" v-model:value="queryMessageList.orderBy" @update:value="updatequerymessageLise">
              <n-tab-pane animated name="2" tab="最新"></n-tab-pane>
              <n-tab-pane name="3" tab="最热"></n-tab-pane>
            </n-tabs>
          </n-card>
          <!-- 发布评论 -->
          <n-card class="paddingtopstyle">
            <div class="inpuTextareaStype" justify="space-between">
              <n-input v-model:value="comments.info" type="textarea" placeholder="发一条友善的评论把"></n-input>
              <n-button @click="pushComments()">发送</n-button>
            </div>
          </n-card>
          <!-- 判断是否有评论 -->
          <n-card v-if="MessageDataList.page.total != 0">
            <!--评论骨架框  -->
            <n-card :bordered="false" v-if="loadings.loading">
              <n-space style="flex-wrap: nowrap">
                <n-skeleton height="40px" circle />
                <n-space vertical>
                  <n-skeleton text width="180px" />
                  <n-skeleton text width="180px" />
                </n-space>
              </n-space>
              <n-skeleton text :repeat="2" />
              <n-space justify="end"> <n-skeleton text :repeat="1" width="150px" /></n-space>
            </n-card>
            <!-- 评论详细信息 -->
            <n-card v-for="item in MessageDataList.list" :key="item.umrid" size="small" :bordered="false" v-else>
              <template #header>
                <n-space align="center">
                  <div id="image-scroll-container">
                    <n-space>
                      <n-avatar
                        round
                        lazy
                        :src="item.userInfo.img ? item.userInfo.img : lazyUrl"
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
              <n-space text size="large" style="margin-left: 2.7rem">
                {{ item.info }}
              </n-space>
              <template #footer>
                <n-space justify="end" align="center">
                  <n-button @click="supportMessage(item.umrid + '')" text :type="item.praise ? 'primary' : 'default'">
                    {{ item.praiseCount }}点赞
                    <template #icon>
                      <i class="iconfont">&#xec7f;</i>
                    </template>
                  </n-button>
                  <n-button @click="delMessageData(item.umrid)" text v-if="item.mine">
                    删除
                    <template #icon>
                      <i class="iconfont">&#xe68e;</i>
                    </template>
                  </n-button>
                  <n-button text>
                    举报
                    <template #icon>
                      <i class="iconfont">&#xe630;</i>
                    </template>
                  </n-button>
                </n-space>
              </template>
            </n-card>
          </n-card>
          <n-card v-else>
            <n-empty description="什么也有没">
              <template #extra>
                <n-button size="small" @click="router.push('/message/home')"> 看看别的 </n-button>
              </template>
            </n-empty>
          </n-card>
          <PageComp :page="MessageDataList.page" :show-size-picker="true" @number-change="searchMessageList()" @page-change="searchMessageList()"></PageComp>
        </n-gi>
      </n-grid>
    </main>
    <footer :class="{ footermartop: MessageDataList.page.total <= 5 }">
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
  background-color: rgb(246, 245, 246);
  height: 100%;
  justify-content: space-between;
  min-height: 100vh;
}
.n-carousel {
  width: 60%;
  margin: 1rem auto;
  margin-bottom: 0px;
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
main {
  width: 60%;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
}
.inpuTextareaStype {
  display: flex;
  justify-content: space-between;
}
:deep() .inpuTextareaStype .n-input {
  margin-right: 12px;
}
:deep() .n-input-wrapper {
  background-color: #f1f2f3;
  transition: all 0.3s;
}
:deep() .n-input-wrapper:hover {
  background-color: #fff;
}
:deep() .inpuTextareaStype .n-input__textarea-el {
  height: 3.5rem;
  background-image: url(https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=566);
  background-repeat: no-repeat;
  background-size: 12%;
  background-position: 100%;
  overflow: hidden;
  background-color: #f1f2f3;
  border: 1px solid #f1f2f3;
  transition: all 0.3s;
}
:deep() .inpuTextareaStype .n-input__textarea-el:hover {
  background-color: #fff;
  border: 1px solid #fff;
}
:deep() .inpuTextareaStype .n-button {
  height: 3.5rem;
  background-color: #f1f2f3;
}
:deep() .inpuTextareaStype .n-button:hover {
  background-color: #fff;
}
:deep() .paddingtopstyle .n-card__content {
  padding-top: 0px;
}
.messageListTitle {
  height: 240px;
}
footer {
  background-color: #495a80;
  height: 14vh;
  color: #fff;
}
.footermartop {
  margin-top: 10%;
}
</style>
