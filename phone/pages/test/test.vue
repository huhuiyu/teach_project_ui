<template>
	<view class="pd10">
		<text>{{viewdata.title}}</text>
	</view>
	<view v-for="(item) in viewdata.list" :key="item.pmid" class="pd10">
		<text>{{item.messageKey}}</text>:<text>{{item.message}}</text>
	</view>
	<view class="pd10">
		{{viewdata.result.info}}
	</view>
	<view class="pd10">
		{{viewdata.result.logo}}
	</view>
	<view class="pd10">
		{{viewdata.error}}
	</view>
	<view class="pd10">
		{{viewdata.token1}}=={{viewdata.token2}}
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	import {
		server,
		serverInfo
	} from '../../script/server'
	import PortableInfo, {
		convert
	} from '../../script/entity/PortableInfo'
	import {
		PageInfo,
		BaseListResult,
		BaseResult
	} from '../../script/entity/BaseResult'
	import tools from '../../script/tools';
	const viewdata = reactive({
		title: '教学演示测试首页',
		list: new Array < PortableInfo > (),
		page: new PageInfo(),
		queryParam: {
			accessKey: serverInfo.accessKey,
			messageGroup: 'test'
		},
		result: {
			info: '',
			logo: '',
			qq: '',
			title: ''
		},
		error: '',
		token1: '',
		token2: ''
	});
	const query = () => {
		console.log('测试token')
		server.get('/token', {}, (data: BaseResult) => {
			console.log('token信息1：', data)
			viewdata.token1 = data.token
			server.get('/token', {}, (data: BaseResult) => {
				console.log('token信息2：', data)
				viewdata.token2 = data.token
			})
		})
		console.log("测试数据查询")
		server.post('/portable/message/queryAll', tools.concatJson(viewdata.queryParam, viewdata.page), (data:
			BaseListResult <
			PortableInfo > ) => {
			console.log("门户信息：", data)
			if (data.success) {
				viewdata.list = data.list
				viewdata.page = data.page
				viewdata.result = convert(data.list)
				return
			}
			viewdata.error = JSON.stringify(data)
			uni.showToast({
				icon: 'error',
				title: data.message
			})
		})
		server.get('/', {
			echo: "黑暗骑士"
		}, (data: BaseResult) => {
			console.log("get请求测试：", data)
		})
	}
	query()
</script>

<style>
	.pd10 {
		word-break: break-all;
		padding: 1rem;
	}
</style>
