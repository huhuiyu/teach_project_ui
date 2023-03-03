<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import logger from '../../tools/logger'

const title = '教学演示项目-地图演示'
const viewdata = reactive({
  mapinfo: {
    err: {},
    info: {},
  },
})

let map: any
let geolocation: any
let marker: any
let AMap: any

const loadLocation = () => {
  geolocation = new AMap.Geolocation({
    // 是否使用高精度定位，默认：true
    enableHighAccuracy: true,
    // 设置定位超时时间，默认：无穷大
    timeout: 10000,
    // 定位按钮的停靠位置的偏移量
    offset: [10, 20],
    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    zoomToAccuracy: true,
    //  定位按钮的排放位置,  RB表示右下
    position: 'RB',
  })

  geolocation.getCurrentPosition((status: any, result: any) => {
    logger.debug('定位结果：', status, result)
    if (status == 'complete') {
      let lnglat = new AMap.LngLat(result.position.lng, result.position.lat)
      map.setCenter(lnglat)

      let geocoder = new AMap.Geocoder({
        city: '010',
      })
      let title = '北京'
      geocoder.getAddress(lnglat, (gstatus: any, gresult: any) => {
        logger.debug('逆地理编码结果', gstatus, gresult)
        if (gstatus === 'complete' && gresult.info === 'OK') {
          marker.setTitle(gresult.regeocode.formattedAddress)
        }
      })

      marker = new AMap.Marker({
        position: lnglat,
        title: title,
      })
      map.addControl(marker)
    } else {
      viewdata.mapinfo.err = result
    }
  })
}

onMounted(() => {
  AMapLoader.load({
    key: '7b23a894e66de98084f3b7dcda096457', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale', 'AMap.Geolocation', 'AMap.Marker', 'AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMapObj) => {
      AMap = AMapObj
      map = new AMap.Map('amap-container', {
        zoom: 18,
      })
      map.addControl(new AMap.Scale())
      loadLocation()
    })
    .catch((err) => {
      viewdata.mapinfo.err = err
    })
})
</script>

<template>
  <div class="map-container">
    <div>{{ title }}</div>
    <div id="amap-container"></div>
    <div>{{ viewdata.mapinfo }}</div>
  </div>
</template>

<style>
.map-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
#amap-container {
  flex: 1;
  box-sizing: border-box;
  border: 1px solid #dcdcdc;
}

.map-container > :first-child,
.map-container > :last-child {
  padding: 1rem;
}
</style>
