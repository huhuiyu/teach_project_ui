<template>
	<view>
		<!-- 第一步-找回模式 -->
		<view v-if="toolsData.step==1">
			<view class="title">
				<text @click="jumpLogin">登录/</text> <text>找回方式</text>
			</view>
			<view class="input-box" v-if="toolsData.phoneOrEeail">
				<input type="text" v-model="phoneInfo.username" maxlength="16" placeholder="请输入用户名" />
			</view>
			<view class="input-box" v-if="!toolsData.phoneOrEeail">
				<input type="text" v-model="emailInfo.username" maxlength="16" placeholder="请输入用户名" />
			</view>
			<view class="button-box">
				<button plain @click="modeNext">下一步</button>
			</view>
			<view class="mode" @click="changeMode">
				<text>通过{{!toolsData.phoneOrEeail?'手机':'邮箱'}}找回密码</text>
			</view>

		</view>

		<!-- 手机找回 第二步 -->
		<view v-if="toolsData.mode=='phone'">
			<view class="title" v-if="toolsData.step==2||toolsData.step==3">
				<text @click="toolsData.step=1">找回方式/</text> <text>手机找回</text>
			</view>
			<view v-if="toolsData.step==2">
				<view class="input-box">
					<input type="text" :value="phoneInfo.username" disabled />
				</view>
				<view class="input-box input-boxImg">
					<input maxlength='4' v-model="phoneInfo.imgCode" placeholder="请输入图片验证码" />
					<image class="imgCode" @click="queryImgCode" :src="toolsData.imgUrl"></image>
				</view>
				<view class="button-box">
					<button plain :disabled="phoneInfo.imgCode==''?true:false" @click="sendPhoneCode"
						:loading="toolsData.loading.sendPhoneCode">发送手机验证码</button>
				</view>
			</view>
			<view v-if="toolsData.step==3">
				<view class="input-box">
					<input type="text" v-model="phoneInfo.code" maxlength="6" placeholder="请输入手机验证码" />
				</view>
				<view class="input-box">
					<input password v-model="phoneInfo.password" placeholder="请输入密码" />
				</view>
				<view class="input-box">
					<input password v-model="phoneInfo.okPwd" placeholder="请再次输入密码" />
				</view>
				<view class="button-box">
					<button @click="updatePwdByPhone" :loading="toolsData.loading.phonePwd" plain>修改密码</button>
				</view>
			</view>
		</view>
		<!-- 邮箱找回 -->
		<view v-if="toolsData.mode=='email'">
			<view class="title" v-if="toolsData.step==2||toolsData.step==3">
				<text @click="toolsData.step=1">找回方式/</text> <text>邮箱找回</text>
			</view>
			<view v-if="toolsData.step==2">
				<view class="input-box">
					<input type="text" :value="emailInfo.username" disabled />
				</view>
				<view class="inputAndButton">
					<view class="input">
						<input maxlength="6" v-model="emailInfo.code" placeholder="请输入邮箱验证码" />
					</view>
					<button class="button" size='mini' @click="sendEmailCode"
						:loading="toolsData.loading.sendPhoneCode">发送验证码</button>
				</view>
				<view class="button-box">
					<button plain :disabled="emailInfo.code==''?true:false" @click="toolsData.step=3">下一步</button>
				</view>
			</view>
			<view v-if="toolsData.step==3">
				<view class="input-box">
					<input password v-model="emailInfo.password" placeholder="请输入密码" />
				</view>
				<view class="input-box">
					<input password v-model="emailInfo.okPwd" placeholder="请再次输入密码" />
				</view>
				<view class="button-box">
					<button @click="updatePwdByEmail" :loading="toolsData.loading.emailPwd">修改密码</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from 'vue'
	import BaseResult from '../script/entity/BaseResult';
	import server from '../script/server';
	import tools from '../script/tools';
	const toolsData = reactive({
		mode: "phone",
		step: 1,
		phoneOrEeail: false, //true为手机
		imgUrl: '',
		loading: {
			sendPhoneCode: false,
			phonePwd: false,
			emailPwd: false,
			sendEmailCode: false
		}
	})
	//手机号找回密码参数
	const phoneInfo = reactive({
		username: '',
		password: '',
		imgCode: '',
		code: '',
		okPwd: '',
	})
	//邮箱找回密码参数
	const emailInfo = reactive({
		code: '',
		username: '',
		password: '',
		okPwd: '',
	})

	// 查询图片验证码
	const queryImgCode = () => {
		server.post('/tool/getImageCode', {}, (data: BaseResult) => {
			toolsData.imgUrl = data.message
		})
	}
	queryImgCode()
	//发送手机验证码
	const sendPhoneCode = () => {
		toolsData.loading.sendPhoneCode = true
		server.post('/tool/sendUserValidateCode', {
			imageCode: phoneInfo.imgCode,
			username: phoneInfo.username
		}, (data: BaseResult) => {
			toolsData.loading.sendPhoneCode = false
			if (data.success) {
				toolsData.step = 3
				uni.showToast({
					title: data.message,
					icon: 'none'
				})
			} else {
				uni.showToast({
					title: data.message,
					icon: 'error'
				})
				queryImgCode()
				phoneInfo.imgCode = ''
				if (data.message == '验证码长期有效，无需重复发送') {
					toolsData.step = 3
					return
				}
			}
		})

	}
	//手机找回修改密码
	const updatePwdByPhone = () => {
		toolsData.loading.phonePwd = true
		server.post(
			'/user/auth/findPwdByPhone', {
				code: phoneInfo.code,
				username: phoneInfo.username,
				password: tools.md5(phoneInfo.password),
			},
			(data: BaseResult) => {
				toolsData.loading.phonePwd = false
				if (data.success) {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					phoneInfo.password = ''
					phoneInfo.okPwd = ''
				} else {
					uni.showToast({
						title: data.message,
						icon: 'error'
					})
				}
				phoneInfo.password = ''
				phoneInfo.okPwd = ''
			}
		)
	}

	//发送邮箱验证码
	function sendEmailCode() {
		toolsData.loading.sendEmailCode = true
		server.post(
			'/tool/sendUserEmailCode', {
				username: emailInfo.username,
			},
			(data: BaseResult) => {
				toolsData.loading.sendEmailCode = false
				if (data.success) {
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
			}
		)
	}
	//邮箱找回修改密码
	const updatePwdByEmail = () => {
		toolsData.loading.emailPwd = true
		server.post(
			'/user/auth/findPwdByEmail', {
				code: emailInfo.code,
				username: emailInfo.username,
				password: tools.md5(emailInfo.password),
			},
			(data: BaseResult) => {
				toolsData.loading.emailPwd = false
				if (data.success) {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
					emailInfo.password = ''
					emailInfo.okPwd = ''
				} else {
					uni.showToast({
						title: data.message,
						icon: 'error'
					})
				}
			}

		)
	}

	//切换找回模式
	const changeMode = () => {
		toolsData.phoneOrEeail = !toolsData.phoneOrEeail
		phoneInfo.username = ''
		emailInfo.username = ''
	}
	//根据找回模式判断下一步
	function modeNext() {
		if (toolsData.phoneOrEeail) {
			if (phoneInfo.username == '') {
				uni.showToast({
					title: '请输入用户名',
					icon: 'none'
				})
				return
			}
			toolsData.mode = 'phone'
			toolsData.step = 2
		} else {
			if (emailInfo.username == '') {
				uni.showToast({
					title: '请输入用户名',
					icon: 'none'
				})
				return
			}
			toolsData.mode = 'email'
			toolsData.step = 2
		}
	}
	const jumpLogin = () => {
		uni.navigateTo({
			url: '/pages/Login'
		})
	}
</script>

<style scoped>
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
		padding: 3px 12px;
	}

	.imgCode {
		width: 80px;
		height: 22px;
		object-fit: contain;
		overflow: hidden;
	}

	.button-box {
		margin: 1rem;
		border-radius: 5px;
		padding: 3px 12px;
	}

	.mode {
		font-size: 14px;
		position: fixed;
		left: 50%;
		transform: translate(-50%);
		bottom: 2rem;
	}

	.title {
		margin: 1rem;
		padding-left: 4px;
		border-left: 1px solid #000;
		display: inline-block;
	}
</style>
