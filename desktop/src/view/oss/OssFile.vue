<script setup lang="ts">
import { NButton, NImage, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, NSpace } from 'naive-ui'
import { reactive, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { queryTbOssInfoclss, TbBucket } from '../../entity/OssInfo'
import dialogApi from '../../tools/dialog'
import logger from '../../tools/logger'
import { server, serverInfo } from '../../tools/server'
import tools from '../../tools/tools'
import OssUploadComp from '../../component/OssUploadComp.vue'

import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
const router = useRouter()
// loaidng
const Loaidng = reactive({
  loading: false,
  addossinfo: false,
  yuluan: false,
  imgortext: false,
})
// bucket的应答结果
const bucket = reactive({
  list: [] as TbBucket[],
  page: new PageInfo(),
})
// bucket的options循环数组
const selectBucket = reactive({
  list: [{ label: '选择bucket节点', value: '' }],
})
// 查看所有的bucket
const queryBacket = () => {
  server.post('/oss/bucket/queryAll', {}, (data: BaseListResult<TbBucket>) => {
    if (data.success) {
      bucket.list = data.list
      data.list.forEach((item) => {
        selectBucket.list.push({
          label: item.bucketBaseName,
          value: item.obid + '',
        })
      })
    }
  })
}
queryBacket()
// oss文件参数
const ossInfo = reactive({
  contentType: '',
  fileinfo: '',
  filename: '',
  obid: '',
})
// 应答阐参数
const OssInfoList = reactive({
  list: [] as queryTbOssInfoclss[],
  page: new PageInfo(),
  imgSrc: '',
})
let nsta = 1
// 查询oss文件
const queryOssInfo = () => {
  nsta = nsta + 1
  Loaidng.loading = true
  server.post('/oss/ossinfo/queryAll', tools.concatJson(ossInfo, OssInfoList.page), (data: BaseListResult<queryTbOssInfoclss>) => {
    Loaidng.loading = false
    if (data.success) {
      OssInfoList.list = data.list
      OssInfoList.page = data.page
    }
  })
}
queryOssInfo()
const ClickQueryOssInfo = () => {
  OssInfoList.page.pageNumber = 1
  queryOssInfo()
}
// 重置
const resaqueryOssInf = () => {
  ossInfo.contentType = ''
  ossInfo.fileinfo = ''
  ossInfo.filename = ''
  ossInfo.obid = ''
  OssInfoList.page.pageNumber = 1
  queryOssInfo()
}

const rowKey = (row: queryTbOssInfoclss) => row.oiid

let deleteRows = ref<DataTableRowKey[]>([])

const columns = (): DataTableColumns<queryTbOssInfoclss> => [
  {
    type: 'selection',
  },
  { title: 'bucket名称', key: 'bucket.bucketBaseName' },
  { title: '文件名称', key: 'filename' },
  { title: '文件描述', key: 'fileinfo' },
  {
    title: '文件大小',
    key: 'filesize',
    render(row: queryTbOssInfoclss) {
      return [
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => tools.formatFileSize(row.filesize),
          }
        ),
      ]
    },
  },
  { title: '文件类型', key: 'contentType' },
  {
    title: '上传时间',
    key: 'lastupdate',
    render(row: queryTbOssInfoclss) {
      return [
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => tools.formatDate(row.lastupdate),
          }
        ),
      ]
    },
  },
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
            type: 'primary',
            onClick: () => {
              tools.copyText(serverInfo.ossUrl + row.oiid)
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
            type: 'error',
            onClick: () => {
              dialogApi.showError({
                title: `警告是否删除该oss文件`,
                content: `是否删除${row.filename}？`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delOssInfo(row.oiid)
                },
                onNegativeClick: () => {
                  return
                },
              })
            },
          },
          {
            default: () => '删除',
          }
        ),
        h(
          NSpace,
          {},
          {
            default: () => {
              return ''
            },
          }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'medium',
            type: 'warning',
            vertical: true,
            onClick: () => {
              if (row.contentType.indexOf('image') > -1) {
                OssInfoList.imgSrc = ''
                OssInfoList.imgSrc = serverInfo.ossUrl + row.oiid
                Loaidng.yuluan = true
              }
            },
          },
          {
            default: () => {
              if (row.contentType.indexOf('image') > -1) {
                return '预览'
              } else {
                return '文件'
              }
            },
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
              window.open(serverInfo.ossUrl + row.oiid)
            },
          },
          {
            default: () => '下载',
          }
        ),
      ]
    },
  },
]

