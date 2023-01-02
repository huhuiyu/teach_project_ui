<script setup lang="ts">
import { NButton, NInput, NModal } from 'naive-ui'
import { ref } from 'vue'
import dialog from '../../tools/dialog'
const title = '教学演示项目-ui演示'

const info = ref('')
const visible = ref(false)

const showDialog = () => {
  dialog.showSuccess({
    title: '完成',
    content: '上传文件完成',
  })
}

const showNotify = () => {
  dialog.notifyWarning({
    content: '消息通知',
    duration: 2000,
    keepAliveOnHover: true,
  })
}

const showMessage = () => {
  dialog.messageError('错误消息')
}
</script>

<template>
  <div>
    {{ title }}
  </div>
  <div class="pd10 tc">
    {{ info }}
    <n-input v-model:value="info"></n-input>
    <n-button type="primary" size="medium" @click="visible = true" class="mr05"> <i class="iconfont">&#xe60d;</i> 对话框1 </n-button>
    <n-button type="primary" size="medium" @click="showDialog" class="mr05"> <i class="iconfont">&#xe696;</i> 对话框2</n-button>
    <n-button type="primary" size="medium" @click="showNotify" class="mr05">对话框3</n-button>
    <n-button type="primary" size="medium" @click="showMessage" class="mr05">对话框4</n-button>
  </div>
  <div>
    <n-modal v-model:show="visible" preset="dialog">
      <template #header>
        <div>你好</div>
      </template>
      <div>你输入的是{{ info }}</div>
      <template #action>
        <div>
          <n-button type="error" size="small" @click="visible = false">关闭</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
