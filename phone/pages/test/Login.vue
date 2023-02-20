<template>
	<view class="container">
		<view class="text-box">
			<text class="title">{{toolsData.mode.fristFloor=='login'?'用户登录':'用户注册' }}</text>
		</view>
		<view v-if="toolsData.mode.fristFloor=='login'">
			<form>
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.login.default.username" placeholder="用户名"
						focus />
				</view>
				<view class="input-box">
					<input v-model="userData.login.default.password" placeholder="密码" password />
				</view>
				<view class="smallText">
					<span>忘记了？找回密码</span>
				</view>
				<view class="btns">
					<button @click="login" :loading="toolsData.loading.login?true:false" plain>登录</button>
				</view>
			</form>
		</view>
		<view v-else>
			<form>
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.reg.default.username" placeholder="用户名"
						focus />
				</view>
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.reg.default.nickname" placeholder="昵称"
						focus />
				</view>
				<view class="input-box">
					<input v-model="userData.reg.default.password" placeholder="密码" password />
				</view>
				<view class="btns">
					<button @click="register" :disabled="toolsData.loading.reg?true:false" plain>注册</button>
				</view>
			</form>
		</view>
		<view class="bottomList">
			<text>手机号登录</text>
			<text v-if="toolsData.mode.fristFloor=='login'" @click="toolsData.mode.fristFloor='reg'">注册</text>
			<text v-else @click="toolsData.mode.fristFloor='login'">登录</text>
			<text>更多选项</text>
		</view>
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
		mode: {
			fristFloor: 'login',
			twoFloor: 'default'
		},
		loading: {
			login: false,
			reg: false
		}
	})
	const userData = reactive({
		login: {
			default: {
				username: '',
				password: ''
			}
		},
		reg: {
			default: {
				nickname: '',
				username: '',
				password: ''
			}
		}
	})
	const login = () => {
		toolsData.loading.login = true
		userData.login.default.password = tools.md5(userData.login.default.password)
		server.post('/user/auth/login', userData.login.default, (data: BaseResult) => {
			toolsData.loading.login = false
			uni.showToast({
				title: data.message,
				duration: 300,
			})
			if (data.success) {
				useStore().updateLoginUser(() => {
					uni.navigateTo({
						url: '/pages/test/test'
					})
				})
			}

		})
	}

	const register = () => {
		toolsData.loading.reg = true
		let result = userData.reg.default.password
		userData.reg.default.password = tools.md5(userData.reg.default.password)
		server.post('/user/auth/reg', userData.reg.default, (data: BaseResult) => {
			toolsData.loading.reg = false
			uni.showToast({
				title: data.message,
				duration: 300,
			})
			if (data.success) {
				userData.login.default.username = userData.reg.default.username
				userData.login.default.password = result
				userData.reg.default.password = ''
				toolsData.mode.fristFloor = 'login'
				login()
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
		font-size: 1.3rem;
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

	.smallText {
		font-size: 12px;
		text-align: right;
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
		width: 100%;
		letter-spacing: 1px;
	}

	.bottomList {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		padding: 1rem 1.5rem;
		font-size: 14px;
	}
</style>
