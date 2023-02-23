<template>
	<view>
		<view class="">
			<view class="input-box">
				<input type="text" @input="changeInput" v-model="addMessageData.addInfo.title" placeholder="起个好一点的标题吧"
					focus />
			</view>
			<view class="input-box">
				<textarea @input="changeInput" v-model="addMessageData.addInfo.info" placeholder="有什么新的观点？快来说说看" />
			</view>
			<view class="button-box">
				<button @click="addMessage" :loading="addMessageData.loading"
					:disabled="addMessageData.disabled ">发布</button>
			</view>
		</view>
		<messageTbaBar></messageTbaBar>
	</view>
</template>

<script setup lang="ts">
	import messageTbaBar from '../../component/messageTabBar.vue'
	import {
		reactive
	} from 'vue'
	import store from '../../store/index'
	import {
		BaseResult
	} from '../../script/entity/BaseResult'
	import server from '../../script/server'
	const {
		loginUser
	} = store()
	const addMessageData = reactive({
		disabled: false,
		addInfo: {
			title: '',
			info: '',
		},
		loading: false,
	})
	if (!loginUser.isLogin) {
		uni.showToast({
			title: "请登录后进行操作",
			icon: 'none',
			position: 'top'
		})
		addMessageData.disabled = true
	}
	const addMessage = () => {
		addMessageData.loading = true
		server.post('/message/add', addMessageData.addInfo, (data: BaseResult) => {
			addMessageData.loading = false
			if (data.success) {
				uni.showToast({
					title: data.message,
					icon: 'none',
					position: 'top'
				})
			} else {
				uni.showToast({
					title: data.message,
					icon: 'error',
					position: 'top'
				})
			}
		})
	}

	const changeInput = () => {
		if (!loginUser.isLogin) {
			uni.showToast({
				title: "请登录后进行操作",
				icon: 'none',
				position: 'top'
			})
			addMessageData.disabled = true
		} else {
			if (addMessageData.addInfo.info == '' || addMessageData.addInfo.title == '') {
				addMessageData.disabled = true
				return
			} else {
				addMessageData.disabled = false
			}
		}
	}
	changeInput()
</script>

<style scoped>
	.input-box {
		margin: 1rem;
		border: 1px solid #ccc;

		padding: 6px 12px;
	}

	.button-box {
		margin: 1rem;
		border-radius: 5px;
	}
</style>
