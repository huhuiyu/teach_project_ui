<template>
  <n-config-provider :locale="locale" :date-locale="dateLocale">
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-notification-provider>
          <n-message-provider>
            <router-view></router-view>
          </n-message-provider>
        </n-notification-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import { NDialogProvider, NLoadingBarProvider, NNotificationProvider, NMessageProvider, zhCN, dateZhCN, NConfigProvider } from 'naive-ui'
import store from './store'
const storeInfo = store()
storeInfo.queryCityInfo()
storeInfo.queryCountInfo()

if (top != window) {
  top?.postMessage('loaded', '*')
}

const locale = zhCN
const dateLocale = dateZhCN
</script>
