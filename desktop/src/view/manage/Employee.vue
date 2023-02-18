<script setup lang="ts">
import { FormInst, FormItemRule, FormRules, NButton, NDataTable, NForm, NFormItem, NInput, NModal, NPagination, NSelect, NSpace, NPopconfirm } from 'naive-ui'
import { ref, h, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PageComp from '../../component/PageComp.vue'
import { BaseListResult, BaseResult, PageInfo } from '../../entity/BaseResult'
import { DeptInfo, Employee } from '../../entity/DeptResult'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server, { serverInfo } from '../../tools/server'
import tools from '../../tools/tools'

const router = useRouter()
//	需要展示的列

const columns = [
  {
    title: '部门名称',
    key: 'deptName',
    titleColSpan: 1,
    render(row: Employee) {
      return [
        h(
          NSpace,
          {
            justify: 'center',
          },
          { default: () => row.dept.deptName }
        ),
      ]
    },
  },
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
const deptColumns = reactive([
  { title: '部门编号', key: 'deptId' },
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
              if (!modal.add && !modal.modify) {
                employeeData.query.deptId = row.deptId + ''
                employeeData.query.deptName = row.deptName
                queryEmployee()
                modal.dept = false
              } else if (modal.add) {
                addEmployeeInfo.deptId = row.deptId + ''
                addEmployeeInfo.deptName = row.deptName + ''
                modal.dept = false
              } else if (modal.modify) {
                modifyInfo.deptId = row.deptId + ''
                modifyInfo.deptName = row.deptName + ''
                modal.dept = false
              }
            },
          },
          { default: () => '选择此部门' }
        ),
      ]
    },
  },
])

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
    deptName: '',
  },
  list: [] as Employee[],
  page: new PageInfo(),
  exportLoading: false,
})
const deptData = reactive({
  list: [] as DeptInfo[],
  queryInfo: {
    deptName: '',
  },
  page: new PageInfo(),
  loading: false,
})
const modal = reactive({
  add: false,
  modify: false,
  dept: false,
})
function queryEmployee() {
  employeeData.loading = true
  server.post('/manage/employee/queryAll', tools.concatJson(employeeData.query, employeeData.page), (data: BaseListResult<Employee>) => {
    employeeData.loading = false
    if (data.success) {
      employeeData.list = data.list
      employeeData.page = data.page
    }
  })
}
queryEmployee()
function queryDept() {
  deptData.page.pageSize = 5
  deptData.loading = true
  server.post('/manage/dept/queryAll', tools.concatJson(deptData.queryInfo, deptData.page), (data: BaseListResult<DeptInfo>) => {
    if (data.success) {
      deptData.loading = false
      deptData.list = data.list
      deptData.page = data.page
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
  employeeData.query.deptName = ''
  queryEmployee()
}

//添加员工信息
const addEmployeeInfo = reactive({
  deptId: '',
  phone: '',
  EmployeeName: '',
  deptName: '',
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
        if (!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
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
  deptName: '',
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
        if (!/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
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
  modifyInfo.deptName = item.dept.deptName + ''
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
function exportEmployee() {
  let params = JSON.parse(JSON.stringify(employeeData.query))
  delete params.deptName
  let paramsArray: any[] = []
  let url = serverInfo.url + '/manage/employee/exportExcel'
  Object.keys(params).forEach((key) => {
    if (params[key] != '') {
      paramsArray.push(key + '=' + params[key])
    }
  })
  if (url.search(/\?/) === -1) {
    url += '?' + paramsArray.join('&')
  } else {
    url += '&' + paramsArray.join('&')
  }
  logger.debug(url)
  logger.debug(params)
  window.open(url)
}
</script>
<template>
  <div>
    <header>
      <h1>员工管理</h1>
    </header>
    <main>
      <n-form inline :model="employeeData.query" size="medium" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-button attr-type="button" @click="modal.dept = true"> {{ employeeData.query.deptName == '' ? '选择部门' : `当前选择的部门：${employeeData.query.deptName}` }} </n-button>
        </n-form-item>
        <n-form-item>
          <n-select v-model:value="employeeData.query.orderBy" :options="orderBy" :consistent-menu-width="false" />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="employeeData.query.employeeName" placeholder="请输入员工名称" />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="employeeData.query.phone" placeholder="请输入员工电话" />
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
          <n-popconfirm @positive-click="exportEmployee" @negative-click="dialog.messageInfo('已取消')" negative-text="取消" positive-text="确定">
            <template #trigger>
              <n-button attr-type="button">导出为Excel </n-button>
            </template>
            确认要导出当前所查询到的员工表吗
          </n-popconfirm>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="columns" :data="employeeData.list" :loading="employeeData.loading" />
      <div class="flex-box-center mr05" v-if="employeeData.page.pageCount > 1">
        <n-pagination :item-count="employeeData.page.total" :page-size="employeeData.page.pageSize" v-model:page="employeeData.page.pageNumber" show-size-picker :page-sizes="[5, 10, 20]" @update-page="changeNumber" @update:page-size="updatePageSize" />
      </div>
    </main>
    <n-modal v-model:show="modal.add" preset="dialog">
      <template #header>
        <div>添加员工</div>
      </template>
      <n-form ref="addRef" :model="addEmployeeInfo" label-placement="left" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="addRules">
        <n-form-item path="deptId">
          <n-button attr-type="button" @click="modal.dept = true"> {{ addEmployeeInfo.deptName == '' ? '选择部门' : `当前选择的部门：${addEmployeeInfo.deptName}` }} </n-button>
        </n-form-item>
        <n-form-item path="EmployeeName">
          <n-input v-model:value="addEmployeeInfo.EmployeeName" placeholder="输入员工名称" />
        </n-form-item>
        <n-form-item path="phone">
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
      <n-form ref="modifyRef" label-placement="left" :model="modifyInfo" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="ModifyRules">
        <n-form-item path="deptId">
          <n-button attr-type="button" @click="modal.dept = true"> {{ modifyInfo.deptName == '' ? '选择部门' : `当前选择的部门：${modifyInfo.deptName}` }} </n-button>
        </n-form-item>
        <n-form-item path="deptName">
          <n-input v-model:value="modifyInfo.EmployeeName" placeholder="输入员工名称" />
        </n-form-item>
        <n-form-item path="phone">
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
    <n-modal v-model:show="modal.dept" preset="dialog" style="width: 50vw">
      <template #header>
        <div>选择部门</div>
      </template>
      <n-form inline require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="ModifyRules">
        <n-form-item>
          <n-input v-model:value="deptData.queryInfo.deptName" placeholder="输入部门名称" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryDept"> 查询 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="deptColumns" :data="deptData.list" :loading="deptData.loading" />
      <div v-if="deptData.page.pageCount > 1">
        <PageComp :page="deptData.page" :show-size-picker="true" @number-change="queryDept" @size-change="queryDept" @page-change="queryDept"></PageComp>
      </div>
      <template #action>
        <div>
          <n-button type="error" size="small" @click="modal.dept = false" class="mr05">关闭</n-button>
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
