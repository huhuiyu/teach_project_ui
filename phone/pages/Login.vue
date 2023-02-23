<template>
	<view class="container">
		<view class="text-box">
			<text class="title">{{toolsData.mode.fristFloor=='login'?'用户登录':'用户注册' }}</text>
		</view>
		<view v-if="toolsData.mode.fristFloor=='login'">
			<form v-if="toolsData.mode.twoFloor.login=='default'">
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
			<form v-else-if="toolsData.mode.twoFloor.login=='phone'">
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
					<button class="button" size='mini' @click="sendPhoneCode('login')"
						:disabled="toolsData.loading.sendPhoneCode">发送验证码</button>
				</view>
				<view class="btns">
					<button @click="phoneLogin" :loading="toolsData.loading.login?true:false" plain>登录</button>
				</view>
			</form>
			<form v-else-if="toolsData.mode.twoFloor.login=='email'">
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.login.email.email" placeholder="请输入邮箱"
						focus />
				</view>
				<view class="inputAndButton">
					<view class="input">
						<input maxlength="6" v-model="userData.login.email.code" placeholder="请输入邮箱验证码" />
					</view>
					<button class="button" size='mini' @click="sendEemilCode('login')"
						:disabled="toolsData.loading.sendEemilCode">发送验证码</button>
				</view>
				<view class="btns">
					<button @click="emailLogin" :loading="toolsData.loading.login?true:false" plain>登录</button>
				</view>
			</form>
		</view>
		<view v-else>
			<form v-if="toolsData.mode.twoFloor.reg=='default'">
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
			<form v-else-if="toolsData.mode.twoFloor.reg=='phone'">
				<view class="input-box">
					<input maxlength="11" class="uni-input" type="text" v-model="userData.reg.phone.phone"
						placeholder="请输入手机号" focus />
				</view>
				<view class="input-box input-boxImg">
					<input maxlength='4' v-model="userData.reg.phone.imgCode" placeholder="请输入图片验证码" />
					<image class="imgCode" @click="queryImgCode" :src="toolsData.imgUrl"></image>
				</view>
				<view class="inputAndButton">
					<view class="input">
						<input maxlength="6" v-model="userData.reg.phone.code" placeholder="请输入手机验证码" />
					</view>
					<button class="button" size='mini' @click="sendPhoneCode('reg')"
						:disabled="toolsData.loading.sendPhoneCode">发送验证码</button>
				</view>
				<view class="btns">
					<button @click="phoneReg" :loading="toolsData.loading.reg?true:false" plain>注册</button>
				</view>
			</form>
			<form v-else-if="toolsData.mode.twoFloor.reg=='email'">
				<view class="input-box">
					<input class="uni-input" type="text" v-model="userData.reg.email.email" placeholder="请输入邮箱" focus />
				</view>
				<view class="inputAndButton">
					<view class="input">
						<input maxlength="6" v-model="userData.reg.email.code" placeholder="请输入邮箱验证码" />
					</view>
					<button class="button" size='mini' @click="sendEemilCode('reg')"
						:disabled="toolsData.loading.sendEemilCode">发送验证码</button>
				</view>
				<view class="btns">
					<button @click="emailReg" :loading="toolsData.loading.reg?true:false" plain>注册</button>
				</view>
			</form>
		</view>
		<view>
			<view class="bottomList" v-if="toolsData.mode.fristFloor=='login'">
				<text v-if="toolsData.mode.twoFloor.login=='default'"
					@click="toolsData.mode.twoFloor.login='phone'">手机登录</text>
				<text v-if="toolsData.mode.twoFloor.login=='email'"
					@click="toolsData.mode.twoFloor.login='default'">账号登录</text>
				<text @click="toolsData.mode.twoFloor.login='email'">邮箱登录</text>
				<text @click="toolsData.mode.fristFloor='reg'">注册</text>
				<text @click="bottomModal">更多选项</text>
			</view>
			<view class="bottomList" v-else>
				<text v-if="toolsData.mode.twoFloor.reg=='default'"
					@click="toolsData.mode.twoFloor.reg='phone'">手机号注册</text>
				<text v-if="toolsData.mode.twoFloor.reg=='email'"
					@click="toolsData.mode.twoFloor.reg='default'">账号注册</text>
				<text @click="toolsData.mode.twoFloor.reg='email'">邮箱注册</text>
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
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import server from '../script/server'
	import tools from '../script/tools'
	import BaseResult from '../script/entity/BaseResult'
	import useStore from '../store/index'
	const toolsData = reactive({
		title: '用户登录',
		mode: {
			fristFloor: 'login',
			twoFloor: {
				reg: 'default',
				login: 'default'
			}
		},
		loading: {
			login: false,
			reg: false,
			sendPhoneCode: false,
			sendEemilCode: false
		},
		imgUrl: '',
		rules: {
			username: new RegExp(/^[a-zA-Z][a-zA-Z0-9_-]{4,16}$/g),
			usernameMessage: '登录名必须是4-16位长度的字母和数字以及_-的组合，必须是字母开头',
			password: new RegExp(/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,16}$/g),
			passwordMessage: '密码由6-16位数字、字母或符号组成 至少含2种以上字符',
			phone: new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/),
			phoneMessage: '请输入正确手机号格式',
			email: new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/),
			emailMessage: '请输入正确的邮箱格式'
		},
		oldUrl: ''
	})
	onLoad((option: any) => {
		if (option.oldUrl) {
			toolsData.oldUrl = option.oldUrl
		} else {
			toolsData.oldUrl = '/pages/message/home'
		}
	})

	const userData = reactive({
		login: {
			default: {
				username: 'LongYa_Shadow',
				password: '030623@gp'
			},
			phone: {
				phone: "",
				code: '',
				imgCode: '',
			},
			email: {
				email: '',
				code: ''
			}
		},
		reg: {
			default: {
				nickname: '',
				username: '',
				password: ''
			},
			phone: {
				phone: "",
				code: '',
				imgCode: '',
			},
			email: {
				email: '',
				code: ''
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
						url: toolsData.oldUrl
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
		if (!tools.regValidate(userData.reg.default.username, toolsData.rules.username)) {
			uni.showToast({
				title: toolsData.rules.usernameMessage,
				duration: 800,
				position: 'top',
				icon: 'error'
			})
			return
		}

		if (userData.reg.default.nickname == '') {
			uni.showToast({
				title: "昵称必须填写",
				duration: 500,
				position: 'top',
				icon: 'error'
			})
			return
		}
		if (!tools.regValidate(userData.reg.default.password, toolsData.rules.password)) {
			uni.showToast({
				title: toolsData.rules.passwordMessage,
				duration: 800,
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
				toolsData.mode.twoFloor.login = 'default'
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
	const sendPhoneCode = (mode: string) => {
		let phone = ''
		let imgCode = ''
		if (mode == 'login') {
			phone = userData.login.phone.phone
			imgCode = userData.login.phone.imgCode
		} else {
			phone = userData.reg.phone.phone
			imgCode = userData.reg.phone.imgCode
		}
		if (!tools.regValidate(phone, toolsData.rules.phone)) {
			uni.showToast({
				title: toolsData.rules.phoneMessage,
				duration: 800,
				icon: 'error'
			})
			return
		} else if (imgCode == '') {
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
			imageCode: imgCode,
			phone: phone
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
		if (!tools.regValidate(userData.login.phone.phone, toolsData.rules.phone)) {
			uni.showToast({
				title: toolsData.rules.phoneMessage,
				duration: 800,
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
						url: toolsData.oldUrl
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
	const phoneReg = () => {
		if (!tools.regValidate(userData.reg.phone.phone, toolsData.rules.phone)) {
			uni.showToast({
				title: toolsData.rules.phoneMessage,
				duration: 800,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.reg.phone.code == '') {
			uni.showToast({
				title: "手机验证码必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.reg = true
		server.post('/user/auth/phoneReg', {
			info: userData.reg.phone.code,
			phone: userData.reg.phone.phone
		}, (data: BaseResult) => {
			toolsData.loading.reg = false
			if (data.success) {
				uni.showToast({
					title: data.message,
					duration: 300,
					icon: 'success'
				})
				useStore().updateLoginUser(() => {
					userData.login.phone.phone = userData.reg.phone.phone
					userData.login.phone.imgCode = userData.reg.phone.imgCode
					userData.login.phone.code = userData.reg.phone.code
					toolsData.mode.fristFloor = 'login'
					toolsData.mode.twoFloor.login = 'phone'
					phoneLogin()
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
	const sendEemilCode = (mode: string) => {
		let email = ''
		if (mode == 'login') {
			email = userData.login.email.email
		} else {
			email = userData.reg.email.email
		}
		if (!tools.regValidate(email, toolsData.rules.email)) {
			uni.showToast({
				title: toolsData.rules.emailMessage,
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.sendEemilCode = true
		server.post('/tool/sendEmailCode', {
			email: email
		}, (data: BaseResult) => {
			toolsData.loading.sendEemilCode = false
			uni.showToast({
				title: data.message,
				duration: 300,
				icon: 'none'
			})

		})
	}
	const emailLogin = () => {
		if (!tools.regValidate(userData.reg.email.email, toolsData.rules.email)) {
			uni.showToast({
				title: toolsData.rules.emailMessage,
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.login.email.code == '') {
			uni.showToast({
				title: "邮箱验证码必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.login = true
		server.post('/user/auth/emailLogin', {
			email: userData.login.email.email,
			info: userData.login.email.code
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
						url: toolsData.oldUrl
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
	const emailReg = () => {
		if (!tools.regValidate(userData.reg.email.email, toolsData.rules.email)) {
			uni.showToast({
				title: toolsData.rules.emailMessage,
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		} else if (userData.reg.email.code == '') {
			uni.showToast({
				title: "邮箱验证码必须填写",
				duration: 300,
				position: 'top',
				icon: 'error'
			})
			return
		}
		toolsData.loading.reg = true
		server.post('/user/auth/emailReg', {
			email: userData.reg.email.email,
			info: userData.reg.email.code
		}, (data: BaseResult) => {
			toolsData.loading.reg = false
			if (data.success) {
				uni.showToast({
					title: data.message,
					duration: 300,
					icon: 'success'
				})
				userData.login.email.code = userData.reg.email.code
				userData.login.email.email = userData.reg.email.email
				toolsData.mode.fristFloor = 'login'
				toolsData.mode.twoFloor.login = 'email'
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
			// 字体颜色·
			itemColor: "#55aaff",
			success(res: any) {
				// 选择其中任意一项后，获取其索引（res.tapIndex），从0开始
				if (res.tapIndex === 0) {
					uni.navigateTo({
						url: '/pages/findPwd'
					})
				}
			},
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
		padding: 1rem 0.8rem;
		font-size: 12rpx
	}

	.imgCode {
		width: 80px;
		height: 22px;
		object-fit: contain;
		overflow: hidden;
	}
</style>
