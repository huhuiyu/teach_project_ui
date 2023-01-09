<script setup lang="ts">
import { orderBy } from 'lodash'
import { FormInst, FormItemRule, FormRules, NButton, NDataTable, NDescriptionsItem, NForm, NFormItem, NInput, NModal, NPagination, NSelect, NSpace } from 'naive-ui'
import { ref, h, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { BaseListResult, BaseResult, PageInfo } from '../../entity/BaseResult'
import { DeptInfo, Employee } from '../../entity/DeptResult'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'

const router = useRouter()
//	需要展示的列

const columns = [
  { title: '所属部门编号', key: 'deptId' },
  { title: '员工编号', key: 'employeeId' },
  { title: '员工名称', key: 'employeeName' },
  { title: '员工手机', key: 'phone' },
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
]
const orderBy = [
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
]
const employeeData = reactive({
  loading: false,
  query: {
    deptId: '',
    employeeName: '',
    orderBy: '2',
    phone: '',
  },
  list: [] as Employee[],
  page: new PageInfo(),
})
const deptData = reactive({
  list: [{ label: '请选择部门', value: '' }],
})
const modal = reactive({
  add: false,
  modify: false,
})
function queryEmployee() {
  employeeData.loading = true
  server.post('/manage/employee/queryAll', tools.concatJson(employeeData.query, employeeData.page), (data: BaseListResult<Employee>) => {
    if (data.success) {
      employeeData.list = data.list
      employeeData.page = data.page
    }
    employeeData.loading = false
  })
}
queryEmployee()
function queryDept() {
  deptData.list = [{ label: '请选择部门', value: '' }]
  server.post('/manage/dept/queryAll', {}, (data: BaseListResult<DeptInfo>) => {
    if (data.success) {
      data.list.forEach((item) => {
        deptData.list.push({
          label: item.deptName,
          value: item.deptId + '',
        })
      })
    }
  })
}
queryDept()
function changeNumber(PageNumber: number) {
  employeeData.page.pageNumber = PageNumber
  queryEmployee()
}
function updatePageSize(pageSize: number) {
  employeeData.page.pageSize = pageSize
  employeeData.page.pageNumber = 1
  queryEmployee()
}
function reset() {
  employeeData.page.pageNumber = 1
  employeeData.query.employeeName = ''
  employeeData.query.phone = ''
  employeeData.query.deptId = ''
  queryEmployee()
}

//添加员工信息
const addEmployeeInfo = reactive({
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
      server.post('/manage/employee/add', addEmployeeInfo, (data: BaseResult) => {
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
  employeeData.loading = true
  server.post('/manage/employee/delete', { employeeId: employeeId }, (data: BaseResult) => {
    if (data.success) {
      employeeData.loading = false
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
const modifyInfo = reactive({
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
  modal.modify = true
  modifyInfo.EmployeeName = item.employeeName
  modifyInfo.phone = item.phone
  modifyInfo.employeeId = item.employeeId
  modifyInfo.deptId = item.deptId + ''
}
function modifyEmployee() {
  employeeData.loading = true
  modifyRef.value?.validate((error) => {
    if (!error) {
      server.post('/manage/employee/update', modifyInfo, (data: BaseResult) => {
        employeeData.loading = false
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
      <n-form inline :label-width="130" :model="employeeData.query" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item label="部门排序">
          <n-select v-model:value="employeeData.query.deptId" :options="deptData.list" @change="queryEmployee" placeholder="请选择部门" :consistent-menu-width="false" />
        </n-form-item>
        <n-form-item label="记录排序方式">
          <n-select v-model:value="employeeData.query.orderBy" :options="orderBy" @change="queryEmployee" />
        </n-form-item>
        <n-form-item label="员工名称模糊查询">
          <n-input v-model:value="employeeData.query.employeeName" placeholder="输入员工名称" />
        </n-form-item>
        <n-form-item label="员工电话模糊查询">
          <n-input v-model:value="employeeData.query.phone" placeholder="输入员工电话" />
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
      <n-data-table :columns="columns" :data="employeeData.list" :loading="employeeData.loading" />
      <div class="flex-box-center mr05">
        <n-pagination :item-count="employeeData.page.total" :page-size="employeeData.page.pageSize" v-model:page="employeeData.page.pageNumber" show-size-picker :page-sizes="[5, 10, 20]" @update-page="changeNumber" @update:page-size="updatePageSize" />
      </div>
    </main>
    <n-modal v-model:show="modal.add" preset="dialog">
      <template #header>
        <div>添加员工</div>
      </template>
      <n-form ref="addRef" :model="addEmployeeInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="addRules">
        <n-form-item label="部门" path="deptId">
          <n-select v-model:value="addEmployeeInfo.deptId" :options="deptData.list" />
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
          <n-select v-model:value="modifyInfo.deptId" :options="deptData.list" />
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
