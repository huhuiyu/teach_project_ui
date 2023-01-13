<script setup lang="ts">
import { NButton, NCard, NFormItem, NInput, NSpace } from 'naive-ui'
import { reactive } from 'vue'
import MessageTopNavComp from '../../component/MessageTopNavComp.vue'
import WangEditorComp from '../../component/WangEditorComp.vue'
import BaseResult from '../../entity/BaseResult'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
const addMessageData = reactive({
  disabled: false,
  wordCount: 0,
  text: '',
  addInfo: {
    title: '',
    info: '',
  },
  loading: false,
})
const editorChange = (info: string, text: string) => {
  addMessageData.wordCount = text.length
  addMessageData.addInfo.info = info
  addMessageData.text = text
  btnDisabled()
}
const editorCreated = (editor: any) => {
  logger.debug(editor)
}
const addMessage = () => {
  addMessageData.loading = true
  server.post('/message/add', addMessageData.addInfo, (data: BaseResult) => {
    addMessageData.loading = false
    if (data.success) {
      dialog.messageInfo(data.message)
    } else {
      dialog.messageWarning(data.message)
    }
  })
}
const btnDisabled = () => {
  if (addMessageData.text == '' || addMessageData.addInfo.title == '') {
    addMessageData.disabled = true
  } else {
    addMessageData.disabled = false
  }
}
</script>
<template>
  <div class="container">
    <MessageTopNavComp></MessageTopNavComp>
    <main>
      <n-card title="写文章">
        <n-form-item>
          <n-input placeholder="请输入标题" size="large" style="font-size: large" clearable v-model:value="addMessageData.addInfo.title" show-count maxlength="40" @update:value="btnDisabled"></n-input>
        </n-form-item>
        <WangEditorComp placeholder="请输入些内容吧" @editor-change="editorChange" @editor-created="editorCreated"></WangEditorComp>
        <template #footer>
          <n-space justify="space-between" align="center">
            <div>字数：{{ addMessageData.wordCount }}</div>
            <div>
              <n-button type="info" :disabled="addMessageData.disabled" :loading="addMessageData.loading" @click="addMessage">
                发布
                <template #icon>
                  <i class="iconfont">&#xe60d; </i>
                </template>
              </n-button>
            </div>
          </n-space>
        </template>
      </n-card>
    </main>
  </div>
</template>
<style scoped>
.container {
  background-color: rgb(246, 246, 246);
  height: 100vh;
  justify-content: space-between;
}
main {
  width: 50%;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
}
</style>
