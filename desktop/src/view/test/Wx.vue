<script setup lang="ts">
import { ref } from 'vue'
import { BaseDataResult } from '../../entity/BaseResult'
import { JsSignature } from '../../entity/Wx'
import server from '../../tools/server'

const title = '教学演示项目-wx接口-本页面必须在微信中打开'
const wx = window.wx
const info = ref('')
const initWx = () => {
  server.post('/callback/queryWxJsSignature', {}, (data: BaseDataResult<JsSignature>) => {
    if (!data.success) {
      alert(data.message)
      return
    }
    alert(JSON.stringify(data.data))
    let signature = data.data
    wx.config({
      debug: true, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
      appId: signature.appId, // 必填，公众号的唯一标识
      timestamp: signature.timestamp, // 必填，生成签名的时间戳
      nonceStr: signature.noncestr, // 必填，生成签名的随机串
      signature: signature.signature, // 必填，签名
      jsApiList: ['getLocation'], // 必填，需要使用的 JS 接口列表
    })
  })
}

wx.ready(() => {
  info.value = '微信接口初始化成功'
  // config信息验证后会执行 ready 方法，所有接口调用都必须在 config 接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在 ready 函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在 ready 函数中。
})
wx.error((res: any) => {
  info.value = '微信接口初始化失败'
  // config信息验证后会执行 ready 方法，所有接口调用都必须在 config 接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在 ready 函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在 ready 函数中。
})

initWx()
</script>

<template>
  <div> {{ title }}-{{ wx }}-{{ info }} </div>
</template>
