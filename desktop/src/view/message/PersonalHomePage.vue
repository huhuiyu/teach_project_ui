<script setup lang="ts">
import { NCard, NGrid, NGi, NButton, NImage, NSpace, NAvatar, NCollapse, NCollapseItem, NList, NListItem, NInput, NRadioGroup, NRadio, NMenu, NSkeleton, NEmpty, NNumberAnimation } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseDataResult, BaseListResult, PageInfo, BaseUserInfoResult } from '../../entity/BaseResult'
import FileInfo from '../../entity/FileInfo'
import { CityInfo } from '../../entity/CityInfo'
import { MessageDetail, MessageReply, MessageFollow } from '../../entity/MessageDetailResult'
import store from '../../store'
import dialogApi from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'
//pinia
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
//路由
const router = useRouter()
const route = useRoute()
const toolsData = reactive({
  loading: {
    userInfo: false,
    mainLeft: false,
  },
  username: route.params.username + '',
})

const noLogin = () => {
  if (!loginUser.value.isLogin) {
    dialogApi.messageWarning('请登录后再操作哦')
    return false
  }
  return true
}

const queryUserInfoByUsername = () => {
  server.post('/user/auth/getUserInfoByName', { username: toolsData.username }, (data: BaseUserInfoResult) => {
    if (data.success) {
      userInfo.img = data.tbUserInfo.img
      userInfo.nickname = data.tbUser.nickname
      userInfo.qq = data.tbUserInfo.qq
      userInfo.wechat = data.tbUserInfo.wechat
      userInfo.info = data.tbUserInfo.info
      userInfo.sex = data.tbUserInfo.sex
      userInfo.mineFollow = data.userOtherInfo.mineFollow
    }
  })
}
queryUserInfoByUsername()
//懒加载默认图片
const lazyImg = 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'
const obj = reactive({
  editUserinfo: false,
})

// 用户附加信息
const userInfo = reactive({
  img: '',
  nickname: '',
  qq: '',
  wechat: '',
  info: '',
  sex: '',
  mineFollow: false,
})

//当前登录用户信息
const userMessage = reactive({
  supportAll: 0,
  hits: 0,
})
//菜单选项
const MenuOptions = [
  {
    label: '动态',
    key: 'message',
    children: [
      {
        type: 'group',
        label: '记录排序方式',
        key: 'orderBy',
        children: [
          {
            label: '最新',
            key: 'message',
          },
          {
            label: '最热',
            key: 'messageHottest',
          },
          {
            label: '好评',
            key: 'messageGood',
          },
        ],
      },
    ],
  },
  {
    label: '评论',
    key: 'comment',
    children: [
      {
        type: 'group',
        label: '记录排序方式',
        key: 'orderBy',
        children: [
          {
            label: '最新',
            key: 'comment',
          },
          {
            label: '最热',
            key: 'commentHottest',
          },
        ],
      },
    ],
  },
  {
    label: '关注',
    key: 'meFollow',
  },
  {
    label: '粉丝',
    key: 'followMe',
  },
]
const menuKey = ref('message')
//菜单变化触发方法
const menuChange = (key: string, item: any) => {
  logger.debug(key, item)
  switch (key) {
    case 'message':
      messageData.queryInfo.orderBy = '1'
      queryMessage()
      break
    case 'messageHottest':
      messageData.queryInfo.orderBy = '5'
      queryMessage()
      break
    case 'messageGood':
      messageData.queryInfo.orderBy = '7'
      queryMessage()
      break
    case 'comment':
      queryComment()
      break
    case 'commentHottest':
      commentData.queryInfo.orderBy = '3'
      queryComment()
      break
    case 'meFollow':
      queryMeFollow()
      break
    case 'followMe':
      queryFollowMe()
      break

    default:
      break
  }
}
//个人成就列表
const achievement = [
  {
    key: 1,
    title: '参与开发',
  },
]

