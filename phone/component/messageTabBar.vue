<template>
	<view class="tarbar">
		<view class="tarbar-list" :style="{
	                background: data.tabBar.backgroundColor,
	                color: data.tabBar.color,
	                'border-top': data.tabBar.position == 'bottom' ? '1rpx solid ' + data.tabBar.borderStyle : 0,
	                'border-bottom': data.tabBar.position == 'top' ? '1rpx solid ' + data.tabBar.borderStyle : 0
	            }
				">
			<view class="tarbar-list-ul">
				<view class="tarbar-list-li" v-for="(item, index) in data.tabBar.list" :key="index"
					@click="jumpRouter(item.pagePath)">
					<view>
						<view class="tarbar-list-li-icon">
							<image :src="'/'+page.route == item.pagePath ? item.selectedIconPath : item.iconPath">
							</image>
						</view>
						<view :style='"/"+page.route == index?"color:"+data.tabBar.selectedColor:""'
							class="tarbar-list-li-name">
							{{ item.text }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	const data = reactive({
		tabBar: {
			color: '#2C405A',
			selectedColor: '#426ad9',
			borderStyle: 'white',
			backgroundColor: '#fff',
			position: 'bottom',
			list: [{
					text: "首页",
					pagePath: "/pages/message/home",
					// 未选中的图标
					iconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=99",
					// 选中的图标
					selectedIconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=100"

				},
				{
					text: "创作",
					pagePath: "/pages/message/edit",
					// 未选中的图标
					iconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=102",
					// 选中的图标
					selectedIconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=101"
				},
				{
					text: "消息",
					pagePath: "/pages/message/privateMessage",
					// 未选中的图标
					iconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=103",
					// 选中的图标
					selectedIconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=104"
				},
				{
					text: "我的",
					pagePath: "/pages/message/personalHome",
					// 未选中的图标
					iconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=106",
					// 选中的图标
					selectedIconPath: "https://service.huhuiyu.top/teach_project_service/user/file/download?fid=105"
				}
			]
		},
		selected: 0
	})

	const jumpRouter = (url: string) => {
		uni.navigateTo({
			url: url
		})
	}
	const pages = getCurrentPages();
	const page = pages[pages.length - 1];
</script>

<style scoped>
	.tarbar {
		width: 100%;
		z-index: 9999;
		position: fixed;
	}

	.tarbar-list {
		width: 100%;
		height: 98upx;
		background: #4d586f;
		position: fixed;
		left: 0;
		bottom: 0;
	}

	.tarbar-list-ul {
		width: 100%;
		height: 100%;
		padding: 0upx 60upx;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tarbar-list-li {
		width: 80upx;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.tarbar-list-li-icon {
		width: 50upx;
		height: 50upx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tarbar-list-li-icon image {
		width: 36rpx;
		height: 36rpx;
	}

	.tarbar-list-li-name {
		width: 100%;
		text-align: center;
		line-height: 30upx;
		font-size: 24upx;
		height: 30upx;
	}

	.tarbar-list-li-center {
		width: 100upx;
	}
</style>
