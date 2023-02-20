<script setup lang="ts">
import { NButton, NCard, NInput } from 'naive-ui'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseResult from '../../entity/BaseResult'
import server from '../../tools/server'
import tools from '../../tools/tools'
const router = useRouter()
const title = reactive({
  text: '加密、解密与md5加密',
})
const query = reactive({
  encrypt: '',
  decrypt: '',
  copyText: '',
})
const noSideSpace = (value: string) => !value.startsWith(' ') && !value.endsWith(' ')
const queryEncrypt = () => {
  server.post('/tool/encrypt', { info: query.encrypt }, (data: BaseResult) => {
    query.decrypt = data.message
    query.copyText = data.message
  })
}
const queryDecrypt = () => {
  server.post('/tool/decrypt', { info: query.decrypt }, (data: BaseResult) => {
    query.encrypt = data.message
    query.copyText = data.message
  })
}
const queryMD5 = () => {
  server.post('/tool/md5', { info: query.encrypt }, (data: BaseResult) => {
    query.decrypt = data.message
    query.copyText = data.message
  })
}
const copyTest = () => {
  tools.copyText(query.copyText)
  query.copyText = ''
}
const resets = () => {
  query.copyText = ''
  query.decrypt = ''
  query.encrypt = ''
}
</script>
<template>
  <div>
    <header style="display: flex; justify-content: space-between; align-items: center">
      <div></div>
      <h2 class="tc" style="cursor: default">{{ title.text }}</h2>
      <NButton tertiary type="error" @click="router.back()">返回</NButton>
    </header>
    <main>
      <p class="tc">(注:此加密与解密是通用接口，只要拿到加密后的结果所有人都能解密还原)</p>
      <p class="tc">(md5加密是不可逆的)</p>
      <p class="tc"></p>
      <div style="display: flex; justify-content: center; align-items: center">
        <NCard>
          <NInput v-model:value="query.encrypt" placeholder="在此输入明文，选择对应的加密方式，也可以加入密钥，然后加密即可。" type="textarea" clearable :allow-input="noSideSpace" round rows="10" />
        </NCard>
        <div class="buttons">
          <div>
            <NButton type="info" @click="queryEncrypt()">加密》</NButton>
            <NButton type="info" @click="queryDecrypt()">《解密</NButton>
          </div>
          <div style="justify-content: center">
            <NButton type="warning" @click="queryMD5()">MD5加密</NButton>
          </div>
          <div>
            <NButton type="error" @click="resets">重置 </NButton>
            <NButton type="success" @click="copyTest()">复制结果 </NButton>
          </div>
        </div>
        <NCard>
          <NInput v-model:value="query.decrypt" placeholder="加密后的密文会显示在这里。也可以是待解密的密文。" type="textarea" clearable :allow-input="noSideSpace" round rows="10" />
        </NCard>
      </div>
    </main>
  </div>
</template>
<style scoped>
.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.buttons > div {
  display: flex;
}
:deep() .n-button {
  margin: 0.5rem;
}
</style>