//修改用户信息
const updateUserInfo = () => {
  toolsData.loading.userInfo = true
  server.post('/user/auth/updateUserInfo', userInfo, (data: BaseResult) => {
    dialogApi.notifyInfo({
      content: data.message,
      duration: 2000,
    })
    if (data.success) {
      storeInfo.updateLoginUser((userinfo: any) => {
        toolsData.loading.userInfo = false
      })
    }
    toolsData.loading.userInfo = false
  })
}
//上传文件信息
const upfileinfo = ref(new FileInfo())
//打开文件，获取文件信息
const browserFile = () => {
  upfileinfo.value = new FileInfo()
  tools.openFile((file: FileInfo) => {
    upfileinfo.value = file[0]
    if (file[0].file == null) {
      return
    }
    tools.readImg(file[0].file, (result: string) => {
      if (result == '') {
        dialogApi.notifyWarning({
          content: '头像只能选择图片',
          duration: 2000,
          keepAliveOnHover: true,
        })
        return
      }
      upload()
    })
  })
}
//上传文件，修改头像，删除之前头像
const upload = () => {
  if (upfileinfo.value.file == null) {
    return
  }
  if (upfileinfo.value.size >= 2097152) {
    dialogApi.notifyWarning({
      content: '图片大小不能超过2MB',
      duration: 2000,
      keepAliveOnHover: true,
    })
    return
  }
  let fid = server.isDownloadUrl(userInfo.img)
  server.upload(
    '/user/file/upload',
    upfileinfo.value.file,
    {
      fileinfo: loginUser.value.tbUser.nickname + '的头像',
    },
    (data: BaseDataResult<any>) => {
      if (data.success) {
        userInfo.img = server.getDownloadUrl(data.data.fid)
        updateUserInfo()
        if (fid != -1) {
          server.post('/user/file/delete', { fid }, () => {})
        }
      }
    }
  )
}
//解析性别
const analysisSex = (sex: string) => {
  if (sex == 'n') {
    return '保密'
  } else if (sex == 'm') {
    return '男'
  } else if (sex == 'f') {
    return '女'
  } else {
    return '数据错误'
  }
}

const messageData = reactive({
  queryInfo: {
    info: '',
    orderBy: '1',
    username: toolsData.username,
  },
  page: new PageInfo(),
  list: [] as MessageDetail[],
})
//查询用户所有留言信息
const queryMessage = () => {
  toolsData.loading.mainLeft = true
  server.post('/message/queryAll', tools.concatJson(messageData.queryInfo, messageData.page), (data: BaseListResult<MessageDetail>) => {
    toolsData.loading.mainLeft = false
    messageData.list = data.list
    messageData.page = data.page
    userMessage.hits = 0
    userMessage.supportAll = 0
    data.list.forEach((item) => {
      userMessage.supportAll += item.praiseCount
      userMessage.hits += item.hits
    })
  })
}
queryMessage()
//动态点赞
const supportMessage = (umid: string = '') => {
  if (noLogin()) {
    server.post('/message/support', { umid: umid }, (data: BaseResult) => {
      if (data.success) {
        queryMessage()
        return
      }
    })
  }
}
//评论点赞
const supportComment = (umrid: string = '') => {
  if (noLogin()) {
    server.post('/message/supportReply', { umrid: umrid }, (data: BaseResult) => {
      if (data.success) {
        queryComment()
        return
      }
    })
  }
}
const commentData = reactive({
  queryInfo: {
    info: '',
    orderBy: '1',
    username: toolsData.username,
  },
  page: new PageInfo(),
  list: [] as MessageReply[],
})
const queryComment = () => {
  toolsData.loading.mainLeft = true
  server.post('/message/queryReplyByUsername', tools.concatJson(commentData.queryInfo, commentData.page), (data: BaseListResult<MessageReply>) => {
    toolsData.loading.mainLeft = false
    commentData.list = data.list
    commentData.page = data.page
  })
}
const followMeData = reactive({
  queryInfo: {
    username: toolsData.username,
  },
  page: new PageInfo(),
  list: [] as MessageFollow[],
})

