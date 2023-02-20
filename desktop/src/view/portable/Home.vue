<script setup lang="ts">
import { reactive } from 'vue'
import MainTopNavComp from '../../component/Home/MainTopNavComp.vue'
import MainHomeComp from '../../component/Home/MainHomeComp.vue'
const title = '教学演示门户管理项目'
const list = reactive([
  {
    img: '',
    title: '门户信息(管理)',
    info: '门户信息查询、添加、删除、修改、导入、导出',
    path: '/portable/portal',
  },
  {
    img: '',
    title: '邮箱留言(管理)',
    info: '邮箱留言查询、回复、发送邮箱留言',
    path: '/portable/email',
  },
])
</script>

<template>
  <div>
    <MainTopNavComp :title="title"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
