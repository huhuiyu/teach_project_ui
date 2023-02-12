<template>
  <n-dialog-provider>
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-message-provider>
          <router-view></router-view>
        </n-message-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-dialog-provider>
</template>
<script setup lang="ts">
import { NDialogProvider, NLoadingBarProvider, NNotificationProvider, NMessageProvider } from 'naive-ui'
import store from './store'
const storeInfo = store()
storeInfo.queryCityInfo()
storeInfo.queryCountInfo()
</script>
