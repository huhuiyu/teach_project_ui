<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NDataTable, NSpace, NModal, FormRules, FormInst } from 'naive-ui'
import { ClassInfo } from '../../entity/ClassResult'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { useRouter } from 'vue-router'
import server from '../../tools/server'
import tools from '../../tools/tools'
import dialogApi from '../../tools/dialog'
import PageComp from '../../component/PageComp.vue'
const router = useRouter()
// 返回的数据
const ClassData = reactive({
  list: [] as ClassInfo[],
  page: new PageInfo(),
})
// 添加班级
const addClassInfo = reactive({
  cname: '',
  cinfo: '',
})
const addRules: FormRules = {
  cname: [
    {
      required: true,
      message: '班级名称不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  cinfo: [
    {
      required: true,
      message: '班级描述不能为空',
      trigger: ['input', 'blur'],
    },
  ],
}
// loading
const loading = reactive({
  loading: false,
  add: false,
  modify: false,
  del: false,
})
// 查询班级
const query = reactive({
  querys: {
    cname: '',
  },
})
// 表格的title
const columns = reactive([
  { title: '班级名称', key: 'cname' },
  { title: '班级信息', key: 'cinfo' },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    render(row: any) {
      return [h(NSpace, { justify: 'center' }, { default: () => tools.formatDate(parseInt(row.lastupdate)) })]
    },
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => showClass(row),
          },
          { default: () => '修改' }
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => {
              dialogApi.showWarning({
                title: '警告',
                content: `你确定${row.cname}`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delDept(row.cid)
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
// 删除班级
function delDept(cid: number) {
  loading.del = true
  server.post('/manage/class/delete', { cid: cid }, (data: BaseResult) => {
    if (data.success) {
      loading.del = false
      queryClass()
      dialogApi.notifyInfo({
        title: '成功',
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    } else {
      dialogApi.notifyWarning({
        title: '失败',
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    }
  })
}
// 修改班级
const modifyInfo = reactive({
  cid: 0,
  cname: '',
  cinfo: '',
})
function showClass(item: ClassInfo) {
  loading.modify = true
  modifyInfo.cid = item.cid
  modifyInfo.cinfo = item.cinfo
  modifyInfo.cname = item.cname
}
// 查询班级
function queryClass() {
  loading.loading = true
  server.post('/manage/class/queryAll', tools.concatJson(query.querys, ClassData.page), (data: BaseListResult<ClassInfo>) => {
    if (data.success) {
      ClassData.list = data.list
      ClassData.page = data.page
    }
    loading.loading = false
  })
}
queryClass()
// 重置
function reset() {
  query.querys.cname = ''
  ClassData.page.pageNumber = 1
  queryClass()
}
const addForm = ref<FormInst | null>(null)
// 添加班级
function addClass() {
  addForm.value?.validate((error) => {
    if (!error) {
      loading.add = true
      server.post('/manage/class/add', addClassInfo, (data: BaseResult) => {
        if (data.success) {
          queryClass()
          dialogApi.notifyInfo({
            title: '成功',
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        } else {
          dialogApi.notifyWarning({
            title: '失败',
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        }
      })
    }
  })
}
const modifyForm = ref<FormInst | null>(null)
// 修改班级
function modifyClass() {
  modifyForm.value?.validate((error) => {
    if (!error) {
      server.post('/manage/class/update', modifyInfo, (data: BaseResult) => {
        if (data.success) {
          queryClass()
          dialogApi.notifyInfo({
            title: '成功',
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        } else {
          dialogApi.notifyWarning({
            title: '失败',
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        }
      })
    }
  })
}
</script>
<template>
  <header> <h1>班级管理</h1> </header>
  <main>
    <n-form inline :label-width="80" :model="query.querys" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
      <n-form-item label="班级名称">
        <n-input v-model:value="query.querys.cname" placeholder="输入班级名称"> </n-input>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="queryClass()"> 查询 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="reset()">重置</n-button>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="loading.add = true">添加</n-button>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="router.back()">返回</n-button>
      </n-form-item>
    </n-form>
    <n-data-table :columns="columns" :data="ClassData.list" :loading="loading.loading" striped />
    <div v-if="ClassData.page.pageCount > 1">
      <PageComp @page-change="queryClass" @number-change="queryClass" @size-change="queryClass" :page="ClassData.page"></PageComp>
    </div>
    <n-modal v-model:show="loading.add" preset="dialog">
      <template #header> 添加班级 </template>
      <n-form ref="addForm" :rules="addRules" :model="addClassInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
        <n-form-item label="班级名称" path="cname">
          <n-input v-model:value="addClassInfo.cname" placeholder="输入班级名称"></n-input>
        </n-form-item>
        <n-form-item label="班级描述" path="cinfo">
          <n-input v-model:value="addClassInfo.cinfo" placeholder="输入班级描述"></n-input>
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="addClass()" class="mr05">添加</n-button>
          <n-button type="error" size="small" @click="loading.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="loading.modify" preset="dialog">
      <template #header> 修改班级 </template>
      <n-form ref="modifyForm" :rules="addRules" :model="modifyInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
        <n-form-item label="班级名称" path="cname">
          <n-input v-model:value="modifyInfo.cname" placeholder="输入班级名称"></n-input>
        </n-form-item>
        <n-form-item label="班级描述" path="cinfo">
          <n-input v-model:value="modifyInfo.cinfo" placeholder="输入班级描述"></n-input>
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="modifyClass()" class="mr05">修改</n-button>
          <n-button type="error" size="small" @click="loading.modify = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
  </main>
</template>
<style scoped>
header {
  text-align: center;
  height: 5vh;
}
:deep() .n-data-table-th {
  text-align: center;
}
:deep() .n-data-table-td {
  text-align: center;
}
</style>
