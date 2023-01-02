<template>
  <n-dialog-provider>
    <n-loading-bar-provider>
      <n-nofitication-provider>
        <n-message-provider>
          <router-view></router-view>
        </n-message-provider>
      </n-nofitication-provider>
    </n-loading-bar-provider>
  </n-dialog-provider>
</template>
<script setup lang="ts">
import {
  NDialogProvider,
  NLoadingBarProvider,
  NNotificationProvider,
  NMessageProvider,
} from 'naive-ui';
</script>

