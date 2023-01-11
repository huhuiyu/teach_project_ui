<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NDataTable, NSpace, NModal, FormRules, FormInst, NSelect, FormItemRule } from 'naive-ui'
import { ClassInfo, StudentInfo } from '../../entity/ClassResult'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { useRouter } from 'vue-router'
import server from '../../tools/server'
import tools from '../../tools/tools'
import logger from '../../tools/logger'
import dialogApi from '../../tools/dialog'
import PageComp from '../../component/PageComp.vue'
const router = useRouter()
// 返回的数据
const StudengData = reactive({
  list: [] as StudentInfo[],
  page: new PageInfo(),
})
// 添加班级
const addStudentInfo = reactive({
  cid: '',
  address: '',
  phone: '',
  qq: '',
  sname: '',
  wechat: '',
})
const addForm = ref<FormInst | null>(null)
const addRules: FormRules = {
  sname: [
    {
      required: true,
      message: '学生姓名不能为空',
      trigger: ['input', 'blur'],
    },
  ],
  cid: [
    {
      required: true,
      message: '学生所在班级不能为空',
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
// loading
const loading = reactive({
  loading: false,
  add: false,
  modify: false,
  del: false,
})
// 查询学生
const query = reactive({
  querys: { cid: '', orderBy: '2', phone: '', qq: '', sname: '', wechat: '' },
})
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
    label: '按照班级名称升序',
  },
  {
    value: '4',
    label: '按照班级名称降序',
  },
  {
    value: '5',
    label: '分班级按照姓名排序',
  },
]

const classList = reactive({
  list: [{ label: '请选择班级', value: '' }],
})
const TdClass = reactive({
  list: [] as ClassInfo[],
})

// 表格的title
const columns = reactive([
  { title: '学生姓名', key: 'sname' },
  {
    title: '班级名称',
    key: 'cid',
    render(row: any) {
      return [
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => {
              for (let i = 0; i < TdClass.list.length; i++) {
                if (TdClass.list[i].cid == parseInt(row.cid)) {
                  return TdClass.list[i].cname
                }
              }
            },
          }
        ),
      ]
    },
  },
  { title: '电话', key: 'phone' },
  { title: '微信', key: 'wechat' },
  { title: 'QQ', key: 'qq' },
  { title: '地址', key: 'address' },
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
            onClick: () => showStudent(row),
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
                content: `你确定${row.sname}`,
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  delDept(row.sid)
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
  server.post('/manage/student/delete', { cid: cid }, (data: BaseResult) => {
    if (data.success) {
      loading.del = false
      // queryClass()
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
  sid: 0,
  cid: '',
  address: '',
  phone: '',
  qq: '',
  sname: '',
  wechat: '',
})
function showStudent(item: StudentInfo) {
  loading.modify = true
  modifyInfo.sid = item.sid
  modifyInfo.cid = item.cid + ''
  modifyInfo.address = item.address
  modifyInfo.phone = item.phone
  modifyInfo.qq = item.qq
  modifyInfo.sname = item.sname
  modifyInfo.wechat = item.wechat
}
// 查询学生
function queryStudent() {
  loading.loading = true
  StudengData.page.pageSize = 10
  StudengData.list = [] as StudentInfo[]
  server.post('/manage/student/queryAll', tools.concatJson(query.querys, StudengData.page), (data: BaseListResult<StudentInfo>) => {
    if (data.success) {
      StudengData.list = data.list
      logger.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>', StudengData.list)
      StudengData.page = data.page
    } else {
      dialogApi.notifyWarning({
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    }
    loading.loading = false
  })
}
queryClassSelect()
queryStudent()
function queryClassSelect() {
  classList.list = [{ label: '请选择班级', value: '' }]
  StudengData.page.pageSize = 100
  server.post('/manage/class/queryAll', {}, (data: BaseListResult<ClassInfo>) => {
    if (data.success == true) {
      logger.debug('-------------------------------false')
      TdClass.list = data.list
      data.list.forEach((item) => {
        classList.list.push({
          label: item.cname,
          value: item.cid + '',
        })
      })
    } else {
      dialogApi.notifyWarning({
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    }
    logger.debug('++++++++++=', classList.list)
  })
}
// 重置
function reset() {
  query.querys.cid = ''
  query.querys.phone = ''
  query.querys.qq = ''
  query.querys.sname = ''
  query.querys.wechat = ''
  queryStudent()
}

// 添加班级
function showAdd() {
  loading.add = true
  addStudentInfo.cid = ''
}
function addStudent() {
  addForm.value?.validate((error) => {
    if (!error) {
      loading.add = true
      server.post('/manage/student/add', addStudentInfo, (data: BaseResult) => {
        if (data.success) {
          queryStudent()
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
      server.post('/manage/student/update', modifyInfo, (data: BaseResult) => {
        if (data.success) {
          queryStudent()
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
  <header> <h1>学生管理</h1> </header>
  <main>
    <n-form inline :label-width="80" :model="query.querys" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
      <n-form-item label="选择班级"> <n-select v-model:value="query.querys.cid" :options="classList.list" @change="queryStudent()" placeholder="请选择班级" :consistent-menu-width="false" /> </n-form-item>
      <n-form-item label="记录排序方式"><n-select v-model:value="query.querys.orderBy" :options="orderBy" @change="queryStudent()" /></n-form-item>
      <n-form-item label="学生姓名">
        <n-input v-model:value="query.querys.sname" placeholder="输入学生姓名"> </n-input>
      </n-form-item>
      <n-form-item label="学生电话">
        <n-input v-model:value="query.querys.phone" placeholder="学生电话"> </n-input>
      </n-form-item>
      <n-form-item label="学生微信">
        <n-input v-model:value="query.querys.wechat" placeholder="学生微信"> </n-input>
      </n-form-item>
      <n-form-item label="学生QQ">
        <n-input v-model:value="query.querys.qq" placeholder="学生QQ"> </n-input>
      </n-form-item>
    </n-form>
    <div style="display: flex; justify-content: flex-end">
      <n-button attr-type="button" class="mr05" @click="queryStudent()"> 查询 </n-button>
      <n-button attr-type="button" class="mr05" @click="reset()">重置</n-button>
      <n-button attr-type="button" class="mr05" @click="showAdd()">添加</n-button>
      <n-button attr-type="button" class="mr05" @click="router.back()">返回</n-button>
    </div>
    <n-data-table :columns="columns" :data="StudengData.list" :loading="loading.loading" striped />
    <PageComp @page-change="queryStudent()" :page="StudengData.page"></PageComp>
    <n-modal v-model:show="loading.add" preset="dialog" style="width: 50%">
      <template #header> 添加班级 </template>
      <n-form ref="addForm" :rules="addRules" :model="addStudentInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
        <n-form-item label="学生姓名" path="sname">
          <n-input v-model:value="addStudentInfo.sname" placeholder="输入班级名称"></n-input>
        </n-form-item>
        <n-form-item label="所属班级班级" path="cid">
          <n-select v-model:value="addStudentInfo.cid" :options="classList.list" />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="addStudentInfo.phone" placeholder="请输入手机号"></n-input>
        </n-form-item>
        <n-form-item label="微信" path="wechat">
          <n-input v-model:value="addStudentInfo.wechat" placeholder="请输入微信"></n-input>
        </n-form-item>
        <n-form-item label="qq" path="qq">
          <n-input v-model:value="addStudentInfo.qq" placeholder="请输入qq"></n-input>
        </n-form-item>
        <n-form-item label="家庭住址" path="address">
          <n-input v-model:value="addStudentInfo.address" placeholder="请输入家庭住址"></n-input>
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="addStudent()" class="mr05">添加学生</n-button>
          <n-button type="error" size="small" @click="loading.add = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal v-model:show="loading.modify" preset="dialog">
      <template #header> 修改班级 </template>
      <n-form ref="modifyForm" :rules="addRules" :model="modifyInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
        <n-form-item label="学生姓名" path="sname">
          <n-input v-model:value="modifyInfo.sname" placeholder="输入班级名称"></n-input>
        </n-form-item>
        <n-form-item label="所属班级班级" path="cid">
          <n-select v-model:value="modifyInfo.cid" :options="classList.list" />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="modifyInfo.phone" placeholder="请输入手机号"></n-input>
        </n-form-item>
        <n-form-item label="微信" path="wechat">
          <n-input v-model:value="modifyInfo.wechat" placeholder="请输入微信"></n-input>
        </n-form-item>
        <n-form-item label="qq" path="qq">
          <n-input v-model:value="modifyInfo.qq" placeholder="请输入qq"></n-input>
        </n-form-item>
        <n-form-item label="家庭住址" path="address">
          <n-input v-model:value="modifyInfo.address" placeholder="请输入家庭住址"></n-input>
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="modifyClass()" class="mr05">修改学生</n-button>
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
