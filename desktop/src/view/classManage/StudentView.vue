<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NDataTable, NSpace, NModal, FormRules, FormInst, NSelect, FormItemRule, DataTableColumns, c } from 'naive-ui'
import { ClassInfo, StudentInfo } from '../../entity/ClassResult'
import BaseResult, { BaseListResult, PageInfo } from '../../entity/BaseResult'
import { useRouter } from 'vue-router'
import server from '../../tools/server'
import tools from '../../tools/tools'
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
  classname: '',
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
  wechat: [
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
  qq: [
    {
      required: false,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^\s*[.0-9]{5,11}\s*$/.test(value)) return new Error('请输入正确QQ号格式')
        return true
      },
      message: '请输入正确QQ号格式',
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
  class: false,
  addclass: false,
  modifyclass: false,
})
// 查询学生
const query = reactive({
  querys: { cid: '', orderBy: '2', phone: '', qq: '', sname: '', wechat: '', classname: '' },
})
// 排序方式
const orderBy = [
  { value: '1', label: '按照编号升序' },
  { value: '2', label: '按照编号降序' },
  { value: '3', label: '按照班级名称升序' },
  { value: '4', label: '按照班级名称降序' },
  { value: '5', label: '分班级按照姓名排序' },
]

const TdClass = reactive({
  list: [] as ClassInfo[],
  page: new PageInfo(),
})

