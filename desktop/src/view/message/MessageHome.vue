<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import MainHomeComp from '../../component/Home/MainHomeComp.vue'
import MainTopNavComp from '../../component/Home/MainTopNavComp.vue'
import store from '../../store'
const storeINfo = store()
const { loginUser } = storeToRefs(storeINfo)

const title = '简易留言板项目'
const list = reactive([
 
])

</script>
<template>
  <div>
    <MainTopNavComp :title="title"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
</template>
