<script setup lang="ts">
import { NButton, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, NSpace, NImage } from 'naive-ui'
import { reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseDataResult, BaseListResult, PageInfo } from '../../entity/BaseResult'
import FileInfo from '../../entity/FileInfo'
import { FileInfoResult } from '../../entity/FileResult'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'

const router = useRouter()
const toolsData = reactive({
  previewImg: '',
})
//	需要展示的列
const columns = reactive([
  { title: '所属用户', key: 'uid' },
  { title: '原始文件名', key: 'filename' },
  { title: '文件描述', key: 'fileinfo' },
  { title: '文件类型', key: 'contentType' },
  {
    title: '文件大小',
    key: 'fileSize',
    titleColSpan: 1,
    render(row: FileInfoResult) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => tools.formatFileSize(row.fileSize) }
        ),
      ]
    },
  },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: FileInfoResult) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => tools.formatDate(parseInt(row.lastupdate)) }
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'operation',
    titleColSpan: 2,
    render(row: FileInfoResult) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'info',
            onClick: () => {
              window.open(server.getDownloadUrl(row.fid))
              logger.debug(server.getDownloadUrl(row.fid))
            },
          },
          { default: () => '下载' }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            disabled: !row.contentType.toString().includes('image/'),
            onClick: () => {
              modal.preview = true
              toolsData.previewImg = server.getDownloadUrl(row.fid)
            },
          },
          { default: () => '预览图片' }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'success',
            onClick: () => {
              if (tools.copyText(server.getDownloadUrl(row.fid))) {
                dialog.notifyInfo({
                  content: '复制成功',
                  duration: 1200,
                })
              }
            },
          },
          { default: () => '复制文件路径' }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'warning',
            onClick: () => {
              dialog.showWarning({
                title: '警告',
                content: `你确定${row.filename}`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delFile(row.fid + '')
                },
                onNegativeClick: () => {
                  return
                },
              })
            },
          },
          { default: () => '删除' }
        ),
      ]
    },
  },
])
//文件类型
const fileContentTypeOptions = [
  { value: '', label: '——请选择文件类型——' },
  { value: 'image/', label: '文件类型 — 图片' },
  { value: 'audio/', label: '文件类型 — 音频' },
  { value: 'video/', label: '文件类型 — 视频' },
  { value: 'text/', label: '文件类型 — 文本' },
]

const fileData = reactive({
  queryInfo: { contentType: '', fileinfo: '', filename: '' },
  page: new PageInfo(),
  list: [] as FileInfoResult[],
  loading: false,
})
const queryFile = () => {
  fileData.loading = true
  server.post('/user/file/queryAll', tools.concatJson(fileData.queryInfo, fileData.page), (data: BaseListResult<FileInfoResult>) => {
    fileData.loading = false
    fileData.list = data.list
    fileData.page = data.page
  })
}
queryFile()
const reset = () => {
  for (const key in fileData.queryInfo) {
    fileData.queryInfo[key] = ''
  }
  fileData.page.pageNumber = 1
  queryFile()
}
const delFile = (fid: string) => {
  fileData.loading = true
  server.post('/user/file/delete', { fid }, (data: BaseResult) => {
    fileData.loading = false
    if (data.success) {
      dialog.messageInfo(data.message)
      queryFile()
    }
  })
}

const modal = reactive({
  add: false,
  modify: false,
  preview: false,
})

const addFileInfo = reactive({
  fileinfo: '',
  file: new FileInfo(),
})

//选择文件
const browserFile = () => {
  addFileInfo.file = new FileInfo()
  tools.openFile((file: FileInfo) => {
    addFileInfo.file = file[0]
    if (file[0].file == null) {
      return
    }
  })
}
//上传文件，
const upload = () => {
  if (addFileInfo.file.file == null) {
    return
  }
  if (addFileInfo.file.size >= 2097152) {
    dialog.notifyWarning({
      content: '文件大小不能超过2MB',
      duration: 2000,
      keepAliveOnHover: true,
    })
    return
  }
  if (addFileInfo.fileinfo == '') {
    dialog.notifyWarning({
      content: '文件描述不能为空',
      duration: 2000,
      keepAliveOnHover: true,
    })
    return
  }
  server.upload('/user/file/upload', addFileInfo.file.file, { fileinfo: addFileInfo.fileinfo }, (data: BaseDataResult<FileInfoResult>) => {
    if (data.success) {
      dialog.messageInfo(data.message)
      queryFile()
    }
  })
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>用户文件管理</h1>
    </header>
    <main>
      <n-form inline :label-width="80" :model="fileData.queryInfo" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-select :consistent-menu-width="false" v-model:value="fileData.queryInfo.contentType" @update:value="queryFile" :options="fileContentTypeOptions" />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="fileData.queryInfo.filename" placeholder="输入文件名称" />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="fileData.queryInfo.fileinfo" placeholder="输入文件描述" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryFile"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="modal.add = true"> 添加 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="columns" :data="fileData.list" :loading="fileData.loading" />
      <div v-if="fileData.page.pageCount > 1">
        <PageComp :page="fileData.page" :show-size-picker="true" @number-change="queryFile" @size-change="queryFile" @page-change="queryFile"></PageComp>
      </div>
    </main>
    <n-modal v-model:show="modal.add" preset="dialog">
      <template #header>
        <div>添加文件</div>
      </template>
      <n-form ref="addRef" :model="addFileInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
        <n-form-item label="文件描述">
          <n-input v-model:value="addFileInfo.fileinfo" placeholder="输入文件描述" clearable />
        </n-form-item>
        <n-form-item label="文件">
          <n-button @click="browserFile">选择文件</n-button>
          <span v-if="addFileInfo.file.file"> 已选择：{{ addFileInfo.file.name }}</span>
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="upload" class="mr05" :disabled="addFileInfo.file.file && addFileInfo.fileinfo ? false : true"> 添加</n-button>
          <n-button type="error" size="small" @click="modal.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="modal.preview" preset="dialog">
      <template #header>
        <div>预览图片</div>
      </template>
      <n-space justify="center">
        <n-image width="200" :src="toolsData.previewImg" />
      </n-space>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="modal.preview = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
:deep() .n-data-table-th {
  text-align: center;
}
:deep() .n-data-table-td {
  text-align: center;
}
</style>
