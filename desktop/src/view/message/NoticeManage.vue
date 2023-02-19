<script setup lang="ts" name="SystemLog">
import { NButton, NDataTable, NForm, NFormItem, NInput, NModal, NSpace } from 'naive-ui'
import { reactive, h } from 'vue'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import server from '../../tools/server'
import tools from '../../tools/tools'
import { useRouter } from 'vue-router'
import { Announcement } from '../../entity/MessageDetailResult'
import dialogApi from '../../tools/dialog'
import store from '../../store'
import { storeToRefs } from 'pinia'
const router = useRouter()
//pinia
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)

//系统日志需要展示的列
const columns = reactive([
  { title: '主键', key: 'niid' },
  { title: '公告标题', key: 'title' },
  { title: '公告内容', key: 'info' },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: Announcement) {
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
    render(row: Announcement) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'error',
            disabled: NoticeData.disabled,
            onClick: () => {
              dialogApi.showError({
                title: '删除公告',
                content: `你确定要删除该‘${row.title}’公告吗？？？`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delNotice(row.niid)
                },
                onNegativeClick: () => {
                  dialogApi.messageInfo('已取消')
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
const NoticeData = reactive({
  loading: false,
  page: new PageInfo(),
  list: [] as Announcement[],
  addInfo: {
    title: '',
    info: '',
  },
  addModal: false,
  disabled: false,
})
if (!loginUser.value.isLogin) {
  NoticeData.disabled = true
} else if (loginUser.value.tbUser.role != 'app-admin') {
  NoticeData.disabled = true
}
const queryAll = () => {
  NoticeData.loading = true
  server.post('/message/queryNotice', NoticeData.page, (data: BaseListResult<Announcement>) => {
    NoticeData.loading = false
    if (data.success) {
      NoticeData.page = data.page
      NoticeData.list = data.list
    }
  })
}
queryAll()
const reset = () => {
  NoticeData.page.pageNumber = 1
  queryAll()
}
const addNotice = () => {
  server.post('/message/manage/addNotice', NoticeData.addInfo, (data: BaseResult) => {
    if (data.success) {
      dialogApi.messageInfo(data.message)
      queryAll()
    }
  })
}
const delNotice = (niid: string | number) => {
  server.post('/message/manage/deleteNotice', { niid: niid }, (data: BaseResult) => {
    if (data.success) {
      dialogApi.messageInfo(data.message)
      queryAll()
    }
  })
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>系统日志管理</h1>
    </header>
    <main>
      <n-form inline size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-button attr-type="button" @click="queryAll"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="NoticeData.addModal = true" :disabled="NoticeData.disabled"> 添加 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="columns" :data="NoticeData.list" :loading="NoticeData.loading" />
      <div v-if="NoticeData.page.pageCount > 1">
        <PageComp :page="NoticeData.page" :show-size-picker="true" @number-change="queryAll" @size-change="queryAll" @page-change="queryAll"></PageComp>
      </div>
    </main>
  </div>
  <n-modal v-model:show="NoticeData.addModal" title="添加留言板公告" preset="dialog">
    <n-form label-placement="left">
      <n-form-item>
        <n-input v-model:value="NoticeData.addInfo.title" placeholder="请输入公告标题"></n-input>
      </n-form-item>
      <n-form-item>
        <n-input
          type="textarea"
          :autosize="{
            minRows: 3,
            maxRows: 5,
          }"
          v-model:value="NoticeData.addInfo.info"
          placeholder="请输入公告内容"
        ></n-input>
      </n-form-item>
    </n-form>
    <template #action>
      <div>
        <n-button type="success" size="small" class="mr05" :disabled="NoticeData.addInfo.info == '' || NoticeData.addInfo.title == '' ? true : false" @click="addNotice">确认添加</n-button>
        <n-button size="small" @click="NoticeData.addModal = false" class="mr05">关闭</n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>
:deep() .n-data-table-th {
  text-align: center;
}
:deep() .n-data-table-td {
  text-align: center;
}
</style>
