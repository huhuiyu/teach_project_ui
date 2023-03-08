<template>
	<view>
		<view class="input-box">
			<input type="text" v-model="mapData.querInfo.info" class="uni-input" confirm-type="search"
				placeholder="请输入你想搜索的地址" @confirm='queryAll' />
		</view>
		<view class="list">
			<view class="list_item" v-for="m in mapData.list" :key='m.mid'>
				<view class="info">
					<text> {{m.info}}</text>
				</view>
				<view class="date">
					{{tools.formatDate(parseInt(m.lastupdate))}}
				</view>
				<view class="address">
					{{m.address}}
				</view>
				<view class="address">
					经纬度(lat&lng): {{m.lat}}&{{m.lng}}
				</view>
				<view class="iconList">
					<view @click="openMap(m.lng,m.lat)">
						<text class="iconfont">&#xe6a2;打开地图</text>
					</view>
					<view @click="delMap(m)">
						<text class="iconfont">&#xe68e;删除</text>
					</view>
				</view>
			</view>
		</view>
		<view class="addAddress" @click="jumpRouter">
			<button type="primary">+添加地址</button>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import {
		reactive
	} from "vue";
	import {
		AMapInfo
	} from "../../script/entity/AMapInfo";
	import BaseResult, {
		BaseListResult
	} from "../../script/entity/BaseResult";
	import {
		onReachBottom,
		onPullDownRefresh,
	} from "@dcloudio/uni-app";
	import server from "../../script/server";
	import tools from "../../script/tools";
	const mapData = reactive({
		querInfo: {
			info: ''
		},
		page: {
			pageNumber: 1,
			pageSize: 10,
			pageCount: 0
		},
		list: [] as AMapInfo[],
		loading: false,
		level: 1
	})
	const queryAll = () => {
		if (mapData.level == 1) {
			mapData.page.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		mapData.loading = true
		server.post('/mapinfo/queryAll', tools.concatJson(mapData.querInfo, mapData.page), (data: BaseListResult <
			AMapInfo > ) => {
			mapData.loading = false
			uni.hideLoading()
			if (mapData.level == 1) {
				mapData.list = data.list
				uni.stopPullDownRefresh()
			}
			if (mapData.level == 2) {
				mapData.list = mapData.list.concat(data.list)
			}
			mapData.page = data.page

		})
	}
	queryAll()
	const delMap = (mapInfo: AMapInfo) => {
		uni.showModal({
			title: '提示',
			content: '确认是否删除' + mapInfo.info + '地址',
			success: function(res: any) {
				if (res.confirm) {
					server.post('/mapinfo/delete', {
						mid: mapInfo.mid
					}, function(data: BaseResult) {
						if (data.success) {
							mapData.level = 1
							queryAll()
							uni.showToast({
								title: data.message,
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: data.message,
								icon: 'error'
							})
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}

	const jumpRouter = () => {
		uni.navigateTo({
			url: '/pages/map/amap'
		})
	}
	const openMap = (longitude: any, latitude: any) => {
		window.open(`https://uri.amap.com/marker?position=${longitude},${latitude}`)
	}
	//加载更多的下拉----页面触底生命周期
	onReachBottom(() => {
		mapData.level = 2
		if (mapData.page.pageNumber < mapData.page.pageCount) {
			uni.showLoading({
				title: '加载中',
			});
			setTimeout(function() {
				uni.hideLoading();
				mapData.page.pageNumber++
				queryAll();
			}, 1000);

		} else {
			uni.showToast({
				title: '没有更多了~',
				icon: 'none'
			})
		}
	})
	// 刷新的生命周期
	onPullDownRefresh(() => {
		mapData.level = 1
		queryAll()
	})
</script>

<style scoped>
	@import url("../../static/iconfont/iconfont.css");

	.input-box {
		margin: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 6px 12px;
	}

	.list {
		padding-bottom: 4rem;
	}

	.list_item {
		border: 1px solid #8e8e8e4f;
		border-radius: 10px;
		padding: 10px;
		margin: 10px;
		word-break: break-all;
		box-shadow: 0 0 0 1px rgb(0 0 0/5%), 0 1px 3px 1px rgba(0, 0, 0, .16);
	}


	.date {
		font-size: 14px;
		align-items: center;
		color: #999;
	}

	.list_item .address {
		margin: 8px 0;
		font-size: 14px;
	}

	.iconList {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.iconList>view {
		margin: 2rpx 10rpx;

	}

	.iconList text {
		font-size: 14px;
	}

	.addAddress {
		position: fixed;
		bottom: 0;
		width: 100vw;
		background-color: #eee;
		padding: 0.5rem 0;
	}

	.addAddress button {
		width: 90%;
		border-radius: 20px
	}
</style>
