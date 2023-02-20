<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NAvatar, NSpace, NDropdown, NText } from 'naive-ui'
import store from '../../store'
import server, { serverInfo } from '../../tools/server'
import { h, defineProps, reactive } from 'vue'
import { BaseListResult } from '../../entity/BaseResult'
const router = useRouter()
const route = useRoute()
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const props = defineProps(['title'])
const lazyUrl = reactive({
  img: '',
})
const portableLazUrl = () => {
  server.post(
    '/portable/message/queryAll',
    {
      accessKey: serverInfo.accessKey,
      messageGroup: 'homePathImg',
      pageSize: 1000,
      pageNumber: 1,
    },
    (data: BaseListResult<any>) => {
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].messageKey == 'lettopimg') lazyUrl.img = data.list[i].message
      }
    }
  )
}
portableLazUrl()
//用户信息下拉选项
const options = [
  {
    key: 'header',
    type: 'render',
    render(row: any) {
      return h(
        'div',
        {
          style: 'display: flex; align-items: center; justify-content: center; padding:12px 8px 0px 8px;',
        },
        [h('div', { style: 'text-align: center;' }, [h('div', { style: 'font-size: 20px;' }, [h(NText, { depth: 1 }, { default: () => loginUser.value.tbUser.nickname })]), h('div', { style: 'font-size: 12px;' }, [h(NText, { depth: 2 }, { default: () => (loginUser.value.tbUserInfo.info ? loginUser.value.tbUserInfo.info : '毫无疑问，你是办公室里最亮的星') })])])]
      )
    },
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: '用户信息',
    key: 'personalHome ',
    icon: () => {
      return h('i', { class: 'iconfont', innerHTML: '&#xe6da;' })
    },
  },
  {
    label: '退出登录',
    key: 'logOut',
    icon: () => {
      return h('i', { class: 'iconfont', innerHTML: '&#xe612;' })
    },
  },
]
const handleSelect = (key: string | number) => {
  if (key == 'logOut') {
    logout()
    return
  }
  if (key == 'personalHome ') {
    router.push('/user/userinfo')
    return
  }
}
const emits = defineEmits(['update-page']) // 退出登录后重新获取页面的list
const logout = () => {
  server.post('/user/auth/logout', {}, () => {
    storeInfo.updateLoginUser(() => {
      router.push('/')
      //退出登录返回主站
      emits('update-page', 'ceshi')
    })
  })
}
</script>
<template>
  <div class="styletop">
    <header>
      <div class="header_title">
        <div><n-avatar round size="small" :src="lazyUrl.img"></n-avatar></div>
        <div>{{ props.title }}</div>
      </div>
      <div class="header_menu">
        <NSpace v-if="loginUser.isLogin" class="avatar">
          <NDropdown trigger="hover" :options="options" :show-arrow="true" @select="handleSelect">
            <n-avatar round :src="loginUser.tbUserInfo.img ? loginUser.tbUserInfo.img : 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'"></n-avatar>
          </NDropdown>
        </NSpace>
        <n-space v-else>
          <n-button v-if="!loginUser.isLogin" @click="router.push('/login')">登录</n-button>
        </n-space>
        <n-button v-if="route.path != '/'" @click="router.push('/')">返回</n-button>
      </div>
    </header>
  </div>
</template>
<style scoped>
p {
  margin: 0;
}
.styletop {
  display: flex;
  justify-content: center;
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  background-color: hsla(0, 0%, 100%, 0.6);
}
header {
  width: 1020px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsla(0, 0%, 100%, 0.6);
  padding: 15px 0px;
}

.header_title {
  display: flex;
  font-size: 1.1rem;
}
.header_menu {
  display: flex;
  align-items: center;
}

.header_menu button {
  margin: 0 1rem;
}
</style>
