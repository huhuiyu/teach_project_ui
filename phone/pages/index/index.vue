<template>
	<view class="content">
		<image class="logo" src="https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81">
		</image>
		<view class="text-area">
			<text class="title">{{viewdata.title}}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	const viewdata = reactive({
		title: '教学演示首页'
	});
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
