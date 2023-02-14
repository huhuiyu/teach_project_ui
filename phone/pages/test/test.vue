<template>
	<view>
		<text>{{viewdata.title}}</text>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	import server from '../../script/server'
	const viewdata = reactive({
		title: '教学演示测试首页'
	});
	console.log(server)
</script>

<style>

</style>
