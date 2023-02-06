<script setup lang="ts">
import { reactive } from 'vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
const title = reactive({
  text: 'OSS管理程序',
})
const list = reactive([
  {
    img: '',
    title: 'OSS基本配置',
    info: 'OSS基本配置',
    path: '/oss/config',
  },
])
</script>
<template>
  <MainTopNavComp :title="title.text"></MainTopNavComp>
  <MainHomeComp :list="list"></MainHomeComp>
</template>
