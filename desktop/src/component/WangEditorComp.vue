<template>
  <div>
    <div class="editor">
      <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @onChange="onChange" />
    </div>
  </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import logger from '../tools/logger'
const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
// 内容 HTML
const valueHtml = ref('<p>请输入正文</p>')
const mode = ref('default')
const toolbarConfig = { excludeKeys: ['group-image', 'group-video'] }
const editorConfig = { placeholder: '请输入内容...' }
const emits = defineEmits(['editor-created', 'editor-change'])
const props = defineProps({
  placeholder: {
    type: String,
    requeired: false,
    default() {
      return '请输入...'
    },
  },
})
editorConfig.placeholder = props.placeholder
onMounted(() => {
  logger.debug('in WangEditorComp mounted', editorRef.value)
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  emits('editor-created', editor)
}
const onChange = (editor: any) => {
  emits('editor-change', editor.getHtml(), editor.getText().trim())
}
</script>

<style scoped>
@import '@wangeditor/editor/dist/css/style.css';
.editor {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
}
.editor > *:last-child {
  flex: 1;
  overflow-y: hidden;
  min-height: 350px !important;
}
.editor > *:first-child {
  border-bottom: 1px solid #ccc;
}

:deep() .w-e-scroll div[contenteditable] {
  height: 300px !important;
}
</style>
