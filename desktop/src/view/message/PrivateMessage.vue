<script setup lang="ts" name="privateMessage">
import { MenuOption, NButton, NCard, NGi, NGrid, NMenu, NSpace, NInput, NAvatar, NText, NList, NListItem, NEmpty, NDivider, NBadge, NSkeleton, NScrollbar } from 'naive-ui'
import { reactive, h } from 'vue'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import store from '../../store'
import BaseResult, { BaseListResult } from '../../entity/BaseResult'
import server from '../../tools/server'
import { MessageFollow, PrivateMessage } from '../../entity/MessageDetailResult'
import logger from '../../tools/logger'
//pinia
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const route = useRoute()

const toolsData = reactive({
  loading: {
    sendMessage: false,
    twoMenu: false,
  },
  oneMenu: {
    value: 'myMessage',
  },
})
//消息中心菜单项
const menuOptions: MenuOption[] = [
  {
    label: '我的消息',
    key: 'myMessage',
  },
  {
    label: '好友申请',
    key: 'friend',
  },
]
//我的消息菜单项
const messageMenuOptions: MenuOption[] = [{ key: '', label: '' }]
const privateMessageUserData = reactive({
  list: [] as MessageFollow[],
})
const privateMessageByUserData = reactive({
  username: '',
  userImg: '',
  list: [] as PrivateMessage[],
})
//从其他页面进入私信，添加到消息队列中
const orderUser = reactive(new MessageFollow())
if (route.query.username) {
  logger.debug(route.query, 'kkkkkkkkkkk')
  let query = JSON.parse(JSON.stringify(route.query))
  orderUser.user.username = query.username
  orderUser.userInfo.img = query.img
  orderUser.user.nickname = query.nickname
}
//查询当前用户所有私信
const queryPrivateMessageUser = () => {
  toolsData.loading.twoMenu = true
  server.post('/user/auth/findPrivateMessageUserInfo', {}, (data: BaseListResult<MessageFollow>) => {
    toolsData.loading.twoMenu = false
    privateMessageUserData.list = data.list
    let isBoolean = false
    //判断跳转过来的用户是否已在列表中
    privateMessageUserData.list.forEach((item) => {
      if (item.user.username == orderUser.user.username) {
        isBoolean = true
      }
    })
    //如果有传，且不在列表中则添加到第一为
    if (orderUser.user.username != '' && !isBoolean) {
      privateMessageUserData.list.unshift(orderUser)
      queryPrivateMessageByUser(orderUser.user.username, orderUser.userInfo.img)
    }
    queryPrivateMessageByUser(privateMessageUserData.list[0].user.username, privateMessageUserData.list[0].userInfo.img)
    //循环添加我的消息菜单项
    privateMessageUserData.list.forEach((item) => {
      messageMenuOptions.push({
        key: item.user.username,
        label: () => {
          return h(NSpace, { align: 'center', style: 'line-height:1' }, [
            h(NAvatar, {
              round: true,
              src: item.userInfo.img ? item.userInfo.img : 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg',
            }),
            h(NText, { depth: 2 }, { default: () => item.user.nickname }),
          ])
        },
      })
    })
  })
}
queryPrivateMessageUser()

//查询当前登录用户和指定用户的私信信息
const queryPrivateMessageByUser = (username: string, userImg: string) => {
  privateMessageByUserData.username = username
  privateMessageByUserData.userImg = userImg
  server.post('/user/auth/findPrivateMessageByUser', { username: username }, (data: BaseListResult<PrivateMessage>) => {
    privateMessageByUserData.list = data.list
    //成功查询后，不管是否查看，都为已读
    readPrivateMessageByUser(username, data.list[data.list.length - 1].read)
  })
}
//已读私信，更新
const readPrivateMessageByUser = (username: string, read: boolean) => {
  if (!read) {
    server.post('/user/auth/readPrivateMessageByUser', { username: username }, (data: BaseResult) => {
      if (data.success) queryPrivateMessageUser()
    })
  }
}

