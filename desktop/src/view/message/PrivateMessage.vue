<script setup lang="ts" name="privateMessage">
import { MenuOption, NButton, NCard, NGi, NGrid, NMenu, NSpace, NInput, NAvatar, NText, NList, NListItem, NEmpty, NDivider, NBadge, NSkeleton, NScrollbar, NPopconfirm } from 'naive-ui'
import { reactive, h, computed } from 'vue'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import store from '../../store'
import BaseResult, { BaseListResult } from '../../entity/BaseResult'
import server from '../../tools/server'
import { MessageFollow, PrivateMessage } from '../../entity/MessageDetailResult'
//pinia
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const route = useRoute()
const router = useRouter()

const toolsData = reactive({
  loading: {
    sendMessage: false,
    twoMenu: false,
    queryFriend: false,
  },
  twoMenuValue: route.query.mode + '',
  lazyImg: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81',
})
const changeRouteInfo = (info: string) => {
  if (info == route.query.mode) {
    return
  }
  router.push({
    path: '/message/privateMessage',
    query: {
      mode: info,
    },
  })
}
const viewMode = computed({
  get: () => route.query.mode + '',
  set: (value) => {
    toolsData.twoMenuValue = value
  },
})
if (viewMode.value == '' && viewMode.value) {
  viewMode.value = 'myMessage'
}

//消息中心菜单项
const menuOptions: MenuOption[] = [
  {
    label: '我的消息',
    key: 'myMessage',
  },
  {
    label: '我的好友',
    key: 'myFriend',
  },
  {
    label: '好友申请',
    key: 'applyFriend',
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
              src: item.userInfo.img ? item.userInfo.img : toolsData.lazyImg,
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
    if (data.success) {
      queryPrivateMessageByUser(sendMessageData.username, privateMessageByUserData.userImg)
      sendMessageData.info = ''
    }
  })
  toolsData.loading.sendMessage = false
}
//好友信息查询
const friendData = reactive({
  list: [] as MessageFollow[],
  applyList: [] as MessageFollow[],
  elseList: [] as MessageFollow[],
})
const queryFriend = (info: string) => {
  toolsData.loading.queryFriend = true
  server.post('/user/auth/friendQuery', { info: info }, (data: BaseListResult<MessageFollow>) => {
    toolsData.loading.queryFriend = false
    if (info == 'friend') {
      friendData.list = data.list
    } else if (info == 'apply') {
      friendData.applyList = data.list
    } else {
      friendData.elseList = data.list
    }
  })
}
queryFriend('friend')
queryFriend('apply')
queryFriend('else')

