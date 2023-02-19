<template>
	<view class="content">
		<image @click="toTest" class="logo"
			src="https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81">
		</image>
		<view class="text-area">
			<text class="title">{{viewdata.title}}</text>
		</view>
		<view class="text-area">
			<text class="title">开发中，童鞋们再等等</text>

		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	const viewdata = reactive({
		title: '教学演示界面首页',
		testCount: 0
	});
	const toTest = () => {
		viewdata.testCount++
		if (viewdata.testCount >= 5) {
			viewdata.testCount = 0
			uni.navigateTo({
				url: "/pages/test/test"
			})
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