const handleCheck = (rowKeys: DataTableRowKey[]) => {
  logger.debug('选择的数据项', rowKeys)
  deleteRows.value = rowKeys
}

// 删除文件
const delOssInfo = (oiid: number) => {
  server.post('/oss/ossinfo/delete', { oiid: oiid }, (data: BaseResult) => {
    if (data.success) {
      queryOssInfo()
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

// 删除文件
const delOssInfos = () => {
  if (deleteRows.value.length <= 0) {
    dialogApi.messageError('请选择需要删除的文件')
    return
  }
  Loaidng.loading = true
  dialogApi.showError({
    title: '是否删除一下oss文件',
    content: `您确定删除选中文件`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      server.post('/oss/ossinfo/deleteByIds', { ids: deleteRows.value.join(',') }, (data: BaseResult) => {
        Loaidng.loading = false
        if (data.success) {
          queryOssInfo()
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
    },
    onNegativeClick: () => {
      Loaidng.loading = false
      dialogApi.messageError('取消')
    },
  })
}
// 上传文件回来后关闭添加页面
const addquery = (info: boolean) => {
  queryOssInfo()
  Loaidng.addossinfo = info
}
</script>
<template>
  <div>
    <!-- {{ deleteRows }} -->
    <header class="tc">
      <h1>oss添加文件</h1>
    </header>
    <main>
      <NForm class="queryobid" inline size="medium" style="justify-content: flex-end; padding-right: 3rem" :model="ossInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging">
        <NFormItem path="obid">
          <NSelect v-model:value="ossInfo.obid" :options="selectBucket.list"> </NSelect>
        </NFormItem>
        <NFormItem path="filename">
          <NInput v-model:value="ossInfo.filename" placeholder="文件名称"></NInput>
        </NFormItem>
        <NFormItem path="contentType">
          <NInput v-model:value="ossInfo.contentType" placeholder="文件类型"></NInput>
        </NFormItem>
        <NFormItem path="fileinfo">
          <NInput v-model:value="ossInfo.fileinfo" placeholder="文件描述信息"></NInput>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="ClickQueryOssInfo()">查询</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="Loaidng.addossinfo = true">添加</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="resaqueryOssInf">重置</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="delOssInfos">批量删除</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="error" dashed @click="router.back()">返回</NButton>
        </NFormItem>
      </NForm>
      <NDataTable class="taleData" :columns="columns()" :data="OssInfoList.list" :row-key="rowKey" @update:checked-row-keys="handleCheck"></NDataTable>
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
    <NModal class="yuluancenter" v-model:show="Loaidng.yuluan" preset="dialog" style="width: 50%">
      <NImage class="imgclassstyle" v-if="Loaidng.imgortext == false" width="100" object-fit="cover" :src="OssInfoList.imgSrc" :previewed-img-props="{ style: { width: '50%', margin: '0 auto' } }"> </NImage>
      <div class="actionhover">点击放大</div>
    </NModal>
  </div>
</template>
<style scoped>
:deep() .n-data-table-th {
  text-align: center;
}
:deep() .n-data-table-td {
  text-align: center;
}
.taleData :deep() .n-button {
  margin: 2px;
}
.imgclassstyle {
  display: flex;
  justify-content: center;
}
.yuluancenter :deep() .n-dialog__content {
  position: relative;
}
.actionhover {
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  left: 40%;
  top: 40%;
  color: rgb(254, 0, 0);
}
.imgclassstyle:hover .actionhover {
  display: flex;
}
.queryobid :deep() .n-base-selection-label {
  width: 300px;
}
</style>