//好友申请处理
const friendAgree = (info: string | number, username: string) => {
  toolsData.loading.queryFriend = true
  server.post('/user/auth/friendAgree', { info: info, username: username }, (data: BaseResult) => {
    toolsData.loading.queryFriend = false
    if (data.success) {
      queryFriend('apply')
      queryFriend('friend')
      queryFriend('else')
    }
  })
}
//删除好友
const delFriend = (username: string) => {
  toolsData.loading.queryFriend = true
  server.post('/user/auth/friendDelete', { username: username }, (data: BaseResult) => {
    toolsData.loading.queryFriend = false
    if (data.success) {
      queryFriend('friend')
    }
  })
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
          <n-card title="消息中心"> <n-menu :options="menuOptions" v-model:value="viewMode" @update:value="changeRouteInfo" /></n-card>
        </n-gi>
        <n-gi span="5">
          <n-card size="small">
            <span v-if="viewMode == 'myMessage'">我的消息列表</span>
            <span v-if="viewMode == 'myFriend'">我的好友列表</span>
            <span v-if="viewMode == 'applyFriend'">我的好友申请·</span>
          </n-card>
          <n-card content-style="display:flex; padding:0; height: 100%;" v-if="viewMode == 'myMessage'">
            <n-scrollbar style="min-width: 25%; max-width: 30%; height: 80vh">
              <div style="background-color: #fff; margin-left: 1rem; line-height: 2">{{ privateMessageByUserData.list.length > 1 ? '最新消息' : '暂时还没有消息哦' }}</div>
              <n-divider style="margin: 0" />
              <n-list hoverable show-divider>
                <n-list-item v-if="toolsData.loading.twoMenu">
                  <n-space align="center">
                    <n-skeleton height="40px" circle />
                    <n-skeleton text :repeat="1" height="30px" width="80px" />
                  </n-space>
                </n-list-item>
                <n-list-item v-else v-for="u in privateMessageUserData.list" :key="u.user.username" @click="queryPrivateMessageByUser(u.user.username, u.userInfo.img)" :class="{ menuActive: u.user.username == privateMessageByUserData.username }">
                  <n-badge :value="u.newMessage">
                    <n-space align="center">
                      <n-avatar round :src="u.userInfo.img ? u.userInfo.img : toolsData.lazyImg"></n-avatar>
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
                  <n-empty description="暂时没有消息哦" size="huge">
                    <template #icon>
                      <i class="iconfont">&#xe624;</i>
                    </template>
                  </n-empty>
                </n-space>
              </n-card>
              <n-card embedded :bordered="false" content-style="overflow-y: auto;padding-right:0" footer-style="padding:0px" style="height: 80vh" v-else>
                <n-scrollbar style="padding-right: 24px">
                  <div v-for="m in privateMessageByUserData.list" :key="m.lastupdate">
                    <n-space v-if="m.from == privateMessageByUserData.username" :wrap="false" class="mr05" @click="router.push(`/message/personal/${m.from}`)">
                      <n-avatar round :src="privateMessageByUserData.userImg != '' ? privateMessageByUserData.userImg : toolsData.lazyImg"></n-avatar>
                      <n-card size="small" class="is-you">{{ m.info }}</n-card>
                    </n-space>
                    <n-space v-if="m.from == loginUser.tbUser.username" justify="end" :wrap="false" class="mr05">
                      <n-card size="small" class="is-me">{{ m.info }}</n-card>
                      <n-avatar round :src="loginUser.tbUserInfo.img != '' ? loginUser.tbUserInfo.img : toolsData.lazyImg"></n-avatar>
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
          <n-card v-if="viewMode == 'myFriend'">
            <n-scrollbar style="height: 80vh">
              <n-list show-divider>
                <n-list-item v-if="toolsData.loading.queryFriend">
                  <n-space align="center" justify="space-between">
                    <n-space align="center">
                      <n-skeleton height="40px" circle />
                      <n-skeleton text :repeat="1" height="30px" width="80px" />
                    </n-space>
                    <div> <n-skeleton text :repeat="1" height="30px" width="90px" /> <n-skeleton text :repeat="1" height="30px" width="90px" /></div>
                  </n-space>
                </n-list-item>
                <n-list-item v-for="u in friendData.list" :key="u.user.uid" v-else>
                  <n-space align="center" justify="space-between">
                    <n-space align="center" @click="router.push(`/message/personal/${u.user.username}`)">
                      <n-avatar round :src="u.userInfo.img ? u.userInfo.img : toolsData.lazyImg"></n-avatar>
                      <n-text>{{ u.user.nickname }}</n-text>
                    </n-space>
                    <n-space>
                      <n-button @click="router.push({ path: '/message/privateMessage', query: { mode: 'myMessage', img: u.userInfo.img, username: u.user.username, nickname: u.user.nickname } })">私信好友</n-button>
                      <n-popconfirm @positive-click="delFriend(u.user.username)" negative-text="取消" positive-text="确定">
                        <template #trigger>
                          <n-button>删除好友</n-button>
                        </template>
                        删除操作无法撤回，请谨慎操作
                      </n-popconfirm>
                    </n-space>
                  </n-space>
                </n-list-item>
              </n-list>
              <n-space align="center" justify="center" style="height: 100%" v-if="friendData.list.length < 1 && !toolsData.loading.queryFriend">
                <n-empty description="你暂时还没有好友哦" size="huge">
                  <template #icon>
                    <i class="iconfont">&#xe624;</i>
                  </template>
                </n-empty>
              </n-space>
            </n-scrollbar>
          </n-card>
          <n-card v-if="viewMode == 'applyFriend'">
            <n-scrollbar style="height: 80vh">
              <n-list show-divider>
                <template #header> 您发出的申请 </template>
                <n-list-item v-if="toolsData.loading.queryFriend">
                  <n-space align="center" justify="space-between">
                    <n-space align="center">
                      <n-skeleton height="40px" circle />
                      <n-skeleton text :repeat="1" height="30px" width="80px" />
                    </n-space>
                    <div> <n-skeleton text :repeat="1" height="30px" width="90px" /> <n-skeleton text :repeat="1" height="30px" width="90px" /></div>
                  </n-space>
                </n-list-item>
                <n-list-item v-for="u in friendData.applyList" :key="u.user.uid" v-else>
                  <n-space align="center" justify="space-between">
                    <n-space align="center">
                      <n-avatar round :src="u.userInfo.img ? u.userInfo.img : toolsData.lazyImg"></n-avatar>
                      <n-text>{{ u.user.nickname }}</n-text>
                    </n-space>
                    <div>您申请成为{{ u.user.nickname }}的好友</div>
                    <div>暂未同意（用户拒绝后记录会在此列表消失） </div>
                  </n-space>
                </n-list-item>
                <n-space align="center" justify="center" style="height: 100%" v-if="friendData.applyList.length < 1 && !toolsData.loading.queryFriend">
                  <n-empty description="你还没有发出过好友申请哦" size="huge">
                    <template #icon>
                      <i class="iconfont">&#xe624;</i>
                    </template>
                  </n-empty>
                </n-space>
              </n-list>
              <n-list show-divider>
                <template #header> 您收到的申请 </template>
                <n-list-item v-if="toolsData.loading.queryFriend">
                  <n-space align="center" justify="space-between">
                    <n-space align="center">
                      <n-skeleton height="40px" circle />
                      <n-skeleton text :repeat="1" height="30px" width="80px" />
                    </n-space>
                    <div> <n-skeleton text :repeat="1" height="30px" width="90px" /> <n-skeleton text :repeat="1" height="30px" width="90px" /></div>
                  </n-space>
                </n-list-item>
                <n-list-item v-for="u in friendData.elseList" :key="u.user.uid" v-else>
                  <n-space align="center" justify="space-between">
                    <n-space align="center">
                      <n-avatar round :src="u.userInfo.img ? u.userInfo.img : toolsData.lazyImg"></n-avatar>
                      <n-text>{{ u.user.nickname }}</n-text>
                    </n-space>
                    <div>{{ u.user.nickname }}申请成为您的好友</div>
                    <n-space>
                      <n-button @click="friendAgree('agree', u.user.username)">同意</n-button>
                      <n-button @click="friendAgree('deny', u.user.username)">拒绝</n-button>
                    </n-space>
                  </n-space>
                </n-list-item>
                <n-space align="center" justify="center" style="height: 100%" v-if="friendData.elseList.length < 1 && !toolsData.loading.queryFriend">
                  <n-empty description="还没有好友向您发出申请哦" size="huge">
                    <template #icon>
                      <i class="iconfont">&#xe624;</i>
                    </template>
                  </n-empty>
                </n-space>
              </n-list>
            </n-scrollbar>
          </n-card>
        </n-gi>
      </n-grid>
    </main>
  </div>
</template>
<style scoped>
.container {
  background-color: rgb(246, 246, 246);
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
  height: calc(100vh - 58px);
  min-height: 100%;
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
