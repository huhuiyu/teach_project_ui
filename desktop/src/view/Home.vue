<script setup lang="ts">
import { reactive } from 'vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
import store from '../store'
import { storeToRefs } from 'pinia'
const title = '教学演示项目'
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const list = reactive([
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '简易留言板',
    info: '简介、多平台的留言板项目',
    path: '/messagehome',
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
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '系统管理',
    info: '系统日志、系统配置、系统用户',
    path: '/admin/home',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '常用工具',
    info: '常用工具',
    path: '/toll',
  },
])
if (loginUser.value.isLogin && loginUser.value.tbUser.accessKey == '18c4e6cf-e54b-4e64-a764-c3fdd15226f8') {
  list.push({
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '门户管理',
    info: '教学演示项目门户管理',
    path: '/portal',
  })
}

</script>

<template>
  <div>
    <MainTopNavComp :title="title"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
