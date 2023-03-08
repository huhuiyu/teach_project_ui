<script setup lang="ts" name="portal">
import { NButton, NDataTable, NForm, NFormItem, NInput, NSpace, NModal, FormInst } from 'naive-ui'
import { reactive, h, ref } from 'vue'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import server from '../../tools/server'
import tools from '../../tools/tools'
import { useRouter } from 'vue-router'
import PortableInfo from '../../entity/PortableInfo'
import dialogApi from '../../tools/dialog'
import store from '../../store'
import { storeToRefs } from 'pinia'
import logger from '../../tools/logger'
import { ro } from 'date-fns/locale'
const storeInfo = store()
const router = useRouter()
const { loginUser } = storeToRefs(storeInfo)
const addRef = ref<FormInst | null>(null)
const modifyRef = ref<FormInst | null>(null)

//需要展示的列
const columns = reactive([
  { title: '信息编号', key: 'pmid' },
  { title: '信息分组', key: 'messageGroup' },
  { title: '信息的标志键名', key: 'messageKey' },
  {
    title: '信息内容',
    key: 'message',
    titleColSpan: 0,
    render(row: PortableInfo) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
            title: row.message,
          },
          { default: () => row.message }
        ),
      ]
    },
  },
  // { title: '开发者key', key: 'accessKey' },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: PortableInfo) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => tools.formatDate(row.lastupdate) }
        ),
      ]
    },
  },
  {
    title: '操作',
    key: 'operation',
    titleColSpan: 2,
    render(row: PortableInfo) {
      return [
        h(
          NButton,
          {
            dashed: true,
            style: 'margin:0.2rem',
            type: 'warning',
            onClick: () => {
              let modifyArr = Object.keys(userPortalData.modify)
              let arr = Object.keys(row)
              logger.debug(userPortalData.modify)
              logger.debug(arr, modifyArr)
              arr.forEach((key, i) => {
                if (modifyArr.includes(key)) {
                  userPortalData.modify[key] = row[key]
                }
              })
              logger.debug(userPortalData.modify)
              toolsData.modal.modify = true
            },
          },
          { default: () => '修改' }
        ),
        h(
          NButton,
          {
            type: 'error',
            dashed: true,
            style: 'margin:0.2rem',
            onClick: () => {
              delPortal(row)
            },
          },
          { default: () => '删除' }
        ),
      ]
    },
  },
])
const toolsData = reactive({
  modal: {
    add: false,
    modify: false,
    export: false,
    import: false,
  },
  loading: {
    queryUser: false,
    add: false,
    modify: false,
    del: false,
    export: false,
    import: false,
  },
  rules: {
    message: [
      {
        required: true,
        validator: (_: any, value: string) => {
          if (value == '') {
            return new Error('请输入信息内容')
          }
        },
        message: '请输入信息内容',
        trigger: ['input', 'blur'],
      },
    ],
    messageGroup: [
      {
        required: true,
        validator: (_: any, value: string) => {
          if (value == '') {
            return new Error('请输入信息分组')
          }
        },
        message: '请输入信息分组',
        trigger: ['input', 'blur'],
      },
    ],
    messageKey: [
      {
        required: true,
        validator: (_: any, value: string) => {
          if (value == '') {
            return new Error('请输入信息的标志键名')
          }
        },
        message: '请输入信息的标志键名',
        trigger: ['input', 'blur'],
      },
    ],
  },
})
const userPortalData = reactive({
  queryInfo: {
    messageGroup: '',
  },
  addInfo: {
    messageKey: '',
    messageGroup: '',
    message: '',
  },
  modify: { messageKey: '', messageGroup: '', message: '', pmid: '' },
  page: new PageInfo(),
  list: [] as PortableInfo[],
  exportMessageGroup: '',
  exportMessage: '',
  importPortalData: '',
})
const queryUserAll = () => {
  toolsData.loading.queryUser = true
  server.post('/portable/message/queryUserAll', tools.concatJson(userPortalData.queryInfo, userPortalData.page), (data: BaseListResult<PortableInfo>) => {
    toolsData.loading.queryUser = false
    if (data.success) {
      userPortalData.list = data.list
      userPortalData.page = data.page
    }
  })
}
queryUserAll()
const reset = () => {
  userPortalData.queryInfo.messageGroup = ''
  userPortalData.page.pageNumber = 1
  queryUserAll()
}
//未登录直接退出
if (!loginUser.value.isLogin) {
  dialogApi.messageWarning('请登录后访问！！！', {
    duration: 1500,
    onAfterLeave: () => {
      router.back()
    },
  })
} else {
  queryUserAll()
}
const addUserPortal = () => {
  addRef.value?.validate((error) => {
    if (!error) {
      toolsData.loading.add = true
      server.post('/portable/message/add', userPortalData.addInfo, (data: BaseResult) => {
        toolsData.loading.add = false
        if (data.success) {
          dialogApi.messageInfo(data.message)
          queryUserAll()
        }
      })
    }
  })
}
const modifyPortal = () => {
  modifyRef.value?.validate((error) => {
    if (!error) {
      toolsData.loading.modify = true
      server.post('/portable/message/update', userPortalData.modify, (data: BaseResult) => {
        toolsData.loading.modify = false
        if (data.success) {
          dialogApi.messageInfo(data.message)
          queryUserAll()
        }
      })
    }
  })
}
const delPortal = (row: PortableInfo) => {
  dialogApi.showWarning({
    title: '警告',
    content: `你确定删除${row.messageKey}嘛`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      toolsData.loading.del = true
      server.post('/portable/message/delete', { pmid: row.pmid }, (data: BaseResult) => {
        toolsData.loading.modify = false
        if (data.success) {
          dialogApi.messageInfo(data.message)
          queryUserAll()
        }
      })
      toolsData.loading.del = false
    },
    onNegativeClick: () => {
      dialogApi.messageInfo('已取消')
    },
  })
}
const exportUserPortal = () => {
  toolsData.loading.export = true
  server.post('/portable/message/export', { messageGroup: userPortalData.exportMessageGroup }, (data: BaseResult) => {
    toolsData.loading.export = false
    if (data.success) {
      userPortalData.exportMessage = data.message
    }
  })
}
const copyUserPortal = () => {
  navigator.clipboard
    .writeText(userPortalData.exportMessage)
    .then(() => {
      dialogApi.messageInfo('复制成功')
    })
    .catch(() => {
      dialogApi.messageInfo('复制失败，请手动复制。')
    })
}
const importPortal = () => {
  toolsData.loading.import = true
  server.post('/portable/message/import', { data: userPortalData.importPortalData }, (data: BaseResult) => {
    toolsData.loading.export = false
    if (data.success) {
      dialogApi.messageInfo(data.message)
      queryUserAll()
    }
  })
  toolsData.loading.import = false
}
const queryUserAllByInfo = () => {
  userPortalData.page.pageNumber = 1
  queryUserAll()
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>用户门户信息管理</h1>
    </header>
    <n-form inline :model="userPortalData.queryInfo" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
      <n-form-item>
        <n-input v-model:value="userPortalData.queryInfo.messageGroup" placeholder="分组过滤条件，多个组用,号分隔" clearable />
      </n-form-item>

      <n-form-item>
        <n-button dashed @click="queryUserAllByInfo"> 查询 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button dashed type="info" @click="reset"> 重置 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button dashed type="primary" @click="toolsData.modal.add = true"> 添加门户信息 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button dashed type="success" @click="toolsData.modal.export = true" :loading="toolsData.loading.export"> 导出 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button dashed type="tertiary" @click="toolsData.modal.import = true" :loading="toolsData.loading.import"> 导入 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button dashed type="warning" @click="router.back()"> 返回 </n-button>
      </n-form-item>
    </n-form>
    <n-data-table :columns="columns" :data="userPortalData.list" :loading="toolsData.loading.queryUser" />
    <div v-if="userPortalData.page.pageCount > 1">
      <PageComp :page="userPortalData.page" :show-size-picker="true" @number-change="queryUserAll" @size-change="queryUserAll" @page-change="queryUserAll"></PageComp>
    </div>
    <n-modal v-model:show="toolsData.modal.add" preset="dialog" title="添加门户信息">
      <n-form ref="addRef" :rules="toolsData.rules" :model="userPortalData.addInfo" label-placement="left" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
        <n-form-item path="messageKey">
          <n-input v-model:value="userPortalData.addInfo.messageKey" placeholder="请输入信息的标志键名" />
        </n-form-item>
        <n-form-item path="messageGroup">
          <n-input v-model:value="userPortalData.addInfo.messageGroup" placeholder="请输入信息分组" />
        </n-form-item>
        <n-form-item path="message">
          <n-input
            v-model:value="userPortalData.addInfo.message"
            type="textarea"
            placeholder="请输入信息内容"
            :autosize="{
              maxRows: 8,
              minRows: 5,
            }"
            count
          />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="addUserPortal" class="mr05" :loading="toolsData.loading.add">添加门户信息</n-button>
          <n-button type="info" size="small" @click="toolsData.modal.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="toolsData.modal.modify" preset="dialog" title="修改门户信息">
      <n-form ref="modifyRef" :rules="toolsData.rules" :model="userPortalData.modify" label-placement="left" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
        <n-form-item path="messageKey">
          <n-input v-model:value="userPortalData.modify.messageKey" placeholder="请输入信息的标志键名" />
        </n-form-item>
        <n-form-item path="messageGroup">
          <n-input v-model:value="userPortalData.modify.messageGroup" placeholder="请输入信息分组" />
        </n-form-item>
        <n-form-item path="message">
          <n-input
            type="textarea"
            v-model:value="userPortalData.modify.message"
            placeholder="请输入信息内容"
            :autosize="{
              maxRows: 3,
              minRows: 3,
            }"
            count
          />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="modifyPortal" class="mr05" :loading="toolsData.loading.modify">确认修改门户信息</n-button>
          <n-button type="info" size="small" @click="toolsData.modal.modify = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="toolsData.modal.export" preset="dialog" title="导出门户信息">
      <n-form-item>
        <n-input v-model:value="userPortalData.exportMessageGroup" placeholder="要导出的分组过滤条件，多个组用,号分隔" />
      </n-form-item>
      <n-input
        v-if="userPortalData.exportMessage"
        type="textarea"
        :autosize="{
          maxRows: 10,
          minRows: 5,
        }"
        readonly
        count
        :value="userPortalData.exportMessage"
      >
      </n-input>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="exportUserPortal" class="mr05" :loading="toolsData.loading.export" :disabled="userPortalData.exportMessageGroup == '' ? true : false">导出门户信息</n-button>
          <n-button type="info" size="small" @click="copyUserPortal" v-if="userPortalData.exportMessage">复制</n-button>
          <n-button type="info" size="small" @click="toolsData.modal.export = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="toolsData.modal.import" preset="dialog" title="导入门户信息">
      <n-form-item>
        <n-input
          v-model:value="userPortalData.importPortalData"
          type="textarea"
          count
          placeholder="要导入的门户信息，数据库有相同group和key的数据为更新，否则为新增"
          :autosize="{
            maxRows: 10,
            minRows: 5,
          }"
          clearable
        />
      </n-form-item>

      <template #action>
        <div>
          <n-button type="success" size="small" @click="importPortal" class="mr05" :loading="toolsData.loading.import" :disabled="userPortalData.importPortalData == '' ? true : false">导入门户信息</n-button>
          <n-button type="info" size="small" @click="toolsData.modal.import = false" class="mr05">关闭</n-button>
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
:deep() .n-data-table-td[data-col-key='message'] > div > div {
  max-width: 20vw !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
