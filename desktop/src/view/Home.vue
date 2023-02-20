<script setup lang="ts">
import { reactive } from 'vue'
import MainTopNavComp from '../component/Home/MainTopNavComp.vue'
import MainHomeComp from '../component/Home/MainHomeComp.vue'
import store from '../store'
import { storeToRefs } from 'pinia'
const title = reactive({
  titles: '教学演示项目',
})
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
const list = reactive([
  {
    img: '',
    title: '',
    info: '',
    path: '',
  },
])

const listPush = (info: string) => {
  list.splice(0, list.length)
  if (!loginUser.value.isLogin) {
    list.push(
      {
        img: '',
        title: '简易留言板',
        info: '简介、多平台的留言板项目',
        path: '/message/home',
      },
      {
        img: '',
        title: '教学演示项目',
        info: '教学演示项目',
        path: '/manage',
      },
      {
        img: '',
        title: '常用工具',
        info: '常用工具',
        path: '/toll',
      }
    )
    return
  }
  // 登录超级管理员
  if (loginUser.value.tbUser.role == 'admin') {
    title.titles = '内置管理员'
    list.push(
      {
        img: '',
        title: '系统日志信息',
        info: '查询系统所有用户的信息',
        path: '/admin/log',
      },
      {
        img: '',
        title: '系统基础配置管理',
        info: '图片校验码干扰线数量、图片校验码长度、图片校验码过期时间',
        path: '/admin/config',
      },
      {
        img: '',
        title: '系统用户管理',
        info: '全系统用户的启用、禁用、下线。',
        path: '/admin/user',
      }
    )
  }
  // 登录app管理员
  else if (loginUser.value.tbUser.role == 'app-admin') {
    title.titles = '内置应用管理员'
    list.push(
      {
        img: '',
        title: '管理留言板',
        info: '管理留言、评论、举报信息',
        path: '/message/manage',
      },
      {
        img: '',
        title: '留言版公告管理',
        info: '查询、添加、删除、留言板公告',
        path: '/message/notice',
      }
    )
  }
  // 用户登录
  else if (loginUser.value.tbUser.role == 'user') {
    list.push(
      {
        img: '',
        title: '简易留言板',
        info: '简介、多平台的留言板项目',
        path: '/message/home',
      },
      {
        img: '',
        title: '教学演示项目',
        info: '教学演示项目',
        path: '/manage',
      },
      {
        img: '',
        title: 'OSS管理程序',
        info: 'OSS管理程序',
        path: '/osshome',
      },
      {
        img: '',
        title: '网站通用聊天室',
        info: '教学演示项目-网站通用聊天室',
        path: '/chatroom',
      },
      {
        img: '',
        title: '文件管理',
        info: '文件管理',
        path: '/manage/file',
      },
      {
        img: '',
        title: '常用工具',
        info: '常用工具',
        path: '/toll',
      },
      {
        img: '',
        title: '备忘录',
        info: '用于未雨绸缪',
        path: '/notepad',
      },
      {
        img: '',
        title: '通讯录',
        info: '摇人',
        path: '/contacts',
      },
      {
        img: '',
        title: '门户管理',
        info: '教学演示项目门户管理',
        path: '/portable',
      }
    )
  }
}
listPush('ceshi')
</script>

<template>
  <div class="main-container">
    <MainTopNavComp :title="title.titles" @update-page="listPush"></MainTopNavComp>
    <MainHomeComp :list="list"></MainHomeComp>
  </div>
  <div class="phone-main-container pd10 tc"> 手机版网站建设中。。。 </div>
</template>

<style>
.main-container {
  display: block;
}
.phone-main-container {
  display: none;
}
@media screen and (max-width: 768px) {
  .main-container {
    display: none;
  }
  .phone-main-container {
    display: block;
  }
}
</style>
