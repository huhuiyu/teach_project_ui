<script setup lang="ts">
import { FormInst, FormItemRule, FormRules, NButton, NDataTable, NDescriptionsItem, NForm, NFormItem, NInput, NModal, NPagination, NSelect, NSpace } from 'naive-ui'
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { BaseListResult, BaseResult, PageInfo } from '../../entity/BaseResult'
import { DeptInfo, Employee } from '../../entity/DeptResult'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'

const router = useRouter()
//	需要展示的列

const columns = ref([
  { title: '所属部门编号', key: 'deptId' },
  { title: '员工编号', key: 'employeeId' },
  { title: '员工名称', key: 'employeeName' },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: Employee) {
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
    render(row: Employee) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => {
              // showDept(row)
              showEmployee(row)
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
                content: `你确定${row.employeeName}`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delEmployee(row.employeeId)
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
const equery = ref({ deptId: '', employeeName: '', orderBy: '2', phone: '' })
const orderBy = ref([
  {
    value: '1',
    label: '按照编号升序',
  },
  {
    value: '2',
    label: '按照编号降序',
  },
  {
    value: '3',
    label: '按照部门名称升序',
  },
  {
    value: '4',
    label: '按照部门名称降序',
  },
  {
    value: '5',
    label: '分部门按照姓名排序',
  },
])
const elist = ref([] as Employee[])
const epage = ref(new PageInfo())
const dlist = ref([
  {
    value: '',
    label: '请选择部门',
  },
])
const modal = ref({
  add: false,
  modify: false,
})
function queryEmployee() {
  loading.value = true
  server.post('/manage/employee/queryAll', tools.concatJson(equery.value, epage.value), (data: BaseListResult<Employee>) => {
    if (data.success) {
      elist.value = data.list
      epage.value = data.page
    }
    loading.value = false
  })
}
queryEmployee()
function queryDept() {
  server.post('/manage/dept/queryAll', {}, (data: any) => {
    if (data.success) {
      data.list.forEach((item: any) => {
        dlist.value.push({
          value: item.deptId + '',
          label: item.deptName,
        })
      })
    }
  })
}
queryDept()
function changeNumber(PageNumber: number) {
  epage.value.pageNumber = PageNumber
  queryEmployee()
}
function updatePageSize(pageSize: number) {
  epage.value.pageSize = pageSize
  epage.value.pageNumber = 1
  queryEmployee()
}
function reset() {
  epage.value.pageNumber = 1
  equery.value.employeeName = ''
  queryEmployee()
}

//添加员工信息
const addEmployeeInfo = ref({
  deptId: '',
  phone: '',
  EmployeeName: '',
})
const addRef = ref<FormInst | null>(null)
const modifyRef = ref<FormInst | null>(null)
const addRules: FormRules = {
  deptId: [
    {
      required: true,
      message: '员工所在部门不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  EmployeeName: [
    {
      required: true,
      message: '员工名称不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  phone: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
        return true
      },
      message: '请输入正确手机号格式',
      trigger: ['input', 'blur'],
    },
  ],
}
function addEmployee() {
  addRef.value?.validate((error) => {
    logger.debug(error)
    if (!error) {
      server.post('/manage/employee/add', addEmployeeInfo.value, (data: BaseResult) => {
        if (data.success) {
          queryEmployee()
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
function delEmployee(employeeId: number) {
  loading.value = true
  server.post('/manage/employee/delete', { employeeId: employeeId }, (data: BaseResult) => {
    if (data.success) {
      loading.value = false
      queryEmployee()
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
  deptId: '',
  phone: '',
  EmployeeName: '',
  employeeId: 0,
})
const ModifyRules: FormRules = {
  deptId: [
    {
      required: true,
      message: '员工所在部门不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  EmployeeName: [
    {
      required: true,
      message: '员工名称不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  phone: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
        return true
      },
      message: '请输入正确手机号格式',
      trigger: ['input', 'blur'],
    },
  ],
}
function showEmployee(item: Employee) {
  modal.value.modify = true
  modifyInfo.value.EmployeeName = item.employeeName
  modifyInfo.value.phone = item.phone
  modifyInfo.value.employeeId = item.employeeId
  modifyInfo.value.deptId = item.deptId + ''
}
function modifyEmployee() {
  loading.value = true
  modifyRef.value?.validate((error) => {
    if (!error) {
      server.post('/manage/employee/update', modifyInfo.value, (data: BaseResult) => {
        loading.value = false
        if (data.success) {
          queryEmployee()
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
      <h1>员工管理</h1>
    </header>
    <main>
      <n-form inline :label-width="130" :model="equery" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item label="部门排序">
          <n-select v-model:value="equery.deptId" :options="dlist" @change="queryEmployee" />
        </n-form-item>
        <n-form-item label="记录排序方式">
          <n-select v-model:value="equery.orderBy" :options="orderBy" @change="queryEmployee" />
        </n-form-item>
        <n-form-item label="员工名称模糊查询">
          <n-input v-model:value="equery.employeeName" placeholder="输入员工名称" />
        </n-form-item>
        <n-form-item label="员工电话模糊查询">
          <n-input v-model:value="equery.phone" placeholder="输入员工电话" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryEmployee"> 查询 </n-button>
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
      <n-data-table :columns="columns" :data="elist" :loading="loading" />
      <div class="flex-box-center mr05">
        <n-pagination :item-count="epage.total" :page-size="epage.pageSize" v-model:page="epage.pageNumber" show-size-picker :page-sizes="[5, 10, 20]" @update-page="changeNumber" @update:page-size="updatePageSize" />
      </div>
    </main>
    <n-modal v-model:show="modal.add" preset="dialog">
      <template #header>
        <div>添加员工</div>
      </template>
      <n-form ref="addRef" :model="addEmployeeInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="addRules">
        <n-form-item label="部门" path="deptId">
          <n-select v-model:value="addEmployeeInfo.deptId" :options="dlist" />
        </n-form-item>
        <n-form-item label="员工名称" path="EmployeeName">
          <n-input v-model:value="addEmployeeInfo.EmployeeName" placeholder="输入员工名称" />
        </n-form-item>
        <n-form-item label="员工电话" path="phone">
          <n-input v-model:value="addEmployeeInfo.phone" placeholder="输入员工手机号" />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="addEmployee" class="mr05">添加</n-button>
          <n-button type="error" size="small" @click="modal.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="modal.modify" preset="dialog">
      <template #header>
        <div>修改员工</div>
      </template>
      <n-form ref="modifyRef" :model="modifyInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="ModifyRules">
        <n-form-item label="部门排序" path="deptId">
          <n-select v-model:value="modifyInfo.deptId" :options="dlist" />
        </n-form-item>
        <n-form-item label="员工名称" path="deptName">
          <n-input v-model:value="modifyInfo.EmployeeName" placeholder="输入员工名称" />
        </n-form-item>
        <n-form-item label="员工电话" path="phone">
          <n-input v-model:value="modifyInfo.phone" placeholder="输入员工手机号" />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="modifyEmployee()" class="mr05">修改</n-button>
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