// 学生表格的title
const Studentcolumns: DataTableColumns<any> = [
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
                if (TdClass.list[i].cid == row.cid) return TdClass.list[i].cname
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
            type: 'info',
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
            type: 'warning',
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => {
              dialogApi.showWarning({
                title: '警告',
                content: `你确定${row.sname}学生`,
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
]
// 班级表格的title
const ClassColumns: DataTableColumns<ClassInfo> = [
  { title: '班级名称', key: 'cname' },
  {
    title: '时间',
    key: 'lastupdate',
    render(row: ClassInfo) {
      return [h(NSpace, { justify: 'center' }, { default: () => tools.formatDate(row.lastupdate) })]
    },
  },
  {
    title: '操作',
    key: 'actions',
    render(row: ClassInfo) {
      return [
        h(
          NButton,
          {
            type: 'info',
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => {
              TdClass.list.filter((item) => {
                if (item.cid == row.cid) {
                  if (loading.addclass == true) {
                    addStudentInfo.cid = item.cid + ''
                    return (addStudentInfo.classname = item.cname)
                  }
                  if (loading.modifyclass == true) {
                    modifyInfo.cid = item.cid + ''
                    return (modifyInfo.classname = item.cname)
                  }
                  if (loading.modifyclass == false && loading.addclass == false) {
                    query.querys.cid = item.cid + ''
                    return (query.querys.classname = item.cname)
                  }
                }
                loading.class = false
              })
            },
          },
          {
            default: () => '选择',
          }
        ),
      ]
    },
  },
]
// 删除班级
const delDept = (sid: number) => {
  loading.del = true
  server.post('/manage/student/delete', { sid: sid }, (data: BaseResult) => {
    if (data.success) {
      loading.del = false
      queryStudent()
      dialogApi.notifyInfo({
        title: '成功',
        content: data.message,
        duration: 2000,
        keepAliveOnHover: true,
      })
    }
  })
}
// 修改班级
const modifyInfo = reactive({
  sid: '',
  cid: '',
  address: '',
  phone: '',
  qq: '',
  sname: '',
  wechat: '',
  classname: '',
})
// 显示
const showStudent = (item: StudentInfo) => {
  loading.modify = true
  modifyInfo.sid = item.sid + ''
  modifyInfo.cid = item.cid + ''
  modifyInfo.address = item.address
  modifyInfo.phone = item.phone
  modifyInfo.qq = item.qq
  modifyInfo.sname = item.sname
  modifyInfo.wechat = item.wechat
  modifyInfo.classname = item.tbClass.cname
}
// 查询学生
const queryStudent = () => {
  loading.loading = true
  StudengData.page.pageSize = 10
  StudengData.list = [] as StudentInfo[]
  server.post('/manage/student/queryAll', tools.concatJson(query.querys, StudengData.page), (data: BaseListResult<StudentInfo>) => {
    loading.loading = false
    if (data.success) {
      StudengData.list = data.list
      StudengData.page = data.page
    }
  })
}

queryStudent()
const queryClassSelect = () => {
  server.post('/manage/class/queryAll', {}, (data: BaseListResult<ClassInfo>) => {
    if (data.success == true) {
      TdClass.list = data.list
      TdClass.page = data.page
    }
  })
}
queryClassSelect()
// 重置
const reset = () => {
  query.querys.cid = ''
  query.querys.phone = ''
  query.querys.qq = ''
  query.querys.sname = ''
  query.querys.wechat = ''
  query.querys.classname = ''
  queryStudent()
}
const addreset = () => {
  loading.addclass = false
  loading.add = false
  addStudentInfo.cid = ''
  addStudentInfo.address = ''
  addStudentInfo.phone = ''
  addStudentInfo.qq = ''
  addStudentInfo.address = ''
  addStudentInfo.sname = ''
  addStudentInfo.wechat = ''
  addStudentInfo.classname = ''
}
const modifyreset = () => {
  loading.modifyclass = false
  loading.modify = false
  modifyInfo.sid = ''
  modifyInfo.cid = ''
  modifyInfo.qq = ''
  modifyInfo.address = ''
  modifyInfo.phone = ''
  modifyInfo.sname = ''
  modifyInfo.wechat = ''
  modifyInfo.classname = ''
}
// 添加学生
const addStudent = () => {
  addForm.value?.validate((error) => {
    server.post('/manage/student/add', addStudentInfo, (data: BaseResult) => {
      loading.addclass = false
      if (data.success) {
        addreset()
        queryStudent()
        loading.add = true
        dialogApi.notifyInfo({
          title: '成功',
          content: data.message,
          duration: 2000,
          keepAliveOnHover: true,
        })
      }
    })
  })
}
const modifyForm = ref<FormInst | null>(null)
// 修改学生
const modifyStudent = () => {
  modifyForm.value?.validate((error) => {
    if (!error) {
      server.post('/manage/student/update', modifyInfo, (data: BaseResult) => {
        if (data.success) {
          modifyreset()
          queryStudent()
          dialogApi.notifyInfo({
            title: '成功',
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
        }
      })
    }
  })
}
// 查询时弹出选择班级
const addClassDiaong = () => {
  loading.class = true
  loading.addclass = true
}
const modifyClassDiaong = () => {
  loading.class = true
  loading.modifyclass = true
}
</script>
<template>
  <header>
    <h1>学生管理</h1>
  </header>
  <main>
    <n-form inline :model="query.querys" size="medium" style="justify-content: flex-end; padding-right: 3rem">
      <n-form-item>
        <n-button @click="loading.class = true">{{ query.querys.classname == '' ? '选择班级' : `当前选择的班级：${query.querys.classname}` }}</n-button>
      </n-form-item>
      <n-form-item>
        <n-select v-model:value="query.querys.orderBy" :options="orderBy" @update:value="queryStudent" :consistent-menu-width="false" />
      </n-form-item>
      <n-form-item>
        <n-input v-model:value="query.querys.sname" placeholder="输入学生姓名" />
      </n-form-item>
      <n-form-item>
        <n-input v-model:value="query.querys.phone" placeholder="学生电话" />
      </n-form-item>
      <n-form-item>
        <n-input v-model:value="query.querys.wechat" placeholder="学生微信" />
      </n-form-item>
      <n-form-item>
        <n-input v-model:value="query.querys.qq" placeholder="学生QQ" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="queryStudent()"> 查询 </n-button>
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
    <n-data-table :columns="Studentcolumns" :data="StudengData.list" :loading="loading.loading" striped />
    <div v-if="StudengData.page.pageCount > 1">
      <PageComp @page-change="queryStudent" @number-change="queryStudent" @size-change="queryStudent" :page="StudengData.page"></PageComp>
    </div>
  </main>
  <n-modal v-model:show="loading.add" preset="dialog" style="width: 50%">
    <template #header> 添加班级 </template>
    <n-form ref="addForm" :rules="addRules" :model="addStudentInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '700px' }">
      <n-form-item label="学生姓名" path="sname">
        <n-input v-model:value="addStudentInfo.sname" placeholder="输入班级名称"></n-input>
      </n-form-item>
      <n-form-item label="所属班级班级" path="cid">
        <NButton @click="addClassDiaong()">{{ addStudentInfo.classname == '' ? '请选择班级' : `选择的班级是${addStudentInfo.classname}` }}</NButton>
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
        <n-button type="error" size="small" @click="addreset()" class="mr05">关闭</n-button>
      </div>
    </template>
  </n-modal>
  <n-modal v-model:show="loading.modify" preset="dialog" style="width: 50%">
    <template #header> 修改班级 </template>
    <n-form ref="modifyForm" :rules="addRules" :model="modifyInfo" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
      <n-form-item label="学生姓名" path="sname">
        <n-input v-model:value="modifyInfo.sname" placeholder="输入班级名称"></n-input>
      </n-form-item>
      <n-form-item label="所属班级班级" path="cid">
        <NButton @click="modifyClassDiaong()">{{ modifyInfo.classname == '' ? '请选择班级' : `当前所在选择的班级是:${modifyInfo.classname}` }}</NButton>
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
        <n-button type="success" size="small" @click="modifyStudent" class="mr05">修改学生</n-button>
        <n-button type="error" size="small" @click="modifyreset" class="mr05">关闭</n-button>
      </div>
    </template>
  </n-modal>
  <n-modal v-model:show="loading.class" preset="dialog" style="width: 50%">
    <n-data-table :columns="ClassColumns" :data="TdClass.list" :loading="!loading.class"> </n-data-table>
    <div v-if="TdClass.page.pageCount > 1">
      <PageComp :page="TdClass.page" :show-size-picker="true" @number-change="queryClassSelect" @size-change="queryClassSelect" @page-change="queryClassSelect"></PageComp>
    </div>
  </n-modal>
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
