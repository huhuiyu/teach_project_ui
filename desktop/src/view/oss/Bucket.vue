<script setup lang="ts">
import { FormInst, FormRules, NButton, NDataTable, NForm, NFormItem, NInput, NModal, NSelect, NSpace, NSwitch } from 'naive-ui'
import { useRouter } from 'vue-router'
import { reactive, h, ref } from 'vue'
import { TbBucket, OssEndPoints, OssConfig } from '../../entity/OssInfo'
import BaseResult, { BaseDataAyyayResult, BaseListResult, PageInfo } from '../../entity/BaseResult'
import server from '../../tools/server'
import dialogApi from '../../tools/dialog'
import tools from '../../tools/tools'
import PageComp from '../../component/PageComp.vue'
import logger from '../../tools/logger'
import loading from 'naive-ui/es/_internal/loading'
import { typeOf } from 'plupload'
const router = useRouter()
// 页面loading
const Loading = reactive({
  loading: false,
  modifyBucket: false,
  delBucket: false,
  addBucket: false,
})

// table表格

const columns = reactive([
  { title: 'bucket名称', key: 'bucketBaseName' },
  { title: 'bucket基本信息', key: 'bucketName' },
  {
    title: 'oss配置信息',
    key: 'ocid',
    render(row: any) {
      return [
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              for (let i = 0; i < allOssConfigData.list.length; i++) {
                if (allOssConfigData.list[i].ocid == row.ocid) return allOssConfigData.list[i].description
              }
            },
          }
        ),
      ]
    },
  },
  {
    title: 'oss节点信息',
    key: 'endpoint',
    render(row: any) {
      return [
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              for (let i = 0; i < OssEndPointslist.list.length; i++) {
                if (OssEndPointslist.list[i].endpoint == row.endpoint) return OssEndPointslist.list[i].region
              }
            },
          }
        ),
      ]
    },
  },
  {
    title: '跨域',
    key: 'operations',
    render(row: TbBucket) {
      return [
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              logger.debug('1236879909')
              return row.domains.split(',')[0]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 0) return row.domains.split(',')[1]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 1) return row.domains.split(',')[2]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 2) return row.domains.split(',')[3]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 3) return row.domains.split(',')[4]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 4) return row.domains.split(',')[5]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 5) return row.domains.split(',')[6]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 6) return row.domains.split(',')[7]
            },
          }
        ),
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              if (row.domains.split(',').length > 7) return row.domains.split(',')[8]
            },
          }
        ),
      ]
    },
  },
  { title: '链接过期时间（秒）', key: 'expiration' },

  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    render(row: any) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          {
            default: () => tools.formatDate(parseInt(row.lastupdate)),
          }
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'operation',
    render(row: TbBucket) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'medium',
            type: 'info',
            onClick: () => {
              modifyOssBucket.obid = row.obid + ''
              modifyOssBucket.ocid = row.ocid + ''
              modifyOssBucket.domains = row.domains
              modifyOssBucket.expiration = row.expiration + ''
              modifyOssBucket.info = row.info
              Loading.modifyBucket = true
            },
          },
          {
            default: () => '修改',
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
                title: `警告是否删除该bucket配置`,
                content: '（严重警告，配置下所有的bucket以及文件也会全部删除！！！），是否删除？',
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delOssBucket(row.obid)
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
      ]
    },
  },
])

