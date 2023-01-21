<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import store from '../store/index'
import UserInfoComp from '../component/UserInfoComp.vue'
import logger from '../tools/logger'
import chat_service from '../tools/chat_service'
import { ChatInfo } from '../entity/ChatInfo'
import tools from '../tools/tools'
import { useRouter } from 'vue-router'

const title = '教学演示项目-网站通用聊天室'

const router = useRouter()

// store数据
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)

// 聊天相关信息
const viewinfo = reactive({
  info: '',
  infos: new Array<ChatInfo>(),
  inBaseQuery: false,
})

// 聊天室相关事件
const sendInfo = () => {
  logger.debug('发送消息：', viewinfo.info)
  chat_service.sendMessage(viewinfo.info)
  viewinfo.info = ''
}
const onopenchat = () => {
  logger.debug('成功连接')
  if (viewinfo.inBaseQuery) {
    return
  }
  // 基本信息查询
  viewinfo.inBaseQuery = true
  chat_service.query()
}
const onclosechat = () => {
  logger.debug('连接关闭')
}
const onquerychat = (info: Array<ChatInfo>) => {
  logger.debug('查询结果：', info)
  viewinfo.infos = info.concat(viewinfo.infos)
  checkMaxInfo()
}
const onjoinchat = (info: ChatInfo) => {
  logger.debug('用户加入：', info)
  info.info = '加入聊天室'
  viewinfo.infos = [info].concat(viewinfo.infos)
  checkMaxInfo()
}
const oninfocchat = (info: ChatInfo) => {
  logger.debug('用户消息：', info)
  viewinfo.infos = [info].concat(viewinfo.infos)
  checkMaxInfo()
}
const onleavechat = (info: ChatInfo) => {
  logger.debug('用户离开：', info)
  info.info = '离开聊天室'
  viewinfo.infos = [info].concat(viewinfo.infos)
  checkMaxInfo()
}
const MAX = 200
const FLOAT = 150
const checkMaxInfo = () => {
  if (viewinfo.infos.length >= MAX) {
    viewinfo.infos.length = FLOAT
  }
}

// 初始化聊天室
const init = () => {
  logger.debug('初始化聊天室')
  //事件绑定
  chat_service.setOnOpen(onopenchat)
  chat_service.setOnClose(onclosechat)
  chat_service.setOnQuery(onquerychat)
  chat_service.setOnJoin(onjoinchat)
  chat_service.setOnInfo(oninfocchat)
  chat_service.setOnLeave(onleavechat)
  // 连接服务器
  chat_service.connect()
}
onMounted(init)
onUnmounted(() => {
  logger.debug('销毁聊天室')
  chat_service.disconnect()
})
</script>

<template>
  <div>
    <UserInfoComp></UserInfoComp>
  </div>
  <hr />
  <div>
    {{ title }}
    <button @click="router.push('/')">返回首页</button>
  </div>
  <div v-if="loginUser.isLogin">
    <div>
      <input type="text" v-model="viewinfo.info" />
      <button @click="sendInfo" :disabled="viewinfo.info.trim() == '' || !chat_service.isConnected()">发送</button>
    </div>
    <div class="infos">
      <div v-for="d in viewinfo.infos">
        <div>
          <div>
            <span>{{ d.nickname }}({{ d.username }}):</span>
            <span>{{ tools.formatDate(d.createDate) }}</span>
          </div>
          <div>
            <span>{{ d.info }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>请先登录</div>

  <!-- <div>
    {{ viewinfo }}
  </div> -->
</template>
<style scoped>
.show {
  display: block;
}
.hide {
  display: none;
}
.infos {
  overflow-y: auto;
  height: 70vh;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  margin-bottom: 5px;
}
.infos > div {
  padding: 0.5rem;
}
</style>
