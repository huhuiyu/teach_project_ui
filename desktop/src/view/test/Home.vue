<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import store from '../../store/index';
import logger from '../../tools/logger';
import server from '../../tools/server';
import tools from '../../tools/tools';
import TestUserInfoComp from './TestUserInfoComp.vue';

const title = '教学演示项目测试页面';
logger.debug('测试debug输出', { message: 'debug' });
logger.info('测试info输出', { message: 'info' });
logger.error('测试错误输出', { message: 'error' });

// 路由相关
const router = useRouter();
const route = useRoute();

// 登录用户信息相关
const storeInfo = store();
const loginUser = storeToRefs(storeInfo);

// 业务逻辑
const echo = ref('');
const echoResult = ref({});

const sendEcho = () => {
  server.get('/', { echo: echo.value }, (data: any) => {
    echoResult.value = data;
  });
};

const login = () => {
  server.post(
    '/user/auth/login',
    {
      username: 'user',
      password: tools.md5('user-pwd'),
    },
    (data: any) => {
      logger.debug(data);
      storeInfo.updateLoginUser((user: any) => {
        logger.debug('用户信息：', user);
      });
    }
  );
};

const logout = () => {
  server.post('/user/auth/logout', {}, () => {
    storeInfo.updateLoginUser(() => {});
  });
};

const toUserInfo = () => {
  router.push({
    path: '/test/userinfo',
    query: {
      formurl: route.path,
    },
  });
};
</script>

<template>
  <div>
    {{ title }}
  </div>
  <hr />
  <div>
    {{ loginUser }}
  </div>
  <hr />
  <div>
    {{ echo }}
    <input type="text" v-model="echo" />
    <button @click="sendEcho">发送</button>
    {{ echoResult }}
  </div>
  <hr />
  <div>
    <button @click="login">登录测试</button>
    <button @click="logout">安全退出</button>
    <button @click="toUserInfo">跳转用户测试页面</button>
  </div>
  <div>
    <TestUserInfoComp></TestUserInfoComp>
  </div>
</template>
