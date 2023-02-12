<script setup lang="ts">
import { storeToRefs } from 'pinia'
import store from '../../store/index'
import { PortableInfo, PortableInfoConverter, TestPortableInfo, convert } from '../../entity/PortableInfo'
import { server, serverInfo } from '../../tools/server'
import { reactive } from 'vue'
import { BaseListResult } from '../../entity/BaseResult'

// 登录用户信息相关
const storeInfo = store()
const { countInfo } = storeToRefs(storeInfo)

const title = '教学演示项目-门户信息演示'

const viewdata = reactive({
  testinfo: new TestPortableInfo(),
  testjson: {
    title: '',
    qq: '',
    logo: '',
  },
})

const queryTest = () => {
  server.post(
    '/portable/message/queryAll',
    {
      accessKey: serverInfo.accessKey,
      messageGroup: 'test',
      pageSize: 1000,
      pageNumber: 1,
    },
    (data: BaseListResult<PortableInfo>) => {
      viewdata.testinfo = new PortableInfoConverter<TestPortableInfo>().convert(data.list, viewdata.testinfo)
      viewdata.testjson = convert(data.list)
    }
  )
}

queryTest()
</script>

<template>
  <div>
    {{ title }}
    <br />
    网站访问量：{{ countInfo }}
    <br />
    测试门户信息：{{ viewdata.testinfo }}
    <br />
    测试门户信息json格式：{{ viewdata.testjson }}
    <br />
    <img :src="viewdata.testinfo.logo" alt="" />
    <br />
    {{ viewdata.testjson.title }}-{{ viewdata.testjson.qq }}
  </div>
</template>
