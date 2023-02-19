<template>
	<view class="container">
		<view class="text-box">
			<text class="title">{{ toolsData.title }}</text>
		</view>
		<form>
			<view class="input-box">
				<input class="uni-input" type="text" v-model="userData.username" placeholder="用户名" focus />
			</view>
			<view class="input-box">
				<input v-model="userData.password" placeholder="密码" password />
			</view>
			<view class="btns">
				<button @click="login">登录</button>
				<button formType="reset">重置</button>
			</view>
		</form>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	import server from '../../script/server'
	import tools from '../../script/tools'
	import BaseResult from '../../script/entity/BaseResult'
	import useStore from '../../store/index'
	const toolsData = reactive({
		title: '用户登录',

	})
	const userData = reactive({
		username: '',
		password: ''
	})
	const login = () => {
		uni.showLoading({
			title: '加载中',
			mask: true
		});
		userData.password = tools.md5(userData.password)
		server.post('/user/auth/login', userData, (data: BaseResult) => {
			uni.hideLoading();
			if (data.success) {
				uni.showToast({
					title: data.message,
					duration: 300,
				})
				useStore().updateLoginUser(() => {
					uni.navigateTo({
						url: '/pages/test/test'
					})
				})
			}

		})
	}
</script>

<style scoped>
	.container {
		padding: 20px 40px;
		border-radius: 5px;
	}

	.title {
		padding: 1rem;
		font-size: 1.6rem;
		text-align: center;
	}

	.input-box {
		margin: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 6px 12px;
	}

	.input-box input {
		width: 100%;
	}

	.btns {
		margin: 1rem;
		padding: 0.2rem;
		display: flex;
		justify-content: center;
	}

	.btns button {
		display: inline-block;
		margin: 0.5rem;
		padding: 0 2rem;
	}
</style>
