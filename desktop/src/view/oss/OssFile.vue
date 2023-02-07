<script setup lang="ts">
import { NButton, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, NSpace } from 'naive-ui'
import { reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseDataResult, BaseListResult, PageInfo } from '../../entity/BaseResult'
import { OssConfig, queryTbOssInfoclss, TbBucket } from '../../entity/OssInfo'
import dialogApi from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'
import OssUploadComp from '../../component/OssUploadComp.vue'
const router = useRouter()
const Loaidng = reactive({
  loading: false,
  addossinfo: false,
})
const bucket = reactive({
  list: [] as TbBucket[],
  page: new PageInfo(),
})
const selectBucket = reactive({
  list: [{ label: '选择bucket节点', value: '' }],
})

const postError = (message: any) => {
  dialogApi.notifyWarning({
    title: '失败',
    content: message,
    duration: 2000,
    keepAliveOnHover: true,
  })
}
const queryBacket = () => {
  server.post('/oss/bucket/queryAll', {}, (data: BaseListResult<TbBucket>) => {
    if (data.success) {
      bucket.list = data.list
      data.list.forEach((item) => {
        selectBucket.list.push({
          label: item.bucketName,
          value: item.obid + '',
        })
      })
    } else {
      postError(data.message)
    }
  })
}
queryBacket()
const OssInfo = reactive({
  contentType: '',
  fileinfo: '',
  filename: '',
  obid: '',
})
const OssInfoList = reactive({
  list: [] as queryTbOssInfoclss[],
  page: new PageInfo(),
})
const queryOssInfo = () => {
  Loaidng.loading = true
  server.post('/oss/ossinfo/queryAll', tools.concatJson(OssInfo, OssInfoList.page), (data: BaseListResult<queryTbOssInfoclss>) => {
    Loaidng.loading = false
    if (data.success) {
      OssInfoList.list = data.list
      OssInfoList.page = data.page
    } else {
      postError(data.message)
    }
  })
}
queryOssInfo()
const resaqueryOssInf = () => {
  OssInfo.contentType = ''
  OssInfo.fileinfo = ''
  OssInfo.filename = ''
  OssInfo.obid = ''
}

const columns = reactive([
  { title: 'bucket名称', key: 'bucket.info' },
  { title: '文件名称', key: 'filename' },
  { title: '文件描述', key: 'fileinfo' },
  {
    title: '文件大小',
    key: 'filesize',
    render(row: any) {
      return [
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              return tools.formatFileSize(row.filesize)
            },
          }
        ),
      ]
    },
  },
  { title: '文件类型', key: 'contentType' },
  {
    title: '操作',
    key: 'operation',
    titleColSpan: 2,
    render(row: queryTbOssInfoclss) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'medium',
            type: 'info',
            onClick: () => {
              UrlOssInfo(row.oiid)
            },
          },
          {
            default: () => '地址',
          }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'medium',
            type: 'info',
            onClick: () => {
              delOssInfo(row.oiid)
            },
          },
          {
            default: () => '删除',
          }
        ),
      ]
    },
  },
])
const UrlOssInfo = (oiid: number) => {
  server.post('/oss/ossinfo/queryOssUrlInfo', { oiid: oiid }, (data: BaseResult) => {
    if (data.success && tools.copyText(data.message)) {
      dialogApi.notifyInfo({
        content: '复制成功',
        duration: 1200,
      })
    } else {
      dialogApi.notifyError({
        content: '复制失败',
        duration: 1200,
      })
    }
  })
}
const delOssInfo = (oiid: number) => {
  server.post('/oss/ossinfo/delete', { oiid: oiid }, (data: BaseResult) => {
    if (data.success) {
      dialogApi.notifyInfo({
        content: '删除成功',
        duration: 1200,
      })
    } else {
      dialogApi.notifyError({
        content: '删除失败',
        duration: 1200,
      })
    }
  })
}
const addquery = (info: boolean) => {
  Loaidng.addossinfo = info
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>oss添加文件</h1>
    </header>
    <main>
      <NForm inline size="medium" style="justify-content: flex-end; padding-right: 3rem" :model="OssInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging">
        <NFormItem label="所属bucket编号" path="obid">
          <NSelect @update:value="queryOssInfo()" v-model:value="OssInfo.obid" :options="selectBucket.list"> </NSelect>
        </NFormItem>
        <NFormItem label="文件名称" path="filename">
          <NInput v-model:value="OssInfo.filename"></NInput>
        </NFormItem>
        <NFormItem label="文件类型" path="contentType">
          <NInput v-model:value="OssInfo.contentType"></NInput>
        </NFormItem>
        <NFormItem label="文件描述信息" path="fileinfo">
          <NInput v-model:value="OssInfo.fileinfo"></NInput>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="Loaidng.addossinfo = true">添加</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="resaqueryOssInf">重置</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="queryOssInfo">查询</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="error" dashed @click="router.back()">返回</NButton>
        </NFormItem>
      </NForm>
      <NDataTable :columns="columns" :data="OssInfoList.list"></NDataTable>
      <div v-if="OssInfoList.page.pageCount > 1">
        <PageComp @size-change="queryOssInfo" @page-change="queryOssInfo" @number-change="queryOssInfo" :page="OssInfoList.page"></PageComp>
      </div>
      <NModal v-model:show="Loaidng.addossinfo" preset="dialog" :mask-closable="false" style="width: 50%">
        <template #header>
          <div>添加文件</div>
        </template>
        <OssUploadComp @addossinfo-laoing="addquery"></OssUploadComp>
        <template #active></template>
      </NModal>
    </main>
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
