<script setup lang="ts">
import WangEditorComp from '../../component/WangEditorComp.vue'
import logger from '../../tools/logger'
const editorChange = (info: string, text: string) => {
  logger.debug(info, text)
}
const editorCreated = (editor: any) => {
  logger.debug(editor)
}
</script>
<template>
  <div>
    <WangEditorComp placeholder="请输入些内容吧" @editor-change="editorChange" @editor-created="editorCreated"></WangEditorComp>
  </div>
</template>
<style scoped></style>
