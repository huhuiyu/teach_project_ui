<script setup lang="ts">
import { FormInst, FormRules, NButton, NDataTable, NForm, NFormItem, NInput, NModal, NPagination, NSpace, NSpin } from 'naive-ui'
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { BaseDataResult, BaseListResult, BaseResult, PageInfo } from '../../entity/BaseResult'
import { DeptInfo } from '../../entity/DeptResult'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'

const router = useRouter()
//	需要展示的列
const columns = ref([
  { title: '部门编号', key: 'deptName' },
  { title: '部门信息', key: 'deptInfo' },
  { title: '部门名称', key: 'deptName' },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: DeptInfo) {
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
    render(row: DeptInfo) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => {
              showDept(row)
            },
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
              dialog.showWarning({
                title: '警告',
                content: `你确定${row.deptName}`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delDept(row.deptId)
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

const loading = ref(false)
const dquery = ref({ deptName: '' })
const dlist = ref([] as DeptInfo[])
const dpage = ref(new PageInfo())
const modal = ref({
  add: false,
  modify: false,
})
function queryDept() {
  loading.value = true
  server.post('/manage/dept/queryAll', tools.concatJson(dquery.value, dpage.value), (data: BaseListResult<DeptInfo>) => {
    if (data.success) {
      dlist.value = data.list
      dpage.value = data.page
    }
    loading.value = false
  })
}
queryDept()
function changeNumber(PageNumber: number) {
  dpage.value.pageNumber = PageNumber
  queryDept()
}
function updatePageSize(pageSize: number) {
  dpage.value.pageSize = pageSize
  dpage.value.pageNumber = 1
  queryDept()
}
function reset() {
  dpage.value.pageNumber = 1
  dquery.value.deptName = ''
  queryDept()
}

//添加部门信息
const addDeptInfo = ref({
  deptInfo: '',
  deptName: '',
})
const addRef = ref<FormInst | null>(null)
const modifyRef = ref<FormInst | null>(null)
const addRules: FormRules = {
  deptInfo: [
    {
      required: true,
      message: '部门描述不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  deptName: [
    {
      required: true,
      message: '部门名称不能为空',
      trigger: ['input', 'blur'],
    },
  ],
}
function addDept() {
  addRef.value?.validate((error) => {
    if (!error) {
      server.post('/manage/dept/add', addDeptInfo.value, (data: BaseResult) => {
        if (data.success) {
          queryDept()
          dialog.notifyInfo({
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        } else {
          dialog.notifyWarning({
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        }
      })
    }
  })
}
function delDept(deptId: number) {
  loading.value = true
  server.post('/manage/dept/delete', { deptId: deptId }, (data: BaseResult) => {
    if (data.success) {
      loading.value = false
      queryDept()
      dialog.notifyInfo({
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    } else {
      dialog.notifyWarning({
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    }
  })
}
const modifyInfo = ref({
  deptId: 0,
  deptInfo: '',
  deptName: '',
})
const ModifyRules: FormRules = {
  deptInfo: [
    {
      required: true,
      message: '部门描述不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  deptName: [
    {
      required: true,
      message: '部门名称不能为空',
      trigger: ['input', 'blur'],
    },
  ],
}
function showDept(item: DeptInfo) {
  modal.value.modify = true
  modifyInfo.value.deptId = item.deptId
  modifyInfo.value.deptInfo = item.deptInfo
  modifyInfo.value.deptName = item.deptName
}
function modifyDept() {
  loading.value = true
  modifyRef.value?.validate((error) => {
    if (!error) {
      server.post('/manage/dept/update', modifyInfo.value, (data: BaseResult) => {
        loading.value = false
        if (data.success) {
          queryDept()
          dialog.notifyInfo({
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        } else {
          dialog.notifyWarning({
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
  <div>
    <header>
      <h1>部门管理</h1>
    </header>
    <main>
      <n-form inline :label-width="80" :model="dquery" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item label="部门名称">
          <n-input v-model:value="dquery.deptName" placeholder="输入部门名称" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryDept"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="modal.add = true"> 添加 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="columns" :data="dlist" :loading="loading" />
      <div class="flex-box-center mr05">
        <n-pagination :item-count="dpage.total" :page-size="dpage.pageSize" v-model:page="dpage.pageNumber" show-size-picker :page-sizes="[5, 10, 20]" @update-page="changeNumber" @update:page-size="updatePageSize" />
      </div>
    </main>
    <n-modal v-model:show="modal.add" preset="dialog">
      <template #header>
        <div>添加部门</div>
      </template>
      <n-form ref="addRef" :model="addDeptInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="addRules">
        <n-form-item label="部门名称" path="deptName">
          <n-input v-model:value="addDeptInfo.deptName" placeholder="输入部门名称" />
        </n-form-item>
        <n-form-item label="部门描述" path="deptInfo">
          <n-input v-model:value="addDeptInfo.deptInfo" placeholder="输入部门描述" />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="addDept" class="mr05">添加</n-button>
          <n-button type="error" size="small" @click="modal.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="modal.modify" preset="dialog">
      <template #header>
        <div>修改部门</div>
      </template>
      <n-form ref="modifyRef" :model="modifyInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="ModifyRules">
        <n-form-item label="部门名称" path="deptName">
          <n-input v-model:value="modifyInfo.deptName" placeholder="输入部门名称" />
        </n-form-item>
        <n-form-item label="部门描述" path="deptInfo">
          <n-input v-model:value="modifyInfo.deptInfo" placeholder="输入部门描述" />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="modifyDept()" class="mr05">修改</n-button>
          <n-button type="error" size="small" @click="modal.modify = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
  </div>
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
