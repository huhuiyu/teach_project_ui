<template>
  <div class="container">
    <div class="map-search-container">
      <div>
        <!-- <input type="text" id="search-input" /> -->
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="searchInfo" placeholder="地址搜索">
              <el-button slot="append" @click="search">
                <i class="iconfont">&#xe622;</i>
              </el-button>
            </el-input>
          </el-form-item>
          <!-- <el-form-item> <el-button type="primary" size="small" @click="search">搜索</el-button> </el-form-item> -->
        </el-form>
      </div>
      <div id="map-search-container"></div>
    </div>
    <div id="map-container"></div>
    <div class="pd10">
      <span> 地址信息：{{ info.address }}，坐标：{{ info.lng }},{{ info.lat }}</span>
      &nbsp;&nbsp;
      <el-button size="small" type="primary" @click="selected">确定选择</el-button>
    </div>
  </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
let AMapObject
let AMapUIObject
let key = '7b23a894e66de98084f3b7dcda096457'
let map
let geolocation
let positionPicker
let placeSearch

import logger from '../js/logger'
let app
export default {
  data() {
    return {
      title: '拖动地图选择地址',
      loading: false,
      info: {},
      searchInfo: '',
    }
  },
  computed: {},
  methods: {
    search() {
      placeSearch.search(this.searchInfo)
    },
    selected() {
      this.$emit('choosed', this.info)
    },
    locationComplete(data) {
      logger.debug('定位信息：', data)
      let currentLngLat = new AMapObject.LngLat(data.position.lng, data.position.lat)
      positionPicker.start(currentLngLat)

      placeSearch = new AMapObject.PlaceSearch({
        pageSize: 3, // 单页显示结果条数
        pageIndex: 1, // 页码
        // city: result.regeocode.addressComponent.citycode, // 兴趣点城市
        citylimit: true, //是否强制限制在设置的城市内搜索
        map: map, // 展现结果的地图实例
        panel: 'map-search-container', // 结果列表将在此容器中进行展示。
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      })

      logger.debug('地址搜索对象，', placeSearch)
      let geocoder = new AMapObject.Geocoder()
      geocoder.getAddress(currentLngLat, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          logger.debug('逆地址编码信息：', result)
          placeSearch.setCity(result.regeocode.addressComponent.citycode)
          // placeSearch.search(result.regeocode.addressComponent.city)
          //{
          //     "info": "OK",
          //     "regeocode": {
          //         "addressComponent": {
          //             "citycode": "0736",
          //             "adcode": "430702",
          //             "businessAreas": [],
          //             "neighborhoodType": "",
          //             "neighborhood": "",
          //             "building": "",
          //             "buildingType": "",
          //             "street": "柳叶大道",
          //             "streetNumber": "3060号",
          //             "province": "湖南省",
          //             "city": "常德市",
          //             "district": "武陵区",
          //             "township": "南坪街道"
          //         },
          //         "formattedAddress": "湖南省常德市武陵区南坪街道湖南文理学院东附楼湖南文理学院(北院)",
          //         "roads": [],
          //         "crosses": [],
          //         "pois": []
          //     }
          // }
        }
      })
    },
    locationError(err) {
      app.loading = false
      logger.error(err)
      app.$message.error('定位失败')
    },
    loadMapApi() {
      this.loading = true
      AMapLoader.load({
        key: key, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Scale', 'AMap.Geolocation', 'AMap.Marker', 'AMap.ToolBar', 'AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: '1.1', // AMapUI 版本
          plugins: ['misc/PositionPicker'], // 需要加载的 AMapUI ui插件
        },
      })
        .then(app.initMap)
        .catch((e) => {
          app.loading = false
          app.$message.error(JSON.stringify(e))
        })
    },
    initMap(AMap) {
      AMapObject = AMap
      AMapUIObject = window.AMapUI
      map = new AMap.Map('map-container', {
        zoom: 15, //级别
        // center: [data.position.lng, data.position.lat], //中心点坐标
      })
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar({ position: 'LT' }))

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
      positionPicker = new AMapUIObject.PositionPicker({
        mode: 'dragMap',
        map: map,
      })

      logger.debug('positionPicker===>', positionPicker)

      positionPicker.on('success', (positionResult) => {
        logger.debug('positionPicker success：', positionResult)
        app.info = {
          address: positionResult.address,
          lng: positionResult.position.lng,
          lat: positionResult.position.lat,
        }
        app.loading = true
      })
      positionPicker.on('fail', (positionResult) => {
        app.loading = false
        logger.debug('positionPicker fail：', positionResult)
        app.$message.error('定位失败')
      })

      geolocation.getCurrentPosition()
    },
  },
  created() {
    app = this
    app.loadMapApi()
  },
  destroyed() {},
}
</script>
<style scoped>
.container {
  height: 80vh;
  display: flex;
  flex-direction: column;
}
#map-container {
  flex: 1;
}
.map-search-container {
  z-index: 8888;
  position: absolute;
  top: 5rem;
  right: 1rem;
}
</style>
