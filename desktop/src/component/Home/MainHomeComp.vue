<script setup lang="ts">
import { NAvatar, NBackTop, NSpace } from 'naive-ui'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { BaseListResult } from '../../entity/BaseResult'
import logger from '../../tools/logger'
import server, { serverInfo } from '../../tools/server'
const router = useRouter()
const props = defineProps(['list'])
const lazyUrl = reactive({
  img: '',
})
const portableLazUrl = () => {
  server.post(
    '/portable/message/queryAll',
    {
      accessKey: serverInfo.accessKey,
      messageGroup: 'homePathImg',
      pageSize: 1000,
      pageNumber: 1,
    },
    (data: BaseListResult<any>) => {
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].messageKey == 'default') lazyUrl.img = data.list[i].message
      }
    }
  )
}
portableLazUrl()
const portableQueryAll = () => {
  server.post(
    '/portable/message/queryAll',
    {
      accessKey: serverInfo.accessKey,
      messageGroup: 'homePathImg',
      pageSize: 1000,
      pageNumber: 1,
    },
    (data: BaseListResult<any>) => {
      let i = 0
      for (let i = 0; i < data.list.length; i++) {
        for (let j = 0; j < props.list.length; j++) {
          if (props.list[j].path == '') {
            return
          }
          let abc = data.list[i].messageKey + ''
          if (props.list[j].path.lastIndexOf('/') == 0) {
            if (abc.indexOf(props.list[j].path.substring(1)) > -1) props.list[j].img = data.list[i].message
          } else {
            let middle = props.list[j].path.lastIndexOf('/')
            logger.debug('第一个参数', abc.indexOf(props.list[j].path.substring(1, middle)) > -1)
            if (abc.indexOf(props.list[j].path.substring(1, middle)) > -1 && abc.indexOf(props.list[j].path.substring(middle + 1)) > -1) props.list[j].img = data.list[i].message
          }
        }
      }
    }
  )
}
portableQueryAll()
</script>
<template>
  <main>
    <div class="stylediasplay">
      <div class="stylewidth">
        <a class="conter_menu" v-for="d in props.list" :key="d.path" href="javascript:void(0)" @click="router.push(`${d.path}`)">
          <div>
            <n-avatar
              class="conter_img"
              size="small"
              :src="d.img ? d.img : lazyUrl.img"
              lazy
              :intersection-observer-options="{
                root: '#image-scroll-container',
              }"
            />
          </div>
          <div>
            <div class="conter_title">
              {{ d.title }}
            </div>
            <p>{{ d.info }}</p>
          </div>
        </a>
      </div>
    </div>
  </main>
  <footer :class="{ footermartop: props.list.length <= 4 }">
    <NSpace align="center" vertical>
      <NSpace style="margin-top: 12px">©2020 - 2022 By huhuiyu</NSpace>
      <NSpace>Vue3 | Pinia | TypeScript</NSpace>
      <NSpace>Hello and welcome to the instructional demo</NSpace>
    </NSpace>
  </footer>
  <NBackTop :right="100" />
</template>

<style scoped>
/* 这个css别乱动 */
p {
  margin: 0;
}

main {
  display: flex;
  justify-content: center;
}
.stylediasplay {
  padding-top: 3%;
  width: 1020px;
}
.stylewidth {
  display: grid;
  grid-template-columns: repeat(4, 20.3%);
  grid-gap: 4rem;
}
.conter_menu {
  display: inline-block;
  border-radius: 20px;
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.15);
  transition: all 0.8s;
  text-decoration: none;
  color: #000;
  height: 110%;
}
.conter_menu:hover {
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.3);
}
.conter_menu:hover .conter_img {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transform: scale(1.3);
}
.conter_menu > div:first-child {
  width: 100%;
  height: 50%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
}
.conter_menu > div:last-child {
  padding: 1rem;
  padding-bottom: 15%;
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
  height: 128px;
  overflow: hidden;
}
.conter_menu :deep() img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
footer {
  margin-top: 10%;
  background-color: #495a80;
  height: 14vh;
  color: #fff;
}
.footermartop {
  margin-top: 40vh;
}
</style>