const sendMessageData = reactive({
  info: '',
  username: '',
})
//发送私信
const sendMessage = () => {
  sendMessageData.username = privateMessageByUserData.username
  toolsData.loading.sendMessage = true
  server.post('/user/auth/sendMesage', sendMessageData, (data: BaseResult) => {
    if (data.success) queryPrivateMessageByUser(sendMessageData.username, privateMessageByUserData.userImg)
  })
  toolsData.loading.sendMessage = false
}
</script>
<template>
  <div class="container">
    <header>
      <MessageTopNavComp></MessageTopNavComp>
    </header>
    <main>
      <n-grid cols="6" x-gap="12px">
        <n-gi span="1">
          <n-card title="消息中心"> <n-menu :options="menuOptions" v-model:value="toolsData.oneMenu.value" /></n-card>
        </n-gi>
        <n-gi span="5">
          <n-card size="small"> 我的消息 </n-card>
          <n-card content-style="display:flex; padding:0; height: 100%;" v-show="toolsData.oneMenu.value == 'myMessage'">
            <n-scrollbar style="min-width: 25%; max-width: 30%; height: 80vh">
              <div style="background-color: #fff; margin-left: 1rem; line-height: 2">最新消息</div>
              <n-divider style="margin: 0" />
              <n-list hoverable show-divider>
                <n-list-item v-if="toolsData.loading.twoMenu">
                  <n-space align="center">
                    <n-skeleton height="40px" circle />
                    <n-skeleton text :repeat="1" height="30px" width="80px" />
                  </n-space>
                </n-list-item>

                <n-list-item v-for="u in privateMessageUserData.list" :key="u.user.username" @click="queryPrivateMessageByUser(u.user.username, u.userInfo.img)" :class="{ menuActive: u.user.username == privateMessageByUserData.username }">
                  <n-badge :value="u.newMessage">
                    <n-space align="center">
                      <n-avatar round :src="u.userInfo.img ? u.userInfo.img : 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'"></n-avatar>
                      <n-text>{{ u.user.nickname }}</n-text>
                    </n-space>
                  </n-badge>
                </n-list-item>
              </n-list>
            </n-scrollbar>
            <div style="max-width: 75%; min-width: 70%; width: 75%">
              <div class="tc" style="background-color: #fff; line-height: 2">{{ privateMessageByUserData.username }}</div>
              <n-divider style="margin: 0" />
              <n-card style="height: 80vh" v-if="privateMessageByUserData.username == ''">
                <n-space align="center" justify="center" style="height: 100%">
                  <n-empty description="什么都没有哦" size="huge"></n-empty>
                </n-space>
              </n-card>
              <n-card embedded :bordered="false" content-style="overflow-y: auto;padding-right:0" footer-style="padding:0px" style="height: 80vh" v-else>
                <n-scrollbar style="padding-right: 24px">
                  <div v-for="m in privateMessageByUserData.list" :key="m.lastupdate">
                    <n-space v-if="m.from == privateMessageByUserData.username" :wrap="false" class="mr05">
                      <n-avatar round :src="privateMessageByUserData.userImg != '' ? privateMessageByUserData.userImg : 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'"></n-avatar>
                      <n-card size="small" class="is-you">{{ m.info }}</n-card>
                    </n-space>
                    <n-space v-if="m.from == loginUser.tbUser.username" justify="end" :wrap="false" class="mr05">
                      <n-card size="small" class="is-me">{{ m.info }}</n-card>
                      <n-avatar round :src="loginUser.tbUserInfo.img != '' ? loginUser.tbUserInfo.img : 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'"></n-avatar>
                    </n-space>
                  </div>
                </n-scrollbar>
                <template #footer>
                  <n-input
                    v-model:value="sendMessageData.info"
                    style="background-color: rgb(250, 250, 254)"
                    type="textarea"
                    show-count
                    autofocus
                    maxlength="300"
                    :autosize="{
                      maxRows: 5,
                      minRows: 5,
                    }"
                  >
                    <template #suffix>
                      <n-button @click="sendMessage()" v-loading="toolsData.loading.sendMessage" :disabled="sendMessageData.info == '' ? true : false">发送</n-button>
                    </template>
                  </n-input>
                </template>
              </n-card>
            </div>
          </n-card>
        </n-gi>
      </n-grid>
    </main>
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

.border {
  border: 1px solid #000;
}
main {
  width: 60%;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
  height: calc(100vh - 58px);
}

.is-me {
  border-radius: 16px 0 16px 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
}
.is-you {
  border-radius: 16px 16px 16px 0px;
  border-top-right-radius: 16px;
  border-top-left-radius: 0px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
}
.menuActive {
  background-color: rgba(243, 243, 245, 1);
}
</style>
