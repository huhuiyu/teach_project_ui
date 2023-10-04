<script setup lang="ts">
import { ElButton, ElCard } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const title = '页面不存在'
function backToHome() {
  router.push('/')
}
</script>

<template>
  <div class="main">
    <ElCard>
      <template #header>
        {{ title }}
      </template>
      <div>
        <ElButton @click="backToHome">返回首页</ElButton>
      </div>
    </ElCard>
  </div>
</template>
<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
