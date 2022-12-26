<template>
  <div>
    <div>{{ title }}</div>
    <div>
      <router-link to="/">首页</router-link>
    </div>
    <div>
      <el-input v-model="info" placeholder="聊天信息"></el-input>
      <el-button @click="send">发送</el-button>
      连接状态：{{ connected }}
    </div>
    <div v-for="(d, index) in list" :key="index"> {{ d.nickname }}({{ d.username }})：{{ d.info }} [{{ d.createDate | formatDate }}] </div>
  </div>
</template>
<script>
import logger from '../../js/logger'
import chatService from '../../js/chat_service'
let app
export default {
  data() {
    return {
      title: '聊天室',
      info: '',
      list: [],
      connected: false,
    }
  },
  computed: {},
  methods: {
    send() {
      chatService.sendMessage(this.info)
    },
    onopen(event) {
      logger.debug('连接聊天室服务', event)
      this.connected = chatService.isConnected()
    },
    onclose(event) {
      logger.debug('聊天室服务断线', event)
      this.connected = chatService.isConnected()
    },
    onmessage(event) {
      logger.debug('聊天室消息', event)
    },
    onjoin(info) {
      logger.debug('加入聊天室信息：', info)
      info.info = '进入聊天室'
      this.list = [info].concat(this.list)
    },
    onquery(info) {
      logger.debug('查询聊天室信息：', info)
    },
    oninfo(info) {
      logger.debug('收到聊天室信息：', info)
      this.list = [info].concat(this.list)
    },
    onleave(info) {
      logger.debug('离开聊天室信息：', info)
      info.info = '离开聊天室'
      this.list = [info].concat(this.list)
    },
  },
  created() {
    app = this
    logger.debug('页面标题：', app.title)
    // 设置聊天服务并链接
    chatService.setOnOpen(this.onopen)
    chatService.setOnClose(this.onclose)
    chatService.setOnMessage(this.onmessage)
    chatService.setOnJoin(this.onjoin)
    chatService.setOnQuery(this.onquery)
    chatService.setOnInfo(this.oninfo)
    chatService.setOnLeave(this.onleave)
    chatService.connect()
  },
  beforeDestroy() {
    chatService.leave()
  },
  destroyed() {
    chatService.disconnect()
  },
}
</script>
