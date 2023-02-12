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
    info: '管理简介、多平台的留言板项目',
    path: '/message/manage',
  },
])
</script>
<template>
  <div>
    <MainTopNavComp :title="title"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
