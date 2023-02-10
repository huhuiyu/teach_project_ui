<script setup lang="ts" name="OssConfig">
import { NButton, NDataTable, NForm, NFormItem, NInput, NModal, NSpace, NSwitch } from 'naive-ui'
import { reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import dialog from '../../tools/dialog'
import server from '../../tools/server'
import tools from '../../tools/tools'
import { OssConfig } from '../../entity/OssInfo'

const router = useRouter()
const columns = reactive([
  { title: 'oss的accessKeyId', key: 'accessKeyId' },
  { title: 'oss的accessKeySecret', key: 'accessKeySecret' },
  { title: '配置描述信息', key: 'description' },

  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: OssConfig) {
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
    render(row: OssConfig) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'medium',
            type: 'info',
            onClick: () => {
              modifyOssConfigInfo.ocid = row.ocid + ''
              modifyOssConfigInfo.accessKeyId = row.accessKeyId
              modifyOssConfigInfo.accessKeySecret = row.accessKeySecret
              modifyOssConfigInfo.description = row.description
              toolsData.modal.modify = true
            },
          },
          { default: () => '修改' }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'medium',
            type: 'error',
            onClick: () => {
              dialog.showError({
                title: `警告是否删除该oss基本配置`,
                content: '（严重警告，配置下所有的bucket以及文件也会全部删除！！！），是否删除？',
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delOssConfig(row.ocid)
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
const toolsData = reactive({
  loading: {
    queryAll: false,
    add: false,
    modify: false,
  },
  modal: {
    add: false,
    modify: false,
  },
})

// 当前登录用户的oss配置信息数据
const allOssConfigData = reactive({
  page: new PageInfo(),
  list: [] as OssConfig[],
})
//查询当前登录用户的oss配置信息数据
const queryAllOssConfig = () => {
  toolsData.loading.queryAll = true
  server.post('/oss/config/queryAll', allOssConfigData.page, (data: BaseListResult<OssConfig>) => {
    toolsData.loading.queryAll = false
    if (data.success) {
      allOssConfigData.page = data.page
      allOssConfigData.list = data.list
    }
  })
}
queryAllOssConfig()
const addOssConfigInfo = reactive({
  accessKeyId: '',
  accessKeySecret: '',
  description: '',
})
const addOssConfig = () => {
  toolsData.loading.add = true
  server.post('/oss/config/add', addOssConfigInfo, (data: BaseResult) => {
    toolsData.loading.add = false
    if (data.success) {
      dialog.messageInfo(data.message)
      queryAllOssConfig()
    }
  })
}
const modifyOssConfigInfo = reactive({
  accessKeyId: '',
  accessKeySecret: '',
  description: '',
  ocid: '',
})
const modifyOssConfig = () => {
  toolsData.loading.modify = true
  server.post('/oss/config/update', modifyOssConfigInfo, (data: BaseResult) => {
    toolsData.loading.modify = false
    if (data.success) {
      dialog.messageInfo(data.message)
      queryAllOssConfig()
    }
  })
}
const delOssConfig = (ocid: string | number) => {
  server.post('/oss/config/delete', { ocid: ocid }, (data: BaseResult) => {
    if (data.success) {
      dialog.messageInfo(data.message)
      queryAllOssConfig()
    }
  })
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>oss基本配置信息</h1>
    </header>
    <main>
      <n-form inline size="medium" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-button type="success" dashed @click="queryAllOssConfig()"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button type="warning" dashed @click="toolsData.modal.add = true"> 添加 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button type="error" dashed @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table class="taleData" :columns="columns" :data="allOssConfigData.list" :loading="toolsData.loading.queryAll" />
      <div v-if="allOssConfigData.page.pageCount > 1">
        <PageComp :page="allOssConfigData.page" :show-size-picker="true" @number-change="queryAllOssConfig" @size-change="queryAllOssConfig" @page-change="queryAllOssConfig"></PageComp>
      </div>
    </main>
    <n-modal v-model:show="toolsData.modal.add" preset="dialog">
      <template #header>
        <div>添加oss配置信息</div>
      </template>
      <n-form :model="addOssConfigInfo" label-placement="top" label-width="auto" require-mark-placement="right-hanging">
        <n-form-item label="oss的accessKeyId">
          <n-input v-model:value="addOssConfigInfo.accessKeyId" placeholder="请输入oss的accessKeyId" clearable />
        </n-form-item>
        <n-form-item label="oss的accessKeySecret">
          <n-input v-model:value="addOssConfigInfo.accessKeySecret" placeholder="请输入oss的accessKeySecret" clearable />
        </n-form-item>
        <n-form-item label="oss配置描述信息">
          <n-input v-model:value="addOssConfigInfo.description" placeholder="请输入oss配置描述信息" clearable />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="addOssConfig()" :loading="toolsData.loading.add" class="mr05" :disabled="addOssConfigInfo.accessKeyId && addOssConfigInfo.accessKeySecret && addOssConfigInfo.description ? false : true"> 添加</n-button>
          <n-button type="error" size="small" @click="toolsData.modal.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="toolsData.modal.modify" preset="dialog" :mask-closable="false">
      <template #header>
        <div>修改oss配置信息</div>
      </template>
      <n-form :model="modifyOssConfigInfo" label-placement="top" label-width="auto" require-mark-placement="right-hanging">
        <n-form-item label="oss的accessKeyId">
          <n-input v-model:value="modifyOssConfigInfo.accessKeyId" placeholder="请输入oss的accessKeyId" clearable />
        </n-form-item>
        <n-form-item label="oss的accessKeySecret">
          <n-input v-model:value="modifyOssConfigInfo.accessKeySecret" placeholder="请输入oss的accessKeySecret" clearable />
        </n-form-item>
        <n-form-item label="oss配置描述信息">
          <n-input v-model:value="modifyOssConfigInfo.description" placeholder="请输入oss配置描述信息" clearable />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="modifyOssConfig" :loading="toolsData.loading.modify" class="mr05" :disabled="modifyOssConfigInfo.accessKeyId && modifyOssConfigInfo.accessKeySecret && modifyOssConfigInfo.description ? false : true"> 修改</n-button>
          <n-button type="error" size="small" @click="toolsData.modal.modify = false" class="mr05">关闭</n-button>
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
.taleData :deep() .n-button {
  margin-right: 10px;
}
</style>
