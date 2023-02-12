<script setup lang="ts" name="SystemUser">
import { NButton, NDataTable, NForm, NFormItem, NInput, NSpace, NSelect, NSwitch } from 'naive-ui'
import { reactive, h } from 'vue'
import PageComp from '../../component/PageComp.vue'
import { SystemUser } from '../../entity/AdminInfo'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import server from '../../tools/server'
import tools from '../../tools/tools'
import { useRouter } from 'vue-router'
import dialogApi from '../../tools/dialog'
const router = useRouter()
//系统日志需要展示的列
const columns = reactive([
  { title: '登录名', key: 'username' },
  { title: '用户名', key: 'nickname' },
  { title: '用户角色', key: 'role' },
  { title: '二次开发key', key: 'accessKey' },
  {
    title: '是否启用',
    key: 'enable',
    titleColSpan: 1,
    render(row: SystemUser) {
      return [
        h(
          NSwitch,
          {
            justify: 'center',
            checkedValue: 'y',
            uncheckedValue: 'n',
            value: row.enable,
            onChange: (value: string) => {
              if (value == 'n') {
                dialogApi.showError({
                  title: '禁用用户（同时该用户也会被强制下线），不能禁用内置的用户！！！',
                  content: `你确定禁用‘${row.nickname}’用户吗？？？`,
                  positiveText: '确定',
                  negativeText: '不确定',
                  onPositiveClick: () => {
                    enableOrDisableUser(row.uid, 'disable')
                  },
                  onNegativeClick: () => {
                    dialogApi.messageInfo('已取消')
                  },
                })
              } else if (value == 'y') {
                enableOrDisableUser(row.uid, 'enable')
              }
            },
          },
          { default: row.enable }
        ),
      ]
    },
  },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: SystemUser) {
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
    titleColSpan: 1,
    key: 'operation',
    render(row: SystemUser) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'error',
            onClick: () => {
              dialogApi.showError({
                title: '强制下线用户，不能禁用内置的用户',
                content: `你确定要强制下线‘${row.nickname}’用户吗？？？`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  kickUser(row.uid)
                },
                onNegativeClick: () => {
                  dialogApi.messageInfo('已取消')
                },
              })
            },
          },
          { default: () => '强制用户下线' }
        ),
      ]
    },
  },
])
const userData = reactive({
  queryInfo: {
    enable: '',
    nickname: '',
    username: '',
    orderBy: '1',
  },
  orderByList: [
    {
      label: '注册时间降序',
      value: '1',
    },
    {
      label: '注册时间升序',
      value: '2',
    },
    {
      label: '登录名称降序',
      value: '3',
    },
    {
      label: '登录名称升序',
      value: '4',
    },
    {
      label: '启用状态',
      value: '5',
    },
  ],
  enableList: [
    {
      label: '选择是否启用',
      value: '',
    },
    {
      label: '启用',
      value: 'y',
    },
    {
      label: '未启用',
      value: 'n',
    },
  ],
  loading: false,
  page: new PageInfo(),
  list: [] as SystemUser[],
})
const queryAll = () => {
  userData.loading = true
  server.post('/admin/user/query', tools.concatJson(userData.queryInfo, userData.page), (data: BaseListResult<SystemUser>) => {
    userData.loading = false
    if (data.success) {
      userData.page = data.page
      userData.list = data.list
    }
  })
}
queryAll()
const reset = () => {
  userData.page.pageNumber = 1
  userData.queryInfo.nickname = ''
  userData.queryInfo.username = ''
  userData.queryInfo.enable = ''
  userData.queryInfo.orderBy = '1'
  queryAll()
}
const queryUser = () => {
  userData.page.pageNumber = 1
  queryAll()
}

const enableOrDisableUser = (uid: string | number, mode: string) => {
  if (mode == 'enable') {
    server.post('/admin/user/enableUser', { uid: uid }, (data: BaseResult) => {
      if (data.success) {
        dialogApi.messageInfo(data.message)
        queryAll()
        return
      }
    })
  } else if (mode == 'disable') {
    server.post('/admin/user/disableUser', { uid: uid }, (data: BaseResult) => {
      if (data.success) {
        dialogApi.messageInfo(data.message)
        queryAll()
        return
      }
    })
  }
}
const kickUser = (uid: string | number) => {
  server.post('/admin/user/kickUser', { uid: uid }, (data: BaseResult) => {
    if (data.success) {
      dialogApi.messageInfo(data.message)
      queryAll()
      return
    }
  })
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>系统用户管理</h1>
    </header>
    <main>
      <n-form inline style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-select v-model:value="userData.queryInfo.orderBy" :options="userData.orderByList" @update:value="queryUser" :consistent-menu-width="false" />
        </n-form-item>
        <n-form-item>
          <n-select v-model:value="userData.queryInfo.enable" :options="userData.enableList" @update:value="queryUser" :consistent-menu-width="false" />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="userData.queryInfo.username" placeholder="请输入用户名" clearable />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="userData.queryInfo.nickname" placeholder="请输入用户昵称" clearable />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryUser"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="columns" :data="userData.list" :loading="userData.loading" />
      <div v-if="userData.page.pageCount > 1">
        <PageComp :page="userData.page" :show-size-picker="true" @number-change="queryAll" @size-change="queryAll" @page-change="queryAll"></PageComp>
      </div>
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
