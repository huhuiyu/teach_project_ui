<template>
  <div>
    <back-comp></back-comp>
    <div>
      <user-info @user-changed="userChanged"></user-info>
    </div>
    <div class="pd10">
      <div v-if="loginInfo.isLogin">
        <!-- 聊天信息显示 -->
        <div class="infos">
          <div v-for="(d, index) in infos" :key="index"> {{ d.nickname }}({{ d.username }}-{{ d.createDate | formatDate('yyyy-MM-dd hh:mm:ss') }})：{{ d.info }} </div>
        </div>
        <!-- 发送消息 -->
        <div v-loading="!wsIsOpen">
          <el-row>
            <el-col :span="18">
              <el-input placeholder="聊天信息" v-model="info">
                <i slot="prefix" class="el-input__icon iconfont">&#xe630;</i>
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" :disabled="!wsIsOpen || info.trim().length == 0" @click="sendInfo"> <i class="iconfont">&#xe636;</i> 发送 </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="!loginInfo.isLogin"> 请先登录 </div>
    </div>
  </div>
</template>
<script>
import BackComp from '../../components/BackComp.vue'
import UserInfo from '../../components/UserInfo.vue'
import chatService from '../../js/chat_service'

export default {
  components: { UserInfo, BackComp },
  name: 'ChatRoom',
  data() {
    return {
      wsIsOpen: false,
      infos: [],
      info: '',
      baseInfos: [],
      inBaseQuery: false,
    }
  },
  computed: {
    loginInfo() {
      return this.$store.state.loginInfo
    },
  },
  methods: {
    sendInfo() {
      if (!this.wsIsOpen) {
        return
      }
      chatService.sendMessage(this.info)
      this.info = ''
    },
    onopen() {
      this.wsIsOpen = chatService.isConnected()
    },
    onclose() {
      this.wsIsOpen = chatService.isConnected()
    },
    onquery(info) {
      this.wsIsOpen = chatService.isConnected()
      this.baseInfos = info
      this.infos = this.infos.concat(info)
      if (this.infos.length >= 200) {
        this.infos.length = 150
      }
    },
    onjoin(info) {
      this.wsIsOpen = chatService.isConnected()
      info.info = '进入聊天室'
      this.infos = [info].concat(this.infos)
      // 没有聊天记录就查询基本聊天记录
      if (this.baseInfos.length == 0 && !this.inBaseQuery) {
        this.inBaseQuery = true
        chatService.query()
      }
      if (this.infos.length >= 200) {
        this.infos.length = 150
      }
    },
    oninfo(info) {
      this.wsIsOpen = chatService.isConnected()
      this.infos = [info].concat(this.infos)
      if (this.infos.length >= 200) {
        this.infos.length = 150
      }
    },
    onleave(info) {
      this.wsIsOpen = chatService.isConnected()
      info.info = '离开聊天室'
      this.infos = [info].concat(this.infos)
      if (this.infos.length >= 200) {
        this.infos.length = 150
      }
    },
    userChanged(isLogin) {
      this.$logger.debug('登录状态改变', isLogin)
    },
  },
  created() {
    chatService.setOnOpen(this.onopen)
    chatService.setOnClose(this.onclose)
    chatService.setOnJoin(this.onjoin)
    chatService.setOnInfo(this.oninfo)
    chatService.setOnLeave(this.onleave)
    chatService.setOnQuery(this.onquery)
    this.$logger.debug('on ChatRoom created...')
  },
  mounted() {
    this.$logger.debug('on ChatRoom mounted...')
    chatService.connect()
  },
  destroyed() {
    this.$logger.debug('on ChatRoom destroyed...')
    chatService.disconnect()
  },
}
</script>
<style scoped>
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
