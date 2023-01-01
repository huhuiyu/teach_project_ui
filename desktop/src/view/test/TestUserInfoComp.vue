<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import store from '../../store/index';
const title = '教学演示项目用户信息测试组件';

// 登录用户信息相关
const storeInfo = store();
const { loginUser } = storeToRefs(storeInfo);
</script>

<template>
  <div>
    {{ title }}
  </div>
  <hr />
  <div>
    {{ loginUser }}
  </div>
</template>
