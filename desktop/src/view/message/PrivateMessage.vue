<script setup lang="ts">
import { MenuOption, NAvatar, NBackTop, NButton, NCard, NCarousel, NGi, NGrid, NList, NListItem, NMenu, NNumberAnimation, NSkeleton, NSpace, NTime } from 'naive-ui'
import { reactive } from 'vue'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import store from '../../store'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import server from '../../tools/server'
import { MessageDetail } from '../../entity/MessageDetailResult'
import tools from '../../tools/tools'
import PageComp from '../../component/PageComp.vue'
import dialogApi from '../../tools/dialog'
const menuOptions: MenuOption[] = [
  {
    label: '我的消息',
    key: 'myMessage',
  },
  {
    label: '好友申请',
    key: 'friend',
  },
]
</script>
<template>
  <div class="container">
    <header>
      <MessageTopNavComp></MessageTopNavComp>
    </header>
    <main>
      <n-grid cols="6" x-gap="12px">
        <n-gi span="1">
          <n-card title="消息中心"> <n-menu :options="menuOptions" /></n-card>
        </n-gi>
        <n-gi span="5">
          <n-card>
            <n-space>
              <n-menu :options="menuOptions" />
              
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
    </main>
  </div>
</template>
<style scoped>
.container {
  background-color: rgb(246, 246, 246);
  height: 100%;
  justify-content: space-between;
}
.greyBg {
  background-color: rgb(246, 246, 246);
}

main {
  width: 60%;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
}
</style>
