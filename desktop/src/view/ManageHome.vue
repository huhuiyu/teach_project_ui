<script setup lang="ts">
import { reactive } from 'vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
const title = '教学管理项目'
const list = reactive([
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '部门管理',
    info: '教学任务中的练习',
    path: '/manage/dept',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '员工管理',
    info: '教学任务中的练习',
    path: '/manage/employee',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '班级管理',
    info: '教学任务中的练习',
    path: '/manage/class',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '学生管理',
    info: '教学任务中的练习',
    path: '/manage/student',
  },
])
</script>
<template>
  <div>
    <MainTopNavComp :title="title"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
