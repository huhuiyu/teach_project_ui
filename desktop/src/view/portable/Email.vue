<script setup lang="ts" name="portableEmail">
import { NButton, NDataTable, NForm, NFormItem, NInput, NSpace, NModal, FormInst, NCard, NScrollbar } from 'naive-ui'
import { reactive, h, ref } from 'vue'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import server, { serverInfo } from '../../tools/server'
import tools from '../../tools/tools'
import { useRouter } from 'vue-router'
import { PortableEmailAll, PortableEmailInfo } from '../../entity/PortableInfo'
import dialogApi from '../../tools/dialog'
import store from '../../store'
import { storeToRefs } from 'pinia'
const storeInfo = store()
const router = useRouter()
const { loginUser } = storeToRefs(storeInfo)

const addRef = ref<FormInst | null>(null)
const toolsData = reactive({
  modal: {
    add: false,
    emailDetail: false,
  },
  loading: {
    add: false,
    sendDetail: false,
    queryAll: false,
    emailDetail: false,
  },
  rules: {
    add: {
      email: [
        {
          required: true,
          validator: (_: any, value: string) => {
            if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)) {
              return new Error('请输入正确的邮箱格式')
            }
            return true
          },
          message: '请输入正确的邮箱格式',
          trigger: ['input', 'blur'],
        },
      ],
      username: [
        {
          required: true,
          validator: (_: any, value: string) => {
            if (value == '') {
              return new Error('请输入用户名')
            }
          },
          message: '请输入用户名',
          trigger: ['input', 'blur'],
        },
      ],
      info: [
        {
          required: true,
          validator: (_: any, value: string) => {
            if (value == '') {
              return new Error('请输入内容')
            }
          },
          message: '请输入内容',
          trigger: ['input', 'blur'],
        },
      ],
    },
  },
})
//需要展示的列
const columns = reactive([
  { title: '留言用户名', key: 'username' },
  { title: '电子邮件', key: 'email' },
  { title: '开发者key', key: 'accessKey' },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: PortableEmailAll) {
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
    titleColSpan: 1,
    render(row: PortableEmailAll) {
      return [
        h(
          NButton,
          {
            dashed: true,
            onClick: () => {
              toolsData.modal.emailDetail = true
              emailDetailData.peid = row.peid
              queryEmailDetail()
            },
          },
          { default: () => '查看详细信息及回复' }
        ),
      ]
    },
  },
])
const emailData = reactive({
  queryAllEmailInfo: {
    email: '',
    username: '',
  },
  addEmailInfo: {
    accessKey: serverInfo.accessKey,
    username: '',
    info: '',
    email: '',
  },
  page: new PageInfo(),
  list: [] as PortableEmailAll[],
})
const queryAll = () => {
  toolsData.loading.queryAll = true
  server.post('/portable/emailinfo/queryAllEmail', tools.concatJson(emailData.queryAllEmailInfo, emailData.page), (data: BaseListResult<PortableEmailAll>) => {
    toolsData.loading.queryAll = false
    if (data.success) {
      emailData.page = data.page
      emailData.list = data.list
    }
  })
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
  queryAll()
}
const emailDetailData = reactive({
  peid: 0,
  list: [] as PortableEmailInfo[],
  page: new PageInfo(),
  info: '',
})
const queryEmailDetail = () => {
  toolsData.loading.emailDetail = true
  server.post('/portable/emailinfo/queryAll', tools.concatJson({ peid: emailDetailData.peid }, emailDetailData.page), (data: BaseListResult<PortableEmailInfo>) => {
    toolsData.loading.emailDetail = false
    if (data.success) {
      emailDetailData.page = data.page
      emailDetailData.list = data.list.reverse()
    }
  })
}
const sendEmailDetail = () => {
  toolsData.loading.sendDetail = true
  server.post('/portable/emailinfo/reply', { peid: emailDetailData.peid, info: emailDetailData.info }, (data: BaseResult) => {
    toolsData.loading.sendDetail = false
    if (data.success) queryEmailDetail()
  })
}
const sendEmail = () => {
  addRef.value?.validate((error) => {
    if (!error) {
      toolsData.loading.add = true
      server.post('/portable/emailinfo/add', emailData.addEmailInfo, (data: BaseResult) => {
        toolsData.loading.add = false
        if (data.success) dialogApi.messageInfo(data.message)
      })
    }
  })
}
const reset = () => {
  emailData.page.pageNumber = 1
  emailData.queryAllEmailInfo.email = ''
  emailData.queryAllEmailInfo.username = ''
  queryAll()
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>用户邮箱留言管理</h1>
    </header>
    <main>
      <n-form inline :model="emailData.queryAllEmailInfo" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-input v-model:value="emailData.queryAllEmailInfo.email" placeholder="请输入留言邮箱" clearable />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="emailData.queryAllEmailInfo.email" placeholder="请输入留言用户" clearable />
        </n-form-item>
        <n-form-item>
          <n-button dashed @click="queryAll"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button dashed type="info" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button dashed type="primary" @click="toolsData.modal.add = true"> 发留言 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button dashed type="warning" @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="columns" :data="emailData.list" :loading="toolsData.loading.queryAll" />
      <div v-if="emailData.page.pageCount > 1">
        <PageComp :page="emailData.page" :show-size-picker="true" @number-change="queryAll" @size-change="queryAll" @page-change="queryAll"></PageComp>
      </div>
    </main>
    <n-modal v-model:show="toolsData.modal.add" preset="dialog">
      <template #header>
        <div>发送留言</div>
      </template>
      <n-form ref="addRef" :model="emailData.addEmailInfo" label-placement="left" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="toolsData.rules.add">
        <n-form-item path="username">
          <n-input v-model:value="emailData.addEmailInfo.username" placeholder="请输入名称" />
        </n-form-item>
        <n-form-item path="email">
          <n-input v-model:value="emailData.addEmailInfo.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item path="info">
          <n-input
            type="textarea"
            v-model:value="emailData.addEmailInfo.info"
            placeholder="请输入信息"
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
          <n-button type="success" size="small" @click="sendEmail" class="mr05" :loading="toolsData.loading.add">发送邮箱留言</n-button>
          <n-button type="info" size="small" @click="toolsData.modal.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="toolsData.modal.emailDetail" preset="card" style="width: 40vw" :loading="toolsData.loading.emailDetail">
      <n-card embedded :bordered="false" content-style="overflow-y: auto;padding-right:0" footer-style="padding:0px" style="height: 50vh">
        <n-scrollbar style="padding-right: 24px">
          <div v-if="toolsData.loading.emailDetail">
            <n-space :wrap="false" class="mr05">
              <n-card size="small" class="is-you">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </n-card>
            </n-space>
          </div>
          <div v-for="m in emailDetailData.list" :key="m.lastupdate" v-else>
            <n-space v-if="m.infoType == 'user'" :wrap="false" class="mr05">
              <n-card size="small" class="is-you">{{ m.info }}</n-card>
            </n-space>
            <n-space v-if="m.infoType == 'website'" justify="end" :wrap="false" class="mr05">
              <n-card size="small" class="is-me">{{ m.info }}</n-card>
            </n-space>
          </div>
        </n-scrollbar>
        <template #footer>
          <n-input
            v-model:value="emailDetailData.info"
            style="background-color: rgb(250, 250, 254)"
            type="textarea"
            show-count
            autofocus
            maxlength="300"
            :autosize="{
              maxRows: 5,
              minRows: 5,
            }"
            count
          >
            <template #suffix>
              <n-button @click="sendEmailDetail" v-loading="toolsData.loading.sendDetail" :disabled="emailDetailData.info == '' ? true : false">发送</n-button>
            </template>
          </n-input>
        </template>
      </n-card>
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

.is-me {
  border-radius: 16px 0 16px 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
}
.is-you {
  border-radius: 16px 16px 16px 0px;
  border-top-right-radius: 16px;
  border-top-left-radius: 0px;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
}
</style>
