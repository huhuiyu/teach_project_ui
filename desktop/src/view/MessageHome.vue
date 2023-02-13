<script setup lang="ts">
import { reactive } from 'vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
const title = '简易留言板项目'
const list = reactive([
  {
    img: '',
    title: '简易留言板',
    info: '简介、多平台的留言板项目',
    path: '/message/home',
  },
  {
    img: '',
    title: '管理留言板',
    info: '管理留言、评论、举报信息',
    path: '/message/manage',
  },
  {
    img: '',
    title: '留言版公告管理',
    info: '查询、添加、删除、留言板公告',
    path: '/message/notice',
  },
])
</script>
<template>
  <div>
    <MainTopNavComp :title="title"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
