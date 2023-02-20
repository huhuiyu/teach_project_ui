<template>
	<view class="container">
		<view class="text-box">
			<text class="title">{{toolsData.mode.fristFloor=='login'?'用户登录':'用户注册' }}</text>
		</view>
		<view v-if="toolsData.mode.fristFloor=='login'">
			<form v-if="toolsData.mode.twoFloor=='default'">
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.login.default.username" placeholder="请输入用户名"
						focus />
				</view>
				<view class="input-box">
					<input v-model="userData.login.default.password" placeholder="请输入密码" password />
				</view>
				<view class="btns">
					<button @click="login" :loading="toolsData.loading.login?true:false" plain>登录</button>
				</view>
			</form>
			<form v-else-if="toolsData.mode.twoFloor=='phone'">
				<view class="input-box">
					<input maxlength="11" class="uni-input" type="text" v-model="userData.login.phone.phone"
						placeholder="请输入手机号" focus />
				</view>
				<view class="input-box input-boxImg">
					<input maxlength='4' v-model="userData.login.phone.imgCode" placeholder="请输入图片验证码" />
					<image class="imgCode" @click="queryImgCode" :src="toolsData.imgUrl"></image>
				</view>
				<view class="inputAndButton">
					<view class="input">
						<input maxlength="6" v-model="userData.login.phone.code" placeholder="请输入手机验证码" />
					</view>
					<button class="button" size='mini' @click="sendPhoneCode"
						:disabled="toolsData.loading.sendPhoneCode">发送验证码</button>
				</view>
				<view class="btns">
					<button @click="phoneLogin" :loading="toolsData.loading.login?true:false" plain>登录</button>
				</view>
			</form>
		</view>
		<view v-else>
			<form>
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.reg.default.username" placeholder="请输入用户名"
						focus />
				</view>
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.reg.default.nickname" placeholder="请输入昵称"
						focus />
				</view>
				<view class="input-box">
					<input v-model="userData.reg.default.password" placeholder="请输入密码" password />
				</view>
				<view class="btns">
					<button @click="register" :disabled="toolsData.loading.reg?true:false" plain>注册</button>
				</view>
			</form>
		</view>
		<view>
			<view class="bottomList" v-if="toolsData.mode.fristFloor=='login'">
				<text v-if="toolsData.mode.twoFloor=='default'" @click="toolsData.mode.twoFloor='phone'">手机号登录</text>
				<text v-if="toolsData.mode.twoFloor=='phone'" @click="toolsData.mode.twoFloor='default'">账号登录</text>
				<text @click="toolsData.mode.fristFloor='reg'">新用户注册</text>
				<text @click="bottomModal">更多选项</text>
			</view>
			<view class="bottomList" v-else>
				<text>手机号注册</text>
				<text @click="toolsData.mode.fristFloor='login'">用户登录</text>
				<text @click="bottomModal">更多选项</text>
			</view>

		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	import server from '../script/server'
	import tools from '../script/tools'
	import BaseResult from '../script/entity/BaseResult'
	import useStore from '../store/index'
	const toolsData = reactive({
		title: '用户登录',
		mode: {
			fristFloor: 'login',
			twoFloor: 'default'
		},
		loading: {
			login: false,
			reg: false,
			sendPhoneCode: false,


		},
		imgUrl: ''
	})
	const userData = reactive({
		login: {
			default: {
				username: '',
				password: ''
			},
			phone: {
				phone: "",
				code: '',
				imgCode: '',
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
		if (userData.login.default.username == '') {
			uni.showToast({
				title: "用户名必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.login.default.password == '') {
			uni.showToast({
				title: "密码必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.login = true
		userData.login.default.password = tools.md5(userData.login.default.password)
		server.post('/user/auth/login', userData.login.default, (data: BaseResult) => {
			toolsData.loading.login = false

			if (data.success) {
				uni.showToast({
					title: data.message,
					duration: 300,
					icon: 'success'
				})
				useStore().updateLoginUser(() => {
					uni.navigateTo({
						url: '/pages/test/test'
					})
				})
			} else {
				uni.showToast({
					title: data.message,
					duration: 300,
					icon: 'error'
				})
				userData.login.default.password = ''
			}

		})
	}

	const register = () => {
		if (userData.reg.default.username == '') {
			uni.showToast({
				title: "用户名必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.reg.default.nickname == '') {
			uni.showToast({
				title: "昵称必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.reg.default.password == '') {
			uni.showToast({
				title: "密码必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.reg = true
		let result = userData.reg.default.password
		userData.reg.default.password = tools.md5(userData.reg.default.password)
		server.post('/user/auth/reg', userData.reg.default, (data: BaseResult) => {
			toolsData.loading.reg = false

			if (data.success) {
				userData.login.default.username = userData.reg.default.username
				userData.login.default.password = result
				userData.reg.default.password = ''
				toolsData.mode.fristFloor = 'login'
				login()
			} else {
				uni.showToast({
					title: data.message,
					duration: 300,
					icon: 'error'
				})
			}

		})
	}
	const queryImgCode = () => {
		server.post('/tool/getImageCode', {}, (data: BaseResult) => {
			toolsData.imgUrl = data.message
		})
	}
	queryImgCode()
	const sendPhoneCode = () => {
		if (userData.login.phone.phone == '') {
			uni.showToast({
				title: "手机号必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.login.phone.imgCode == '') {
			uni.showToast({
				title: "图片验证必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.sendPhoneCode = true
		server.post('/tool/sendValidateCode', {
			imageCode: userData.login.phone.imgCode,
			phone: userData.login.phone.phone
		}, (data: BaseResult) => {
			toolsData.loading.sendPhoneCode = false
			uni.showToast({
				title: data.message,
				duration: 300,
				icon: 'error'
			})
			if (!data.success) {
				queryImgCode()
			}
		})
	}
	const phoneLogin = () => {
		if (userData.login.phone.phone == '') {
			uni.showToast({
				title: "手机号必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.login.phone.code == '') {
			uni.showToast({
				title: "手机验证码必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.login = true
		server.post('/user/auth/phoneLogin', {
			info: userData.login.phone.code,
			phone: userData.login.phone.phone
		}, (data: BaseResult) => {
			toolsData.loading.login = false
			if (data.success) {
				uni.showToast({
					title: data.message,
					duration: 300,
					icon: 'success'
				})
				useStore().updateLoginUser(() => {
					uni.navigateTo({
						url: '/pages/test/test'
					})
				})
			} else {
				uni.showToast({
					title: data.message,
					duration: 300,
					icon: 'error'
				})
			}
		})
	}
	const bottomModal = () => {
		uni.showActionSheet({
			itemList: ['找回密码', '问题反馈'],
			// 字体颜色
			itemColor: "#55aaff",
			success(res: any) {
				// 选择其中任意一项后，获取其索引（res.tapIndex），从0开始
				console.log(res.tapIndex)
			},
			fail(res: any) {
				// 取消后的操作
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

	.input-boxImg {
		display: flex;
		align-items: center;
	}

	.input-box input {
		width: 100%;
	}

	.inputAndButton {
		display: flex;
		align-items: center;
		margin: 1rem;
	}

	.inputAndButton .input {
		border-radius: 5px;
		border: 1px solid #ccc;
		padding: 6px 12px;
		flex: 2;
	}

	.inputAndButton .button {
		flex: 1;
		padding: 4px 12px;
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
		padding: 1rem;
		font-size: 12px
	}

	.imgCode {
		width: 80px;
		height: 22px;
		object-fit: contain;
		overflow: hidden;
	}
</style>
