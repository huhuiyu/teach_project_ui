<script setup lang="ts">
import { reactive } from 'vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
const title = '常用小工具'
const list = reactive([
  {
    img: '',
    title: '加密',
    info: '加密',
    path: '',
  },
  {
    img: '',
    title: '用户加密',
    info: '用户加密',
    path: '',
  },
])
</script>
<template>
  <MainTopNavComp :title="title"></MainTopNavComp>
  <MainHomeComp :list="list"></MainHomeComp>
</template>
