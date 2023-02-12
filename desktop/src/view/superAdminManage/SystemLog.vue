<script setup lang="ts" name="SystemLog">
import { NButton, NDataTable, NForm, NFormItem, NInput, NSpace } from 'naive-ui'
import { reactive, h } from 'vue'
import PageComp from '../../component/PageComp.vue'
import { LogInfo } from '../../entity/AdminInfo'
import { BaseListResult, PageInfo } from '../../entity/BaseResult'
import server from '../../tools/server'
import tools from '../../tools/tools'
import { useRouter } from 'vue-router'
const router = useRouter()
//系统日志需要展示的列
const columns = reactive([
  { title: '主键', key: 'lid' },
  { title: '日志内容', key: 'logInfo' },
  { title: '日志类型', key: 'logType' },
  {
    title: '信息最后修改时间',
    key: 'lastupdate',
    titleColSpan: 1,
    render(row: LogInfo) {
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
])
const logData = reactive({
  queryInfo: {
    logInfo: '',
    logType: '',
  },
  loading: false,
  page: new PageInfo(),
  list: [] as LogInfo[],
})
const queryAll = () => {
  logData.loading = true
  server.post('/admin/log/query', tools.concatJson(logData.queryInfo, logData.page), (data: BaseListResult<LogInfo>) => {
    logData.loading = false
    if (data.success) {
      logData.page = data.page
      logData.list = data.list
    }
  })
}
queryAll()
const reset = () => {
  logData.page.pageNumber = 1
  logData.queryInfo.logInfo = ''
  logData.queryInfo.logType = ''
  queryAll()
}
const queryLog = () => {
  logData.page.pageNumber = 1
  queryAll()
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>系统日志管理</h1>
    </header>
    <main>
      <n-form inline  :model="logData.queryInfo" size="medium" label-placement="left" style="justify-content: flex-end; padding-right: 3rem">
        <n-form-item>
          <n-input v-model:value="logData.queryInfo.logInfo" placeholder="输入日志内容" clearable />
        </n-form-item>
        <n-form-item>
          <n-input v-model:value="logData.queryInfo.logType" placeholder="输入日志类型" clearable />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryLog"> 查询 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="reset"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="router.back()"> 返回 </n-button>
        </n-form-item>
      </n-form>
      <n-data-table :columns="columns" :data="logData.list" :loading="logData.loading" />
      <div v-if="logData.page.pageCount > 1">
        <PageComp :page="logData.page" :show-size-picker="true" @number-change="queryAll" @size-change="queryAll" @page-change="queryAll"></PageComp>
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
