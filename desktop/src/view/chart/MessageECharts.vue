<template>
  <div>
    <main>
      <div id="lineCharts" style="width: 1000px; height: 400px"></div>
      <div id="radiusCharts" style="width: 600px; height: 400px"></div>
    </main>
  </div>
</template>

<script setup lang="ts" name="MessageECharts">
import { onMounted, reactive } from 'vue'
// Echarts 为init（dom元素后的类型）
// EChartsOption 为 option 的类型
import { ECharts, EChartsOption, init } from 'echarts'
import server from '../../tools/server'
import { BaseListResult } from '../../entity/BaseResult'
import { ChartsInfo } from '../../entity/ChartsInfo'
onMounted(() => {
  const lineCharts = document.getElementById('lineCharts') as HTMLElement
  const radiusCharts = document.getElementById('radiusCharts') as HTMLElement
  const charEchL: ECharts = init(lineCharts)
  const charEchR: ECharts = init(radiusCharts)

  const Data = reactive({
    list: [] as ChartsInfo[],
  })
  const optionL: EChartsOption = reactive({
    xAxis: {},
    yAxis: {},
    series: [],
  })
  const optionR: EChartsOption = reactive({
    series: [],
  })

  const queryMessageInfo = () => {
    server.get('/statistics/queryTotal', {}, (data: BaseListResult<ChartsInfo>) => {
      Data.list = data.list
      optionL.xAxis = { data: Data.list.map((item) => item.title) }
      optionL.series = [{ type: 'bar', data: Data.list.map((item) => item.data) }]
      optionR.series = [
        {
          type: 'pie',
          data: data.list.map((item) => JSON.parse(JSON.stringify({ value: item.data, name: item.title }))),
        },
      ]
      charEchL.setOption(optionL)
      charEchR.setOption(optionR)
    })
  }
  queryMessageInfo()
})
</script>

<style scoped>
main {
  display: flex;
}
</style>
