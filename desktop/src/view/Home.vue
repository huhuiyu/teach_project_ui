<script setup lang="ts">
import { reactive } from 'vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
const title = '教学演示项目'
const list = reactive([
  {
    img: '',
    title: '简易留言板',
    info: '简介、多平台的留言板项目',
    path: '/message/home',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '管理系统',
    info: '管理员登录',
    path: '/manage',
  },
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
])
</script>

<template>
  <div>
    <MainTopNavComp :title="title"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
