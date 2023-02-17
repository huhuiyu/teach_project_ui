<script setup lang="ts">
import { DataTableColumns, FormInst, FormItemRule, FormRules, NButton, NDataTable, NForm, NFormItem, NInput, NModal, NSpace } from 'naive-ui'
import { reactive, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { Contacts } from '../../entity/Contacts'
import { ListNote } from '../../entity/notepad'
import dialogApi from '../../tools/dialog'
import server from '../../tools/server'
import tools from '../../tools/tools'
const router = useRouter()
const title = '通讯录'
const Loading = reactive({
  loading: false,
  infoLoading: false,
  addNoeLoading: false,
  modifyNoteLoading: false,
  delLoaidng: false,
})
const contacts = reactive({
  list: [] as Contacts[],
  page: new PageInfo(),
  delList: [] as Contacts[],
  delPage: new PageInfo(),
  query: {
    username: '',
    wechat: '',
    phone: '',
    qq: '',
  },
  add: {
    username: '',
    wechat: '',
    phone: '',
    qq: '',
  },
  modify: {
    unid: -1,
    username: '',
    wechat: '',
    phone: '',
    qq: '',
    ucid: -1,
  },
})
const queryContacts = () => {
  Loading.loading = true
  Loading.delLoaidng = false
  server.post('/user/contact/queryAll', contacts.query, (data: BaseListResult<Contacts>) => {
    if (data.success) {
      Loading.loading = false
      contacts.list = data.list
      contacts.page = data.page
    }
  })
}
queryContacts()
const contactsColumns: DataTableColumns<Contacts> = [
  { title: '姓名', key: 'username' },
  { title: '电话', key: 'phone' },
  { title: '微信', key: 'wechat' },
  { title: 'QQ', key: 'qq' },
  {
    title: '信息修改时间',
    key: 'lastupdate',
    render(row: Contacts) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
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
    render(row: Contacts) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'warning',
            onClick: () => {
              contacts.modify.username = row.username
              contacts.modify.phone = row.phone
              contacts.modify.wechat = row.wechat
              contacts.modify.qq = row.qq
              contacts.modify.ucid = row.ucid
              Loading.modifyNoteLoading = true
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
            size: 'small',
            type: 'error',
            onClick: () => {
              dialogApi.showError({
                title: `警告是否删除姓名为${row.username}的联系人`,
                content: '删除后请到删除的通讯录里面查找',
                positiveText: '删除',
                negativeText: '取消',
                onPositiveClick: () => {
                  Loading.loading = true
                  server.post('/user/contact/delete', { ucid: row.ucid }, (data: BaseResult) => {
                    if (data.success) {
                      queryContacts()
                    }
                    Loading.loading = false
                  })
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
]
const delContactsColumns: DataTableColumns<Contacts> = [
  { title: '姓名', key: 'username' },
  { title: '电话', key: 'phone' },
  { title: '微信', key: 'wechat' },
  { title: 'QQ', key: '1994218594' },
  {
    title: '信息修改时间',
    key: 'lastupdate',
    render(row: Contacts) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          {
            default: () => tools.formatDate(row.lastupdate),
          }
        ),
      ]
    },
  },
]
const modifyContacts = () => {
  server.post('/user/contact/update', contacts.modify, (data: BaseResult) => {
    Loading.modifyNoteLoading = false
    queryContacts()
  })
}
const reset = () => {
  contacts.query.username = ''
  contacts.query.phone = ''
  contacts.query.wechat = ''
  contacts.query.qq = ''
  queryContacts()
}
const resetAddInfo = () => {
  contacts.add.username = ''
  contacts.add.phone = ''
  contacts.add.wechat = ''
  contacts.add.qq = ''
  Loading.addNoeLoading = false
}
const addContacts = () => {
  server.post('/user/contact/add', contacts.add, (data: BaseResult) => {
    if (data.success) {
      resetAddInfo()
      queryContacts()
    }
  })
}
const delsqueryContacts = () => {
  Loading.delLoaidng = !Loading.delLoaidng
  Loading.loading = true
  server.post('/user/contact/queryAllDeleted', contacts.query, (data: BaseListResult<Contacts>) => {
    Loading.loading = false
    if (data.success) {
      contacts.delList = data.list
      contacts.delPage = data.page
    }
  })
}
const AddRef = ref<FormInst | null>(null)
const ModigyRef = ref<FormInst | null>(null)
const AddRules: FormRules = {
  username: [
    {
      required: true,
      message: '联系人姓名不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  phone: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
        return true
      },
      message: '请输入正确手机号格式',
      trigger: ['input', 'blur'],
    },
  ],
  weacht: [
    {
      required: true,
      message: '联系人微信不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  qq: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^\s*[.0-9]{5,11}\s*$/.test(value)) return new Error('请输入正确QQ号格式')
        return true
      },
      message: '请输入正确QQ号格式',
      trigger: ['input', 'blur'],
    },
  ],
}
const ModigyRules: FormRules = {
  username: [
    {
      required: true,
      message: '联系人姓名不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  phone: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
        return true
      },
      message: '请输入正确手机号格式',
      trigger: ['input', 'blur'],
    },
  ],
  weacht: [
    {
      required: true,
      message: '联系人微信不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  qq: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^\s*[.0-9]{5,11}\s*$/.test(value)) return new Error('请输入正确QQ号格式')
        return true
      },
      message: '请输入正确QQ号格式',
      trigger: ['input', 'blur'],
    },
  ],
}
const resetdel = () => {}
</script>
<template>
  <div>
    <header class="tc">
      <h2>{{ title }}</h2>
    </header>
    <main>
      <NForm inline size="medium" style="justify-content: flex-end; padding-right: 3rem">
        <NFormItem>
          <NInput placeholder="姓名模糊查询" v-model:value="contacts.query.username"></NInput>
        </NFormItem>
        <NFormItem>
          <NInput placeholder="电话模糊查询" v-model:value="contacts.query.phone"></NInput>
        </NFormItem>
        <NFormItem>
          <NInput placeholder="微信模糊查询" v-model:value="contacts.query.wechat"></NInput>
        </NFormItem>
        <NFormItem>
          <NInput placeholder="QQ模糊查询" v-model:value="contacts.query.qq"></NInput>
        </NFormItem>
        <NFormItem>
          <NButton v-if="!Loading.delLoaidng" type="success" dashed @click="queryContacts">查询</NButton>
          <NButton v-if="Loading.delLoaidng" type="success" dashed @click="delsqueryContacts">查询</NButton>
        </NFormItem>
        <NFormItem>
          <NButton v-if="!Loading.delLoaidng" type="info" dashed @click="Loading.addNoeLoading = true">添加</NButton>
        </NFormItem>
        <NFormItem>
          <NButton v-if="!Loading.delLoaidng" type="warning" dashed @click="reset">重置</NButton>
          <NButton v-if="Loading.delLoaidng" type="warning" dashed @click="resetdel">重置</NButton>
        </NFormItem>
        <NFormItem>
          <NButton v-if="!Loading.delLoaidng" type="primary" dashed @click="delsqueryContacts">已删除</NButton>
          <NButton v-if="Loading.delLoaidng" type="primary" dashed @click="queryContacts">未删除</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="error" dashed @click="router.back()">返回</NButton>
        </NFormItem>
      </NForm>
      <NDataTable v-if="!Loading.delLoaidng" :columns="contactsColumns" :data="contacts.list" :loading="Loading.loading" />
      <NDataTable v-else :columns="delContactsColumns" :data="contacts.delList" :loading="Loading.loading" />
      <PageComp v-if="contacts.page.pageCount > 1 && !Loading.delLoaidng" :page="contacts.page" @number-change="queryContacts" @size-change="queryContacts" @page-change="queryContacts" :show-size-picker="true"></PageComp>
      <PageComp v-if="contacts.page.pageCount > 1 && Loading.delLoaidng" :page="contacts.delList" @number-change="delsqueryContacts" @size-change="delsqueryContacts" @page-change="delsqueryContacts" :show-size-picker="true"></PageComp>
      <NModal v-model:show="Loading.addNoeLoading" preset="dialog" :mask-closable="true" style="width: 50%">
        <template #header> 添加联系人信息 </template>
        <NForm ref="AddRef" :rules="AddRules" :model="contacts.add" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
          <NFormItem label="联系人姓名" path="username">
            <NInput v-model:value="contacts.add.username" placeholder="联系人姓名"></NInput>
          </NFormItem>
          <NFormItem label="联系人电话" path="phone">
            <NInput v-model:value="contacts.add.phone" placeholder="联系人电话"></NInput>
          </NFormItem>
          <NFormItem label="联系人微信" path="wechat">
            <NInput v-model:value="contacts.add.wechat" placeholder="联系人微信"></NInput>
          </NFormItem>
          <NFormItem label="联系人QQ" path="qq">
            <NInput v-model:value="contacts.add.qq" placeholder="联系人QQ"></NInput>
          </NFormItem>
        </NForm>
        <template #action>
          <div>
            <NButton type="success" size="small" dashed class="mr05" @click="addContacts">添加</NButton>
            <NButton type="error" size="small" dashed class="mr05" @click="resetAddInfo">关闭</NButton>
          </div>
        </template>
      </NModal>
      <NModal v-model:show="Loading.modifyNoteLoading" preset="dialog" :mask-closable="false" style="width: 50%">
        <template #header> 修改联系人信息 </template>
        <NForm ref="ModigyRef" :rules="ModigyRules" :model="contacts.modify" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
          <NFormItem label="联系人姓名" path="username">
            <NInput v-model:value="contacts.modify.username" placeholder="联系人姓名"></NInput>
          </NFormItem>
          <NFormItem label="联系人电话" path="phone">
            <NInput v-model:value="contacts.modify.phone" placeholder="联系人电话"></NInput>
          </NFormItem>
          <NFormItem label="联系人微信" path="wechat">
            <NInput v-model:value="contacts.modify.wechat" placeholder="联系人微信"></NInput>
          </NFormItem>
          <NFormItem label="联系人QQ" path="qq">
            <NInput v-model:value="contacts.modify.qq" placeholder="联系人QQ"></NInput>
          </NFormItem>
        </NForm>
        <template #action>
          <div>
            <NButton type="success" size="small" dashed class="mr05" @click="modifyContacts">修改</NButton>
            <NButton type="error" size="small" dashed class="mr05" @click="Loading.modifyNoteLoading = false">关闭</NButton>
          </div>
        </template>
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
:deep() .n-input__textarea-el {
  text-indent: 2em;
}
</style>
