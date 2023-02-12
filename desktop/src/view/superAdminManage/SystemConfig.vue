<script setup lang="ts" name="SystemSystem">
import { NButton, NNumberAnimation, NCard, NList, NListItem, NThing, NInput, NGrid, NGi, NSpace, NSkeleton } from 'naive-ui'
import { reactive } from 'vue'
import { SystemConfig } from '../../entity/AdminInfo'
import BaseResult, { BaseDataResult } from '../../entity/BaseResult'
import server from '../../tools/server'
import { useRouter } from 'vue-router'
import dialogApi from '../../tools/dialog'
const router = useRouter()
//系统日志需要展示的列
const columns = reactive([
  { title: '图片校验码干扰线数量', key: 'imageCodeAmount', modify: false },
  { title: '图片校验码长度', key: 'imageCodeLength', modify: false },
  { title: '图片校验码过期时间（秒）', key: 'imageCodeTimeout', modify: false },
  { title: 'ip锁定时间（秒）', key: 'ipBanTimeout', modify: false },
  { title: '同一个ip最大新token数量限制', key: 'ipMaxTokenCount', modify: false },
  { title: '登录密码最大错误次数', key: 'loginPasswordErrorLimit', modify: false },
  { title: '密码错误锁定时间（秒）', key: 'loginPasswordErrorTimeout', modify: false },
  { title: '邮箱验证码过期时间（秒）', key: 'mailCodeTimeout', modify: false },
  { title: '电话验证码过期时间（秒）', key: 'phoneCodeTimeout', modify: false },
  { title: 'token超时时间（秒）', key: 'tokenTimeout', modify: false },
])
const configData = reactive({
  loading: false,
  currentConfig: new SystemConfig(), //当前配置和默认配置
  defaultConfig: new SystemConfig(), //默认配置
})
//修改配置数据
const modifyData = reactive({
  data: new SystemConfig(),
  loading: false,
  all: false,
  disable: false,
})
const queryAll = () => {
  configData.loading = true
  server.post('/admin/config/querySystemConfig', {}, (data: BaseDataResult<SystemConfig>) => {
    configData.loading = false
    if (data.success) {
      configData.currentConfig = data.data
      modifyData.data = JSON.parse(JSON.stringify(configData.currentConfig))
      queryBaseAll()
    }
  })
}
queryAll()
const queryBaseAll = () => {
  configData.loading = true
  server.post('/admin/config/queryBaseConfig', {}, (data: BaseDataResult<SystemConfig>) => {
    configData.loading = false
    if (data.success) {
      configData.defaultConfig = data.data
    }
  })
}
const openOrCloseAllModify = (mode: string) => {
  if (mode == 'open') {
    columns.forEach((item) => (item.modify = true))
    modifyData.all = true
  } else {
    columns.forEach((item) => (item.modify = false))
    modifyData.data = JSON.parse(JSON.stringify(configData.currentConfig))
    modifyData.all = false
  }
}
const modifyConfig = () => {
  for (const key in modifyData.data) {
    if (modifyData.data[key] == '') {
      modifyData.disable = true
      dialogApi.messageWarning('内容不能为空')
      return
    }
  }
  if (!modifyData.disable) {
    server.post('/admin/config/updateSystemConfig', modifyData.data, (data: BaseResult) => {
      if (data.success) {
        dialogApi.messageInfo(data.message)
        queryAll()
      }
    })
  }
}
</script>
<template>
  <div>
    <header class="tc">
      <h1>系统配置管理</h1>
    </header>
    <main>
      <n-card title=" ">
        <template #header-extra>
          <n-space>
            <n-button type="error" v-if="!modifyData.all" @click="openOrCloseAllModify('open')">修改所有</n-button>
            <n-button type="info" v-else @click="openOrCloseAllModify('close')">关闭所有修改</n-button>
            <n-button type="warning" v-if="modifyData.all" @click="modifyConfig">保存所有</n-button>
            <n-button type="success" @click="router.back()">返回</n-button></n-space
          >
        </template>
        <n-list v-if="configData.loading">
          <n-list-item>
            <n-grid cols="3" item-responsive>
              <n-gi>
                <n-space vertical>
                  <n-skeleton :width="150" :height="25" />
                  <n-skeleton :width="100" :height="20" />
                </n-space>
              </n-gi>
              <n-gi>
                <n-space justify="center"> <n-skeleton :width="100" :height="20" /> </n-space>
              </n-gi>
              <n-gi>
                <n-space justify="end"> <n-skeleton :width="100" :height="20" /> </n-space>
              </n-gi>
            </n-grid>
          </n-list-item>
        </n-list>
        <n-list v-else>
          <n-list-item v-for="(c, i) in columns" :key="c.key">
            <n-grid cols="3" item-responsive>
              <n-gi>
                <n-thing :title="c.title" :description="`默认值：${configData.defaultConfig[c.key]}`"> </n-thing>
              </n-gi>
              <n-gi class="tc">
                <n-number-animation :from="0" :to="configData.currentConfig[c.key]" v-if="!c.modify" />
                <n-input v-else v-model:value="modifyData.data[c.key]" :placeholder="`请输入${c.title}`" />
              </n-gi>
              <n-gi>
                <n-space justify="end">
                  <n-button type="error" v-if="!columns[i].modify" @click="columns[i].modify = !columns[i].modify">修改</n-button>
                  <n-button v-else type="warning" :disabled="modifyData.data[c.key] == 0 || modifyData.data[c.key] == '' ? true : false" @click="modifyConfig">保存</n-button>
                  <n-button v-if="columns[i].modify" @click="columns[i].modify = false" type="info">取消</n-button>
                </n-space>
              </n-gi>
            </n-grid>
          </n-list-item>
        </n-list>
      </n-card>
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
main {
  width: 60vw;
  margin: 2rem auto;
}
</style>
