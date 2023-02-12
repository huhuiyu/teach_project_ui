<script setup lang="ts" name="adminHome">
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import MainHomeComp from '../../component/Home/MainHomeComp.vue'
import MainTopNavComp from '../../component/Home/MainTopNavComp.vue'
import dialogApi from '../../tools/dialog'
// store数据
import store from '../../store'
import { useRouter } from 'vue-router'
import server, { serverInfo } from '../../tools/server'
import { convert } from '../../entity/PortableInfo'
import { BaseListResult } from '../../entity/BaseResult'
const storeInfo = store()
const router = useRouter()
const { loginUser } = storeToRefs(storeInfo)
if (!loginUser.value.isLogin) {
  dialogApi.messageWarning('请登录后访问！！！')
  router.back()
} else if (loginUser.value.tbUser.role != 'admin') {
  dialogApi.messageWarning('必须是超级管理才能访问！！！')
  router.back()
}

//查询当前页面所使用到的图片
const queryCurrentImg = () => {
  server.post(
    '/portable/message/queryAll',
    {
      accessKey: serverInfo.accessKey,
      messageGroup: 'adminMenuImg',
      pageSize: 1000,
      pageNumber: 1,
    },
    (data: BaseListResult<any>) => {
      let menuImg = {
        log: '',
        config: '',
        user: '',
      }
      menuImg = convert(data.list)
      list[0].img = menuImg.log
      list[1].img = menuImg.config
      list[2].img = menuImg.user
    }
  )
}
queryCurrentImg()
const title = reactive({
  text: '超级管理员',
})

const list = reactive([
  {
    img: '',
    title: '系统日志信息',
    info: '查询系统所有用户的信息',
    path: '/admin/log',
  },
  {
    img: '',
    title: '系统基础配置管理',
    info: '图片校验码干扰线数量、图片校验码长度、图片校验码过期时间',
    path: '/admin/config',
  },
  {
    img: '',
    title: '系统用户管理',
    info: '全系统用户的启用、禁用、下线。',
    path: '/admin/user',
  },
])
</script>
<template>
  <MainTopNavComp :title="title.text"></MainTopNavComp>
  <MainHomeComp :list="list"></MainHomeComp>
</template>
<style scoped>
:deep() .n-avatar {
  background-color: #fff;
}
</style>
