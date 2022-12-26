<template>
  <div class="container" v-loading="loading">
    <back-comp></back-comp>
    <div>{{ title }}</div>
    <div id="map-container"></div>
    <div>
      <div>{{ info }}</div>
    </div>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
let AMapObject
let key = '7b23a894e66de98084f3b7dcda096457'
let navurl = 'https://m.amap.com/navi/?'
let markerurl = 'https://uri.amap.com/marker?'
let map
let geolocation
let positionPicker
let app

import qs from 'qs'
import logger from '../../js/logger'
import BackComp from '../../components/BackComp.vue'

export default {
  components: { BackComp },
  data() {
    return {
      title: '高德地图',
      info: {},
      loading: false,
    }
  },
  computed: {},
  methods: {
    openMarker(marker) {
      logger.debug('marker', marker.getPosition(), marker.getTitle())
      let position = marker.getPosition()
      let address = encodeURIComponent(marker.getTitle())
      location = markerurl + `position=${position.lng},${position.lat}&name=${address}`
    },
    locationComplete(data) {
      app.info = data
      positionPicker.start(new AMapObject.LngLat(data.position.lng, data.position.lat))
    },
    locationError(err) {
      app.info = err
    },
    loadMapApi() {
      AMapLoader.load({
        key: key, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Scale', 'AMap.Geolocation', 'AMap.Marker', 'AMap.ToolBar'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: '1.1', // AMapUI 版本
          plugins: ['misc/PositionPicker'], // 需要加载的 AMapUI ui插件
        },
      })
        .then(app.initMap)
        .catch((e) => {
          app.info = e
        })
    },
    initMap(AMap) {
      AMapObject = AMap
      map = new AMap.Map('map-container', {
        zoom: 15, //级别
        // center: [data.position.lng, data.position.lat], //中心点坐标
      })
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar({ position: 'RT' }))
      let marker01 = new AMap.Marker({
        position: new AMap.LngLat(111.671341, 29.04518),
        icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
        // image: '//webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png', // 自定义点标记
        offset: new AMap.Pixel(-10, -10), // 设置点标记偏移量
        title: '湖南文理学院第二办公楼',
      })
      let marker02 = new AMap.Marker({
        position: new AMap.LngLat(111.670815, 29.044486),
        icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
        // image: '//webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png', // 自定义点标记
        offset: new AMap.Pixel(-10, -10), // 设置点标记偏移量
        title: '湖南文理学院第一教学楼',
      })
      let marker03 = new AMap.Marker({
        position: new AMap.LngLat(111.655888, 29.042857),
        icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
        // image: '//webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png', // 自定义点标记
        offset: new AMap.Pixel(-10, -10), // 设置点标记偏移量
        title: '湖南省常德市武陵区白马湖街道滨湖路2878号五强溪',
      })

      map.addControl(marker01)
      map.addControl(marker02)
      map.addControl(marker03)
      marker01.on('click', () => {
        app.openMarker(marker01)
      })
      marker02.on('click', () => {
        app.openMarker(marker02)
      })
      marker03.on('click', () => {
        app.openMarker(marker03)
      })

      logger.debug('map===>', map)
      //定位功能
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 60000, //超过60秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      })

      geolocation.on('complete', app.locationComplete)
      geolocation.on('error', app.locationError)

      map.addControl(geolocation)

      // 拖动定位
      positionPicker = new window.AMapUI.PositionPicker({
        mode: 'dragMap',
        map: map,
      })

      logger.debug('positionPicker===>', positionPicker)

      positionPicker.on('success', (positionResult) => {
        logger.debug('positionPicker success：', positionResult)
        app.info = positionResult
      })
      positionPicker.on('fail', (positionResult) => {
        logger.debug('positionPicker fail：', positionResult)
        app.info = positionResult
      })

      geolocation.getCurrentPosition()
    },
  },
  mounted() {
    app.loadMapApi()
  },
  created() {
    app = this
    logger.debug(navurl, qs.stringify({ start: 'ddd', end: '第二教学楼' }))
  },
  destroyed() {
    if (map) {
      map.destroy()
    }
  },
}
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.container > div:first-of-type {
  text-align: center;
  padding: 0.5rem;
}

.container > div:last-of-type {
  padding: 1rem;
  max-height: 6em;
  overflow-y: auto;
}

#map-container {
  flex: 1;
}
</style>