// bucket
const bucket = reactive({
  page: new PageInfo(),
  list: [] as TbBucket[],
})
// 删除bucket
const delOssBucket = (obid: number) => {
  Loading.loading = true
  server.post('/oss/bucket/delete', { obid: obid }, (data: BaseResult) => {
    Loading.loading = false
    if (data.success) {
      dialogApi.messageInfo(data.message)
      queryAllOssBucket()
    }
  })
}
// 查询所有的bucket
const queryAllOssBucket = () => {
  Loading.loading = true
  server.post('/oss/bucket/queryAll', bucket.page, (data: BaseListResult<TbBucket>) => {
    Loading.loading = false
    if (data.success) {
      bucket.list = data.list
      bucket.page = data.page
    }
  })
}
queryAllOssBucket()
// 添加bucket信息
const addOssbucket = reactive({
  bucketName: '',
  domains: '*',
  endpoint: '',
  expiration: '3600',
  info: '',
  ocid: '',
})
const addBucket = () => {
  addmodifyRef.value?.validate((error) => {
    if (!error) {
      Loading.loading = true
      server.post('/oss/bucket/add', addOssbucket, (data: BaseResult) => {
        Loading.loading = false
        Loading.addBucket = false
        if (data.success) {
          queryAllOssBucket()
        }
      })
    }
  })
}
const addmodifyRef = ref<FormInst | null>(null)
const addRules: FormRules = {
  bucketName: [
    {
      required: true,
      message: 'bucket名称不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  domains: [
    {
      required: true,
      message: '跨域（防盗链）不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  endpoint: [
    {
      required: true,
      message: 'oss节点信息不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  expiration: [
    {
      required: true,
      message: '链接过期时间不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  info: [
    {
      required: true,
      message: '	bucket描述信息不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  ocid: [
    {
      required: true,
      message: 'oss配置编号不能为空',
      trigger: ['input', 'blur'],
    },
  ],
}

const modifyRules: FormRules = {
  domains: [
    {
      required: true,
      message: '跨域（防盗链）不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  endpoint: [
    {
      required: true,
      message: 'oss节点信息不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  expiration: [
    {
      required: true,
      message: '链接过期时间不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  info: [
    {
      required: true,
      message: '	bucket描述信息不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  ocid: [
    {
      required: true,
      message: 'oss配置编号不能为空',
      trigger: ['input', 'blur'],
    },
  ],
}
// oss节点信息列表
const selectEndPoints = reactive({
  list: [{ label: '选择节点', value: '' }],
})
const OssEndPointslist = reactive({
  list: [] as OssEndPoints[],
})

// 查询oss节点信息列表
const queryossEndPoints = () => {
  selectEndPoints.list = [{ label: '选择节点', value: '' }]
  server.post('/oss/bucket/ossEndPoints', {}, (data: BaseDataAyyayResult<OssEndPoints>) => {
    if (data.success) {
      OssEndPointslist.list = data.data
      data.data.forEach((item) => {
        selectEndPoints.list.push({
          label: item.region,
          value: item.endpoint,
        })
      })
    }
  })
}
queryossEndPoints()

// 查询oss配置信息列表
const selectConfig = reactive({
  list: [{ label: '选择oss配置', value: '' }],
})
const allOssConfigData = reactive({
  list: [] as OssConfig[],
})
const queryOssConfig = () => {
  selectConfig.list = [{ label: '选择oss配置', value: '' }]
  server.post('/oss/config/queryAll', {}, (data: BaseListResult<OssConfig>) => {
    if (data.success) {
      allOssConfigData.list = data.list
      data.list.forEach((item) => {
        selectConfig.list.push({
          label: item.description,
          value: item.ocid + '',
        })
      })
    }
  })
}
queryOssConfig()
// 修改bucket
const modifyOssBucket = reactive({
  domains: '',
  expiration: '3600',
  info: '',
  ocid: '',
  obid: '',
})

// 修改bucket
const querymodifyBucket = () => {
  addmodifyRef.value?.validate((error) => {
    if (!error) {
      Loading.loading = true
      server.post('/oss/bucket/update', modifyOssBucket, (data: BaseResult) => {
        Loading.loading = false
        Loading.modifyBucket = false
        if (data.success) {
          queryAllOssBucket()
        }
      })
    }
  })
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>bucket信息配置</h1>
    </header>
    <main>
      <NForm inline size="medium" style="justify-content: flex-end; padding-right: 3rem">
        <NFormItem>
          <NButton type="success" dashed @click="queryAllOssBucket()">重置</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="warning" dashed @click="Loading.addBucket = true">添加</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="error" dashed @click="router.back()">返回</NButton>
        </NFormItem>
      </NForm>
      <n-data-table class="taleData" :columns="columns" :data="bucket.list" :loading="Loading.loading" />
      <div v-if="bucket.page.pageCount > 1">
        <PageComp :page="bucket.page" :show-size-picker="true" @number-change="queryAllOssBucket" @page-change="queryAllOssBucket" @size-change="queryAllOssBucket"></PageComp>
      </div>
    </main>
    <!-- 添加bucket -->
    <NModal v-model:show="Loading.addBucket" preset="dialog" :mask-closable="false" style="width: 50%">
      <template #header>
        <div>添加bucket配置信息</div>
      </template>
      <NForm ref="addmodifyRef" :rules="addRules" :model="addOssbucket" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
        <NFormItem label="bucket名称" path="bucketName">
          <NInput v-model:value="addOssbucket.bucketName"></NInput>
        </NFormItem>
        <NFormItem label="跨域（防盗链）" path="domains">
          <NInput v-model:value="addOssbucket.domains"></NInput>
        </NFormItem>
        <NFormItem label="bucket描述信息" path="info">
          <NInput v-model:value="addOssbucket.info"></NInput>
        </NFormItem>
        <NFormItem label="oss节点信息" path="endpoint">
          <NSelect v-model:value="addOssbucket.endpoint" :options="selectEndPoints.list"></NSelect>
        </NFormItem>
        <NFormItem label="oss配置编号" path="ocid">
          <NSelect v-model:value="addOssbucket.ocid" :options="selectConfig.list"></NSelect>
        </NFormItem>
        <NFormItem label="链接过期时间（秒）" path="expiration">
          <NInput v-model:value="addOssbucket.expiration"></NInput>
        </NFormItem>
      </NForm>
      <template #action>
        <div>
          <NButton type="success" size="small" @click="addBucket" dashed class="mr05">添加bucket信息</NButton>
          <NButton type="error" size="small" @click="Loading.addBucket = false" dashed class="mr05">关闭</NButton>
        </div>
      </template>
    </NModal>
    <!-- 修改bucket -->
    <NModal v-model:show="Loading.modifyBucket" preset="dialog" :mask-closable="false" style="width: 50%">
      <template #header>
        <div>修改bucket配置信息</div>
      </template>
      <NForm ref="addmodifyRef" :rules="modifyRules" :model="modifyOssBucket" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
        <NFormItem label="跨域（防盗链）" path="domains">
          <NInput v-model:value="modifyOssBucket.domains"></NInput>
        </NFormItem>
        <NFormItem label="bucket描述信息" path="info">
          <NInput v-model:value="modifyOssBucket.info"></NInput>
        </NFormItem>
        <!-- <NFormItem label="oss节点信息">
          <NSelect v-model:value="modifyOssBucket.endpoint" :options="OssEndPointslist.list"></NSelect>
        </NFormItem> -->
        <NFormItem label="oss配置编号">
          <NSelect v-model:value="modifyOssBucket.ocid" :options="selectConfig.list"></NSelect>
        </NFormItem>
        <!-- <NFormItem label="链接过期时间（秒）" path="expiration">
          <NInput v-model:value="modifyOssBucket.expiration"></NInput>
        </NFormItem> -->
      </NForm>
      <template #action>
        <div>
          <NButton type="success" size="small" @click="querymodifyBucket" dashed class="mr05">修改bucket信息</NButton>
          <NButton type="error" size="small" @click="Loading.modifyBucket = false" dashed class="mr05">关闭</NButton>
        </div>
      </template>
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
  margin-right: 10px;
}
</style>
