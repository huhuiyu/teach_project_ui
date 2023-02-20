<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import MainHomeComp from '../../component/Home/MainHomeComp.vue'
import MainTopNavComp from '../../component/Home/MainTopNavComp.vue'
import store from '../../store'
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const title = '常用小工具'
const list = reactive([
  {
    img: '',
    title: '加密、解密、md5加密',
    info: '加密',
    path: '/toll/encrypt',
  },
])
if (loginUser.value.isLogin) {
  list.push({
    img: '',
    title: '用户加密',
    info: '用户加密',
    path: '/toll/userencrypt',
  })
}
</script>
<template>
  <MainTopNavComp :title="title"></MainTopNavComp>
  <MainHomeComp :list="list"></MainHomeComp>
</template>
