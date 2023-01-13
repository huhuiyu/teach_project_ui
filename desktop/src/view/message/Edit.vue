<script setup lang="ts">
import { NCard, NInput } from 'naive-ui'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
</script>
<template>
  <div class="container">
    <MessageTopNavComp></MessageTopNavComp>
    <main>
      <n-card title="写文章">
        <n-input placeholder="请输入标题" size="large" style="font-size: large"></n-input>
      </n-card>
    </main>
  </div>
</template>
<style scoped>
.container {
  background-color: rgb(246, 246, 246);
  height: 100%;
  justify-content: space-between;
}
main {
  width: 50%;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
}
</style>
