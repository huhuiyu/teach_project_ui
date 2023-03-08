<template>
	<view class="map-container">
		<view class="inputAndButton">
			<view class="input">
				<input type="text" v-model="mapData.serachInfo.name" placeholder="请输入关键词" id="tipinput"
					@input="tipInput" />
			</view>
			<button class="button" :disabled="mapData.serachInfo.name==''?true:false" @click="searchCity" plain
				size="mini">搜索</button>
		</view>
		<view id="amap-container"></view>
		<view>
			<view class="map-info">
				<text> 地址：{{ mapData.positionResult.address}}</text>
			</view>
			<view class="inputAndButton">
				<view class="input">
					<input type="text" v-model="mapData.addInfo.info" placeholder="请输入地址描述" />
				</view>
				<button class="button" :disabled="mapData.addInfo.info==''?true:false" plain size="mini"
					@click="addMapInfo">添加</button>
			</view>
		</view>

	</view>
</template>
<script lang="ts" setup>
	import {
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'
	import AMapLoader from '@amap/amap-jsapi-loader'
	import server from '../../script/server';
	import BaseResult, {
		BaseListResult
	} from '../../script/entity/BaseResult';
	import {
		AMapInfo
	} from '../../script/entity/AMapInfo';

	let map: any
	let AMap: any
	let AMapUI: any
	let timer = null
	let geolocation: any //定位
	let placeSearch: any //搜索
	let autoComplete: any //输入提示
	let positionPicker: any //拖拽定位

	const mapData = reactive({
		title: '教学演示',
		mapInfo: {
			err: '',
			info: '',
			nowInfo: ''
		},
		input: "tipinput",
		serachInfo: {
			name: '',
			adcode: 0
		},
		addInfo: {
			address: "",
			info: "",
			lat: 0,
			lng: 0
		},
		regeocode: Object as any,
		positionResult: {
			position: {
				lat: 0,
				lng: 0
			},
			address: '',
		},
		markerList: [],
		list: [],
	})
	const loadLocation = () => {
		geolocation = new AMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			offset: [18, 90],
			zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false

		})
		map.addControl(geolocation);
		geolocation.getCurrentPosition((status: any, result: any) => {
			console.log('定位结果', status, result);
			//定位成功后设置地图中心点
			if (status == 'complete') {
				let LngLat = new AMap.LngLat(result.position.lng, result.position.lat); //标准写法
				map.setCenter(LngLat)
				let geocoder = new AMap.Geocoder({
					// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
					// city: '010'	//默认值：“全国”
					// radius: 500 //范围，默认：1000
				})
				//添加输入提示插件  实例化AutoComplete
				autoComplete = new AMap.AutoComplete({
					input: 'tipinput'
				});
				//添加搜索插件 实例化PlaceSearch
				placeSearch = new AMap.PlaceSearch({
					// city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
					// city: '430702',
					map: map,
					citylimit: true
				})

				//逆地理编码
				geocoder.getAddress(LngLat, function(gstatus: any, gresult: any) {
					console.log('逆地理编码', gstatus, gresult);
					if (gstatus === 'complete' && gresult.info === 'OK') {
						// result为对应的地理位置详细信息
						mapData.regeocode = gresult.regeocode
						placeSearch.setCity(mapData.regeocode.addressComponent.citycode);
					}
				})
				queryMarkers()
				dragMap()
			} else {
				mapData.mapInfo.err = result
			}
		})
	}
	//添加地址信息
	const addMapInfo = () => {
		uni.showLoading({
			title: '加载中'
		})
		mapData.addInfo.address = mapData.positionResult.address
		mapData.addInfo.lat = mapData.positionResult.position.lat
		mapData.addInfo.lng = mapData.positionResult.position.lng
		server.post('/mapinfo/add', mapData.addInfo, (data: BaseResult) => {
			uni.hideLoading()
			if (data.success) {
				uni.showToast({
					title: data.message,
					icon: 'none'
				})
				mapData.list = []
				queryMarkers()
			} else {
				uni.showToast({
					title: data.message,
					icon: 'error'
				})
			}
		})
	}
	//查询添加marker
	const queryMarkers = () => {
		uni.showLoading({
			title: '加载中',
		})
		server.post('/mapinfo/queryAll', {}, (data: BaseListResult <
			AMapInfo > ) => {
			uni.hideLoading()
			if (data.success) {
				data.list.forEach((item: AMapInfo) => {
					mapData.list.push(new AMap.Marker({
						position: new AMap.LngLat(item.lng,
							item.lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
						title: item.info
					}))
				})
				map.add(mapData.list)
			}
		})
	}
	//拖拽地图
	const dragMap = () => {
		AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker: any) {
			positionPicker = new PositionPicker({
				mode: 'dragMap', //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
				map: map //依赖地图对象
			})
			//TODO:事件绑定、结果处理等
			positionPicker.start()
			positionPicker.on('success', function(positionResult: any) {
				console.log('success', positionResult);
				mapData.positionResult = positionResult
			})
			positionPicker.on('fail', function(positionResult: any) {
				// 海上或海外无法获得地址信息
				console.log('fail', positionResult);
				mapData.positionResult.address = '海上或海外无法获得地址信息'
			})
		})

	}
	//输入提示
	const tipInput = () => {
		if (timer != null) clearTimeout(timer)
		timer = setTimeout(() => {
			console.log(timer);
			// 根据关键字进行搜索
			autoComplete.search(mapData.serachInfo.name, function(status: any, result: any) {
				console.log(status, result, '关键字搜索');
			})
			AMap.Event.addListener(autoComplete, "select", (e: any) => {
				console.log(e, '选中的');
				mapData.serachInfo = e.poi
			}) //注册监听，当选中某条记录时会触发
		}, 1000)


	}
	const searchCity = () => {
		// 关键字查询查询
		placeSearch.search(mapData.serachInfo.name, (status: any, info: any) => {
			console.log(status, info);
			console.log(info);
		})
	}

	onMounted(() => {
		let config = {
			key: '7b23a894e66de98084f3b7dcda096457',
			version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
			plugins: ['AMap.Scale', 'AMap.Geolocation', 'AMap.Marker',
				'AMap.Geocoder', 'AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.ToolBar'
			], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
			AMapUI: { // 是否加载 AMapUI，缺省不加载
				version: '1.1', // AMapUI 版本
				plugins: ['misc/PositionPicker'], // 需要加载的 AMapUI ui插件
			},
		}
		AMapLoader.load(config).then((AMapObj) => {
			// console.log('platform:', uni.getSystemInfoSync().platform)
			// console.log('AMapUI========>', top.AMapUI)
			// console.log("=========>", AMapObj);
			AMap = AMapObj
			AMapUI = top.AMapUI
			map = new AMap.Map('amap-container', {
				zoom: 18,
				resizeEnable: true,
			})
			map.addControl(new AMap.Scale());
			map.addControl(new AMap.ToolBar());

			console.log('AMapUI:', AMapUI)
			// 地图加载成功后调用定位
			loadLocation()
		}).catch((e) => {
			console.log(e)
		})
	})

	onUnmounted(() => {
		map.destroy();
	})
</script>

<style scoped>
	.map-container {
		width: 100vw;
		height: calc(100vh - 44px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}


	#amap-container {
		box-sizing: border-box;
		height: 100%;
		flex: 1;
	}

	.map-container>view:last-child {
		padding: 1rem;
	}

	.inputAndButton {
		display: flex;
		align-items: center;
		margin: 0.5rem;
	}

	.inputAndButton .input {
		border-radius: 5px;
		border: 1px solid #ccc;
		padding: 6px 12px;
		flex: 4;
	}

	.inputAndButton .button {
		margin-left: 5px;
		flex: 1;
		padding: 2px 6px;
	}

	.map-info text {
		font-size: 12px;
		display: block;
	}
</style>
