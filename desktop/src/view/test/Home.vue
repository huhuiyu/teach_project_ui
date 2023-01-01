<script setup lang="ts">
import { storeToRefs } from 'pinia';
import store from '../../store/index';
import logger from '../../ts/logger';

const title = '教学演示项目测试页面';
logger.debug('测试debug输出', { message: 'debug' });
logger.info('测试info输出', { message: 'info' });
logger.error('测试错误输出', { message: 'error' });
const loginUser = storeToRefs(store());
</script>

<template>
  <div>
    {{ title }}
  </div>
  <hr>
  <div>
    {{ loginUser }}
  </div>
</template>
