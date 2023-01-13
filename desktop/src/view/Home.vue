<script setup lang="ts">
import tools from '../tools/tools'
import { NButton, NAvatar } from 'naive-ui'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import logger from '../tools/logger'
const router = useRouter()
const title = '教学演示项目'
tools.changeTitle('首页')
const list = reactive([
  {
    img: '',
    title: '简易留言板',
    info: '简介、多平台的留言板项目',
    path: '/test',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '教学管理系统',
    info: '方便完成教学任务',
    path: '/test',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '部门管理',
    info: '教学任务中的练习',
    path: '/manage/dept',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '员工管理',
    info: '教学任务中的练习',
    path: '/manage/employee',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '班级管理',
    info: '教学任务中的练习',
    path: '/manage/class',
  },
  {
    img: 'https://klcxy.top/oss-manage-service/ossinfo/queryOssUrl?tbOssInfo.oiid=542',
    title: '学生管理',
    info: '教学任务中的练习',
    path: '/manage/student',
  },
])
logger.debug('+++++++++++++++=', document.body.scrollTop)
</script>

<template>
  <div>
    <header>
      <div class="header_title">
        <div>logo</div>
        <div>{{ title }}</div>
      </div>
      <div class="header_menu">
        <p>黑暗骑士</p>
        <n-button @click="router.push('/')">主站</n-button>
        <n-button @click="router.push('/userinfo')">用户</n-button>
      </div>
    </header>
    <main>
      <div>
        <a class="conter_menu" v-for="d in list" :key="d.path" href="javascript:void(0)" @click="router.push(`${d.path}`)">
          <div>
            <img class="conter_img" :src="d.img" :alt="d.title" />
          </div>
          <div>
            <div class="conter_title">
              {{ d.title }}
            </div>
            <p>{{ d.info }}</p>
          </div>
        </a>
      </div>
    </main>
  </div>
</template>

<style scoped>
p {
  margin: 0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: hsla(0, 0%, 100%, 0.6);
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  padding: 15px 50px;
}

.header_title {
  display: flex;
  font-size: 1.2rem;
}

.header_menu {
  display: flex;
  align-items: center;
}

.header_menu button {
  margin: 0 1rem;
}
main {
  margin: 0 auto;
}
main > div {
  padding: 10% 10%;
  display: grid;
  grid-template-columns: repeat(4, 20%);
  grid-gap: 4rem;
}
.conter_menu {
  display: inline-block;
  border-radius: 10px;
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.15);
  transition: all 0.8s;
  text-decoration: none;
  color: #000;
}
.conter_menu:hover {
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.3);
}
.conter_menu:hover .conter_img {
  transform: scale(1.3);
}
.conter_menu > div:first-child {
  width: 100%;
  height: 40%;
  overflow: hidden;
}
.conter_menu > div:last-child {
  padding: 1rem;
  margin-bottom: 15%;
}
.conter_title {
  font-size: 1.5em;
  font-weight: 700;
  margin: 0.2rem 0;
}
.conter_menu p {
  color: #757575;
}
.conter_img {
  transition: transform 0.8s;
  transform-origin: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
