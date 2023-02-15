<script setup lang="ts">
import { DataTableColumns, NButton, NDataTable, NForm, NFormItem, NInput, NModal, NSpace } from 'naive-ui'
import { reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import PageComp from '../../component/PageComp.vue'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { ListNote } from '../../entity/notepad'
import dialogApi from '../../tools/dialog'
import server from '../../tools/server'
import tools from '../../tools/tools'
const router = useRouter()
const title = '记事本'
const Loading = reactive({
  loading: false,
  infoLoading: false,
  addNoeLoading: false,
  modifyNoteLoading: false,
  delLoaidng: false,
})
const notepad = reactive({
  list: [] as ListNote[],
  page: new PageInfo(),
  delList: [] as ListNote[],
  delPage: new PageInfo(),
  query: {
    title: '',
    info: '',
  },
  info: {
    title: '',
    info: '',
  },
  add: {
    info: '',
    title: '',
  },
  modify: {
    info: '',
    title: '',
    unid: -1,
  },
})
const queryNotepad = () => {
  Loading.loading = true
  Loading.delLoaidng = false
  server.post('/user/note/queryAll', notepad.query, (data: BaseListResult<ListNote>) => {
    if (data.success) {
      Loading.loading = false
      notepad.list = data.list
      notepad.page = data.page
    }
  })
}
queryNotepad()
const notepadColumns: DataTableColumns<ListNote> = [
  { title: '标题', key: 'title' },
  {
    title: '内容',
    key: 'info',
    render(row: ListNote) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            type: 'info',
            onClick: () => {
              Loading.infoLoading = true
              notepad.info.title = row.title
              notepad.info.info = row.info
            },
          },
          {
            default: () => '查看内容',
          }
        ),
      ]
    },
  },
  {
    title: '信息修改时间',
    key: 'lastupdate',
    render(row: ListNote) {
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
    render(row: ListNote) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'warning',
            onClick: () => {
              notepad.modify.title = row.title
              notepad.modify.info = row.info
              notepad.modify.unid = row.unid
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
                title: `警告是否删除标题为${row.title}的记事本`,
                content: '删除后请到删除的记事本里面查找',
                positiveText: '删除',
                negativeText: '取消',
                onPositiveClick: () => {
                  Loading.loading = true
                  server.post('/user/note/delete', { unid: row.unid }, (data: BaseResult) => {
                    if (data.success) {
                      queryNotepad()
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
const delNotepadColumns: DataTableColumns<ListNote> = [
  { title: '标题', key: 'title' },
  {
    title: '内容',
    key: 'info',
    render(row: ListNote) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            type: 'info',
            onClick: () => {
              Loading.infoLoading = true
              notepad.info.title = row.title
              notepad.info.info = row.info
            },
          },
          {
            default: () => '查看内容',
          }
        ),
      ]
    },
  },
  {
    title: '信息修改时间',
    key: 'lastupdate',
    render(row: ListNote) {
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
const modifyNotepad = () => {
  server.post('/user/note/update', notepad.modify, (data: BaseResult) => {
    Loading.modifyNoteLoading = false
    queryNotepad()
  })
}
const reset = () => {
  notepad.query.info = ''
  notepad.query.title = ''
  queryNotepad()
}
const resetAddInfo = () => {
  Loading.addNoeLoading = false
  notepad.query.info = ''
  notepad.query.title = ''
}
const addNotepad = () => {
  server.post('/user/note/add', notepad.add, (data: BaseResult) => {
    if (data.success) {
      resetAddInfo()
      queryNotepad()
    }
  })
}
const delsQueryNotepad = () => {
  Loading.delLoaidng = !Loading.delLoaidng
  Loading.loading = true
  server.post('/user/note/queryAllDeleted', {}, (data: BaseListResult<ListNote>) => {
    Loading.loading = false
    if (data.success) {
      notepad.delList = data.list
      notepad.delPage = data.page
    }
  })
}
</script>
<template>
  <div>
    <header class="tc">
      <h2>{{ title }}</h2>
    </header>
    <main>
      <NForm inline size="medium" style="justify-content: flex-end; padding-right: 3rem">
        <NFormItem>
          <NInput placeholder="标题模糊查询" v-model:value="notepad.query.title"></NInput>
        </NFormItem>
        <NFormItem>
          <NInput placeholder="内容模糊查询" v-model:value="notepad.query.info"></NInput>
        </NFormItem>
        <NFormItem>
          <NButton type="success" dashed @click="queryNotepad">查询</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="info" dashed @click="Loading.addNoeLoading = true">添加</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="warning" dashed @click="reset">重置</NButton>
        </NFormItem>
        <NFormItem>
          <NButton v-if="!Loading.delLoaidng" type="primary" dashed @click="delsQueryNotepad">已删除</NButton>
          <NButton v-if="Loading.delLoaidng" type="primary" dashed @click="queryNotepad">未删除</NButton>
        </NFormItem>
        <NFormItem>
          <NButton type="error" dashed @click="router.back()">返回</NButton>
        </NFormItem>
      </NForm>
      <NDataTable v-if="!Loading.delLoaidng" :columns="notepadColumns" :data="notepad.list" :loading="Loading.loading" />
      <NDataTable v-else :columns="delNotepadColumns" :data="notepad.delList" :loading="Loading.loading" />
      <PageComp v-if="notepad.page.pageCount > 1 && !Loading.delLoaidng" :page="notepad.page" @number-change="queryNotepad" @size-change="queryNotepad" @page-change="queryNotepad" :show-size-picker="true"></PageComp>
      <PageComp v-if="notepad.page.pageCount > 1 && Loading.delLoaidng" :page="notepad.delList" @number-change="delsQueryNotepad" @size-change="delsQueryNotepad" @page-change="delsQueryNotepad" :show-size-picker="true"></PageComp>
      <NModal v-model:show="Loading.infoLoading" preset="dialog" :mask-closable="true" style="width: 50%">
        <template #header>
          <div>标题：{{ notepad.info.title }}</div>
        </template>
        <p style="margin: 2rem auto; text-indent: 2em; width: 75%">{{ notepad.info.info }}</p>
        <template #action>
          <NButton dashed type="error" size="small" @click="Loading.infoLoading = false">关闭</NButton>
        </template>
      </NModal>
      <NModal v-model:show="Loading.addNoeLoading" preset="dialog" :mask-closable="true" style="width: 50%">
        <template #header> 添加记事本信息 </template>
        <NForm :model="notepad.add" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
          <NFormItem label="标题">
            <NInput v-model:value="notepad.add.title" placeholder="记事本标题"></NInput>
          </NFormItem>
          <NFormItem label="内容">
            <NInput
              v-model:value="notepad.add.info"
              type="textarea"
              :autosize="{
                maxRows: 8,
                minRows: 5,
              }"
              placeholder="记事本内容"
            ></NInput>
          </NFormItem>
        </NForm>
        <template #action>
          <div>
            <NButton type="success" size="small" dashed class="mr05" @click="addNotepad">添加</NButton>
            <NButton type="error" size="small" dashed class="mr05" @click="resetAddInfo">关闭</NButton>
          </div>
        </template>
      </NModal>
      <NModal v-model:show="Loading.modifyNoteLoading" preset="dialog" :mask-closable="false" style="width: 50%">
        <template #header> 修改记事本信息 </template>
        <NForm :model="notepad.modify" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
          <NFormItem label="标题">
            <NInput v-model:value="notepad.modify.title" placeholder="记事本标题"></NInput>
          </NFormItem>
          <NFormItem label="内容">
            <NInput
              v-model:value="notepad.modify.info"
              type="textarea"
              :autosize="{
                maxRows: 8,
                minRows: 5,
              }"
              placeholder="记事本内容"
            ></NInput>
          </NFormItem>
        </NForm>
        <template #action>
          <div>
            <NButton type="success" size="small" dashed class="mr05" @click="modifyNotepad">修改</NButton>
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
