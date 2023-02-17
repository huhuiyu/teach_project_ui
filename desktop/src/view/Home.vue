<script setup lang="ts">
import { reactive } from 'vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
import store from '../store'
import { storeToRefs } from 'pinia'
import logger from '../tools/logger'
const title = reactive({
  titles: '教学演示项目',
})
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const list = reactive([
  {
    img: '',
    title: '',
    info: '',
    path: '',
  },
])
const listPush = (info: string) => {
  list.splice(0, list.length)
  if (loginUser.value.isLogin && loginUser.value.tbUser.role == 'admin') {
    title.titles = '内置管理员'
    list.push(
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
      }
    )
  }
  if (loginUser.value.isLogin && loginUser.value.tbUser.role == 'app-admin') {
    title.titles = '内置应用管理员'
    list.push(
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '管理留言板',
        info: '管理留言、评论、举报信息',
        path: '/message/manage',
      },
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '留言版公告管理',
        info: '查询、添加、删除、留言板公告',
        path: '/message/notice',
      }
    )
  }
  logger.debug('ceshi-------------1', loginUser.value.tbUser.role == 'user' || !loginUser.value.isLogin)
  if (loginUser.value.tbUser.role == 'user' || !loginUser.value.isLogin) {
    list.push(
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '简易留言板',
        info: '简介、多平台的留言板项目',
        path: '/message/home',
      },
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '教学演示项目',
        info: '教学演示项目',
        path: '/manage',
      },
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '常用工具',
        info: '常用工具',
        path: '/toll',
      }
    )
  }

  if (loginUser.value.tbUser.role == 'user' && loginUser.value.isLogin) {
    list.push(
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: 'OSS管理程序',
        info: 'OSS管理程序',
        path: '/osshome',
      },
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '文件管理',
        info: '文件管理',
        path: '/manage/file',
      },
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '备忘录',
        info: '用于未雨绸缪',
        path: '/notepad',
      },
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '通讯录',
        info: '摇人',
        path: '/contacts',
      },
      {
        img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
        title: '门户管理',
        info: '教学演示项目门户管理',
        path: '/portable',
      }
    )
  }
}
listPush('ceshi')
</script>

<template>
  <div>
    <MainTopNavComp :title="title.titles" @update-page="listPush"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