const queryFollowMe = () => {
  toolsData.loading.mainLeft = true
  server.post('/message/queryFollowMeUserListByName', tools.concatJson(followMeData.queryInfo, followMeData.page), (data: BaseListResult<MessageFollow>) => {
    toolsData.loading.mainLeft = false
    followMeData.list = data.list
    followMeData.page = data.page
  })
}
const meFollowData = reactive({
  queryInfo: {
    username: toolsData.username,
  },
  page: new PageInfo(),
  list: [] as MessageFollow[],
})
const queryMeFollow = () => {
  toolsData.loading.mainLeft = true
  server.post('/message/queryFollowUserListByName', tools.concatJson(meFollowData.queryInfo, meFollowData.page), (data: BaseListResult<MessageFollow>) => {
    toolsData.loading.mainLeft = false
    meFollowData.list = data.list
    meFollowData.page = data.page
  })
}
// 关注或取消关注用户
const followUser = (username: string) => {
  toolsData.loading.mainLeft = true
  server.post('/message/followUser', { username }, () => {
    toolsData.loading.mainLeft = false
    queryMeFollow()
    queryFollowMe()
    queryUserInfoByUsername()
  })
}
const cityInfo = reactive({
  ip: '',
  data: new CityInfo(),
})
// 获取ip
const getIPCityInfo = () => {
  server.post('/api/queryIpCtiyInfo', {}, (data: BaseDataResult<CityInfo>) => {
    cityInfo.data = data.data
  })
}
getIPCityInfo()
//删除动态
const delUserMessage = (umid: string) => {
  toolsData.loading.mainLeft = true
  server.post('/message/manage/deletUserMessage', { umid }, (data: BaseResult) => {
    toolsData.loading.mainLeft = false
    if (data.success) {
      dialogApi.notifyInfo({
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    }
  })
}
//删除评论
const delUserComment = (umrid: string) => {
  toolsData.loading.mainLeft = true
  server.post('/message/manage/deletUserMessageReply', { umrid }, (data: BaseResult) => {
    toolsData.loading.mainLeft = false
    if (data.success) {
      dialogApi.notifyInfo({
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    }
  })
}
</script>
<template>
  <div class="container">
    <header>
      <MessageTopNavComp></MessageTopNavComp>
      <n-card>
        <template #header>
          <n-image height="200" src="https://picx.zhimg.com/v2-75bb18804109dd2fa0405f31c3007126_1440w.jpg?source=fdaf910d" />
          <div class="headerSpace">
            <div class="avatarParent" v-if="loginUser.tbUser.username == toolsData.username">
              <n-avatar class="avatarUser" bordered object-fit="cover" color="#fff" :size="140" :fallback-src="lazyImg" :src="userInfo.img ? userInfo.img : lazyImg" @click="browserFile"> </n-avatar>
              <div class="ip"><i class="iconfont"> &#xe619; </i> {{ cityInfo.data.city }}</div>
            </div>
            <div class="avatarParent" v-else>
              <n-avatar class="avatar" bordered object-fit="cover" color="#fff" :size="140" :fallback-src="lazyImg" :src="userInfo.img ? userInfo.img : lazyImg"> </n-avatar>
              <div class="ip"><i class="iconfont"> &#xe619; </i> {{ cityInfo.data.city }}</div>
            </div>
            <n-space style="margin-left: 150px" justify="space-between" align="center" v-if="!obj.editUserinfo">
              <div>
                <div>
                  <div style="font-size: 24px">
                    <strong>{{ userInfo.nickname }}</strong>
                  </div>
                  <div style="font-size: 14px; color: #121212; margin-bottom: 5px">{{ userInfo.info }}</div>
                </div>
                <div>
                  <n-collapse arrow-placement="right">
                    <n-collapse-item title="查看详情资料">
                      <div><strong>性别 </strong> &nbsp; &nbsp; &nbsp;{{ analysisSex(userInfo.sex) }}</div>
                      <div><strong>QQ </strong> &nbsp; &nbsp; &nbsp; {{ userInfo.qq }}</div>
                      <div><strong>微信 </strong> &nbsp; &nbsp; &nbsp;{{ userInfo.wechat }}</div>
                    </n-collapse-item>
                  </n-collapse>
                </div>
              </div>
              <div v-if="loginUser.tbUser.username == toolsData.username"> <n-button @click="obj.editUserinfo = !obj.editUserinfo">编辑资料 </n-button></div>
              <div v-else>
                <n-space>
                  <n-button :type="userInfo.mineFollow ? 'primary' : 'default'" @click="followUser(toolsData.username)">{{ userInfo.mineFollow ? '已关注' : '关注' }}</n-button>
                  <n-button>私信</n-button>
                </n-space>
              </div>
            </n-space>
            <div style="margin-left: 150px" v-else>
              <n-list>
                <template #header>
                  <!-- <div class="tr mr10"> </div> -->
                  <n-space align="center" justify="space-between">
                    <div style="font-size: 24px"
                      ><strong>{{ loginUser.tbUser.username }}</strong></div
                    >
                    <n-button text @click="obj.editUserinfo = !obj.editUserinfo"> 返回我的主页 <i class="iconfont" style="font-size: 16px">&#xe79c;</i></n-button>
                  </n-space>
                </template>
                <n-list-item>
                  <p><strong class="margin-right20">昵称</strong><n-input v-model:value="userInfo.nickname" style="width: 30%" placeholder="请输入昵称" maxlength="12" clearable /></p>
                </n-list-item>
                <n-list-item>
                  <p><strong class="margin-right20">QQ </strong><n-input v-model:value="userInfo.qq" style="width: 30%" placeholder="请输入QQ" maxlength="10" clearable /></p>
                </n-list-item>
                <n-list-item>
                  <p><strong class="margin-right20">微信</strong><n-input v-model:value="userInfo.wechat" style="width: 30%" placeholder="请输入微信号" maxlength="12" clearable /></p>
                </n-list-item>
                <n-list-item>
                  <p>
                    <strong class="margin-right20">性别</strong>
                    <n-radio-group v-model:value="userInfo.sex">
                      <n-space>
                        <n-radio value="m"> 男 </n-radio>
                        <n-radio value="f"> 女 </n-radio>
                        <n-radio value="n"> 保密 </n-radio>
                      </n-space>
                    </n-radio-group>
                  </p>
                </n-list-item>
                <n-list-item>
                  <p>
                    <strong class="margin-right20">简介</strong>
                    <n-input
                      type="textarea"
                      v-model:value="userInfo.info"
                      size="small"
                      style="width: 30%"
                      :autosize="{
                        maxRows: 3,
                      }"
                      placeholder="请输入简介"
                      show-count
                    />
                  </p>
                </n-list-item>
                <n-list-item>
                  <n-button style="width: 100%" type="info" @click="updateUserInfo" :loading="toolsData.loading.userInfo">保存</n-button>
                </n-list-item>
              </n-list>
            </div>
          </div>
        </template>
      </n-card>
    </header>
    <main>
      <n-grid cols="6" x-gap="12px">
        <n-gi span="4">
          <n-card>
            <n-menu mode="horizontal" :options="MenuOptions" v-model:value="menuKey" @update:value="menuChange" />
            <n-card :bordered="false" v-if="toolsData.loading.mainLeft">
              <n-space style="flex-wrap: nowrap">
                <n-skeleton height="40px" circle />
                <n-skeleton text :repeat="2" width="180px" />
                <n-skeleton text :repeat="1" width="180px" style="visibility: hidden" />
              </n-space>
              <n-skeleton text :repeat="2" />
              <n-space justify="end"> <n-skeleton text :repeat="1" width="150px" /></n-space>
            </n-card>
            <div v-if="menuKey.indexOf('message') != -1 && !toolsData.loading.mainLeft">
              <n-card v-for="item in messageData.list" :key="item.umid" :bordered="false" class="message-item" size="small">
                <template #header>
                  <n-space align="center">
                    <div id="image-scroll-container">
                      <n-space vertical>
                        <n-avatar
                          round
                          lazy
                          :src="item.userInfo.img ? item.userInfo.img : lazyImg"
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
                <n-button text size="large" style="margin-left: 2.7rem">
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
                    <n-button text v-if="loginUser.tbUser.username == toolsData.username" @click="delUserMessage(item.umid + '')">
                      删除
                      <template #icon>
                        <i class="iconfont">&#xe61c;</i>
                      </template>
                    </n-button>
                  </n-space>
                </template>
              </n-card>
              <div v-if="messageData.page.pageNumber > 1">
                <PageComp :page="messageData.page" :showSizePicker="true" @number-change="queryMessage" @page-change="queryMessage" @size-change="queryMessage"></PageComp>
              </div>
              <n-empty description="什么也找不到。。。" v-if="messageData.list.length < 1"> </n-empty>
            </div>
            <div v-else-if="menuKey.indexOf('comment') != -1 && !toolsData.loading.mainLeft">
              <n-card v-for="item in commentData.list" :key="item.uid" :bordered="false" class="message-item" size="small">
                <template #header>
                  <n-space align="center">
                    <div id="image-scroll-container">
                      <n-space vertical>
                        <n-avatar
                          round
                          lazy
                          :src="item.userInfo.img ? item.userInfo.img : lazyImg"
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
                <n-button text size="large" style="margin-left: 2.7rem">
                  {{ item.info }}
                </n-button>
                <template #footer>
                  <n-space justify="end" align="center">
                    <n-button @click="supportComment(item.umrid + '')" text :type="item.praise ? 'primary' : 'default'">
                      {{ item.praiseCount }}点赞
                      <template #icon>
                        <i class="iconfont">&#xec7f;</i>
                      </template>
                    </n-button>
                    <n-button text v-if="loginUser.tbUser.username == toolsData.username" @click="delUserComment(item.umrid + '')">
                      删除
                      <template #icon>
                        <i class="iconfont">&#xe61c;</i>
                      </template>
                    </n-button>
                  </n-space>
                </template>
              </n-card>
              <div v-if="commentData.page.pageNumber > 1">
                <PageComp :page="commentData.page" :showSizePicker="true" @number-change="queryComment" @page-change="queryComment" @size-change="queryComment"></PageComp>
              </div>
              <n-empty description="什么也找不到。。。" v-if="commentData.list.length < 1"> </n-empty>
            </div>
            <div v-else-if="menuKey == 'followMe' && !toolsData.loading.mainLeft">
              <n-card v-for="item in followMeData.list" :key="item.user.username" :bordered="false" class="message-item" size="small">
                <template #header>
                  <n-space align="center">
                    <div>
                      <n-space vertical>
                        <n-avatar round lazy :src="item.userInfo.img ? item.userInfo.img : lazyImg" object-fit="cover" />
                      </n-space>
                    </div>
                    <n-space vertical style="gap: 0px">
                      <div>{{ item.user.nickname }}</div>
                    </n-space>
                  </n-space>
                </template>
                <template #header-extra>
                  <n-button @click="followUser(item.user.username)" :type="item.userOtherInfo.mineFollow ? 'primary' : 'default'">{{ item.userOtherInfo.mineFollow ? '已关注' : '关注' }} </n-button>
                </template>
              </n-card>
              <div v-if="followMeData.page.pageNumber > 1">
                <PageComp :page="followMeData.page" :showSizePicker="true" @number-change="queryFollowMe" @page-change="queryFollowMe" @size-change="queryFollowMe"></PageComp>
              </div>
              <n-empty description="什么也找不到。。。" v-if="followMeData.list.length < 1"> </n-empty>
            </div>
            <div v-else-if="menuKey == 'meFollow' && !toolsData.loading.mainLeft">
              <n-card v-for="item in meFollowData.list" :key="item.user.username" :bordered="false" class="message-item" size="small">
                <template #header>
                  <n-space align="center">
                    <div>
                      <n-space vertical>
                        <n-avatar round lazy :src="item.userInfo.img ? item.userInfo.img : lazyImg" object-fit="cover" />
                      </n-space>
                    </div>
                    <n-space vertical style="gap: 0px">
                      <div>{{ item.user.nickname }}</div>
                    </n-space>
                  </n-space>
                </template>
                <template #header-extra> <n-button type="primary" @click="followUser(item.user.username)" :disabled="loginUser.tbUser.username != toolsData.username">已关注 </n-button> </template>
              </n-card>
              <div v-if="meFollowData.page.pageNumber > 1">
                <PageComp :page="meFollowData.page" :showSizePicker="true" @number-change="queryMeFollow" @page-change="queryMeFollow" @size-change="queryMeFollow"></PageComp>
              </div>
              <n-empty description="什么也找不到。。。" v-if="meFollowData.list.length < 1"> </n-empty>
            </div>
          </n-card>
        </n-gi>
        <n-gi span="2">
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
              <n-button style="width: 100%" @click="router.push('/message/edit')">
                <template #icon>
                  <i class="iconfont">&#xe61d; </i>
                </template>
                开始创作
              </n-button>
            </template>
          </n-card>
          <n-card>
            <template #header>
              <i style="font-size: 14px"> <i class="iconfont">&#xe6da;</i> 个人成就</i>
            </template>
            <n-list>
              <n-list-item v-for="a in achievement" :key="a.key">{{ a.title }} </n-list-item>
            </n-list>
          </n-card>
        </n-gi>
      </n-grid>
    </main>
  </div>
</template>
<style scoped>
.margin-right20 {
  margin-right: 2rem;
}
.container {
  background-color: rgb(246, 246, 246);
  height: 100vh;
}

main,
header .n-card {
  width: 60%;
  margin: 0 auto;
  margin-top: 12px;
  border-radius: 5px;
  overflow: hidden;
}

/* 去掉card组件padding */
header .n-card :deep() .n-card-header {
  width: 100%;
  padding: 0 0 19px 0;
}
/*  */
header .n-card .n-image {
  width: 100%;
  overflow: hidden;
  justify-content: center;
}
header .n-card :deep() .n-image img {
  width: 100%;
  object-fit: cover;
}

.headerSpace {
  margin: 0 19px;
}

/* 头像 */
header .n-card .avatarParent {
  position: relative;
}
.avatarParent :deep() .avatarUser,
.avatarParent :deep() .avatar {
  position: absolute;
  top: -80px;
  z-index: 10;
  cursor: pointer;
}
.avatarParent .ip {
  position: absolute;
  top: -5rem;
  color: #fff;
  background-color: rgba(246, 246, 246, 0.3);
  line-height: 1.5;
  border-radius: 5px;
  right: 0;
}
.avatarUser::before {
  content: '\e8bc';
  font-family: 'iconfont';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #fff;
  font-size: 2rem;
  line-height: 140px;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}
.avatarUser:hover::before {
  visibility: visible;
}

main {
  padding: 1rem 0;
  display: flex;
}
</style>
