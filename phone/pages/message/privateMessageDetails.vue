<template>
	<page-meta>
		<navigation-bar :title="privateMessageByUserData.nickname" background-color="#f1f1f1" front-color="#000000" />
	</page-meta>
	<view class="container">
		<view v-for="d in privateMessageByUserData.list" :key="d.lastupdate">
			<view class="box" v-if="d.from == privateMessageByUserData.username">
				<image class="avatar"
					:src="privateMessageByUserData.img?privateMessageByUserData.img:toolsData.lazyImg">
				</image>
				<view class="content is-you">
					<text> {{d.info}}</text>
				</view>
			</view>
			<view v-if="d.from == loginUser.tbUser.username" class="box" style="justify-content: end;">
				<view class="content is-me">
					<text> {{d.info}}</text>
				</view>
				<image class="avatar" :src="loginUser.tbUserInfo.img?loginUser.tbUserInfo.img:toolsData.lazyImg">
				</image>
			</view>
		</view>
		<view class="inputAndButton">
			<view class="input">
				<textarea v-model="sendMessageData.info" auto-height></textarea>
			</view>
			<view class="button">
				<button size="mini" type="primary" @click="sendMessage">发送</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		BaseListResult,
		BaseResult
	} from "../../script/entity/BaseResult";
	import {
		PrivateMessage
	} from "../../script/entity/MessageDetailResult";
	import server from "../../script/server";
	import store from '../../store/index'
	const {
		loginUser
	} = store()
	const toolsData = reactive({
		loading: {
			sendMessage: false
		},
		lazyImg: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'
	})
	const privateMessageByUserData = reactive({
		username: '',
		nickname: '',
		img: "",
		list: [] as PrivateMessage[],
	})
	//初始化获取username
	onLoad((option: any) => {
		if (option.username && option.nickname) {
			privateMessageByUserData.username = option.username
			privateMessageByUserData.nickname = option.nickname
			privateMessageByUserData.img = option.img
			queryPrivateMessageByUser()
		} else {
			uni.navigateTo({
				url: '/pages/message/privateMessage'
			})
		}
	})
	//查询当前登录用户和指定用户的私信信息
	const queryPrivateMessageByUser = () => {
		server.post('/user/auth/findPrivateMessageByUser', {
			username: privateMessageByUserData.username
		}, (data: BaseListResult < PrivateMessage > ) => {
			privateMessageByUserData.list = data.list
			//成功查询后，不管是否查看，都为已读
			readPrivateMessageByUser(privateMessageByUserData.username, data.list[data.list.length - 1].read)
		})
	}

	//已读私信，更新
	const readPrivateMessageByUser = (username: string, read: boolean) => {
		if (!read) {
			server.post('/user/auth/readPrivateMessageByUser', {
				username: username
			}, () => {})
		}
	}

	const sendMessageData = reactive({
		info: '',
		username: '',
	})
	//发送私信
	const sendMessage = () => {
		sendMessageData.username = privateMessageByUserData.username
		toolsData.loading.sendMessage = true
		server.post('/user/auth/sendMesage', sendMessageData, (data: BaseResult) => {
			if (data.success) {
				queryPrivateMessageByUser()
				sendMessageData.info = ''
			}
		})
		toolsData.loading.sendMessage = false
	}
</script>

<style scoped>
	.container {
		background-color: rgb(250, 250, 252);
		min-height: 100vh;
		padding-bottom: 3rem;
	}

	.box {
		display: flex;
		margin: 10px;

	}

	.avatar {
		border-radius: 15rpx;
		width: 65rpx;
		height: 65rpx;
		object-fit: cover;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.box .content {
		max-width: 70%;
		padding: 5rpx 10rpx;
		word-break: break-all;
		border: 1px solid rgb(239, 239, 245);
		background-color: white;
	}



	.is-me {
		border-radius: 12rpx 0 12rpx 12rpx;
		border-top-left-radius: 12rpx;
		border-top-right-radius: 0px;
		border-bottom-right-radius: 12rpx;
		border-bottom-left-radius: 12rpx;
	}

	.is-you {
		border-radius: 12rpx 12rpx 12rpx 0px;
		border-top-right-radius: 12rpx;
		border-top-left-radius: 0px;
		border-bottom-right-radius: 12rpx;
		border-bottom-left-radius: 12rpx;
	}

	.inputAndButton {
		display: flex;
		align-items: center;
		width: 100vw;
		padding: 0.5rem 1rem;
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		background-color: white;
		border-top: 1px solid #ccc;
	}

	.inputAndButton .input {
		border-radius: 5px;
		border: 1px solid #ccc;
		padding: 6px 12px;
		width: 70%;
		word-break: break-all;
	}

	.input textarea {
		width: 100%;
	}

	.inputAndButton .button {
		width: 30%;
		display: flex;
		align-items: center;
		margin-right: 15px;
	}
</style>
