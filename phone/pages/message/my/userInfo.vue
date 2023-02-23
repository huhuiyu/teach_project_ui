<template>
	<view>
		<view class="list" v-if="toolsData.sleceted=='default'">
			<view class="list_item" v-for="d in toolsData.list" :key="d.id" @click="selceted(d.id)">
				<view>
					<text>{{d.text}}</text>
				</view>
				<view class="iconfont arrow">&#xe615; </view>
			</view>
		</view>
		<view v-if="toolsData.sleceted=='nickname'">
			<view class="input-box" v-if="toolsData.sleceted=='nickname'">
				<input type="text" maxlength="12" v-model="userInfo.nickname" placeholder="请输入昵称" />
			</view>
		</view>
		<view class="input-box" v-if="toolsData.sleceted=='sex'">
			<radio-group class="uni-list" @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd">
					<view>
						<radio value="n" :checked='userInfo.sex=="n"'></radio>
					</view>
					<view>
						<label class="label-2-text">
							<text>保密</text>
						</label>
					</view>
				</label> <label class="uni-list-cell uni-list-cell-pd">
					<view>
						<radio value="m" :checked='userInfo.sex=="m"'></radio>
					</view>
					<view>
						<label class="label-2-text">
							<text>男</text>
						</label>
					</view>
				</label> <label class="uni-list-cell uni-list-cell-pd">
					<view>
						<radio value="f" :checked='userInfo.sex=="f"'></radio>
					</view>
					<view>
						<label class="label-2-text">
							<text>女</text>
						</label>
					</view>
				</label>
			</radio-group>
		</view>
		<view class="input-box" v-if="toolsData.sleceted=='wechat'">
			<input type="text" maxlength="12" v-model="userInfo.wechat" placeholder="请输入微信" />
		</view>
		<view class="input-box" v-if="toolsData.sleceted=='qq'">
			<input type="text" maxlength="10" v-model="userInfo.qq" placeholder="请输入qq" />
		</view>
		<view class="input-box" v-if="toolsData.sleceted=='info'">
			<input type="text" v-model="userInfo.info" placeholder="请输入描述" />
		</view>
		<view v-if="toolsData.sleceted!='default'">
			<button @click="modifyUserInfo">保存</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive,
	} from 'vue'
	import BaseResult, {
		BaseUserInfoResult
	} from '../../../script/entity/BaseResult'
	import server from '../../../script/server'
	import store from '../../../store';
	// import store from '../../../store/index'
	// const {
	// 	loginUser
	// } = store()
	const toolsData = reactive({
		username: 'longya_shadow',
		sleceted: 'default',
		loading: false,
		list: [{
				id: 'sex',
				text: "性别",
			},
			{
				id: 'nickname',
				text: "昵称",
			},
			{
				id: 'wechat',
				text: "微信",
			},
			{
				id: 'qq',
				text: "QQ",
			},
			{
				id: 'info',
				text: "个人描述",
			}
		]
	})
	const userInfo = reactive({
		img: '',
		nickname: '',
		qq: '',
		wechat: '',
		info: '',
		sex: '',
		mineFollow: false,
	})
	//单选框变化
	const radioChange = (e: any) => {

		userInfo.sex = e.detail.value
	}
	//查询用户信息
	const queryUserInfoByUsername = () => {
		server.post('/user/auth/getUserInfoByName', {
			username: toolsData.username
		}, (data: BaseUserInfoResult) => {
			if (data.success) {
				userInfo.img = data.tbUserInfo.img
				userInfo.nickname = data.tbUser.nickname
				userInfo.qq = data.tbUserInfo.qq
				userInfo.wechat = data.tbUserInfo.wechat
				userInfo.info = data.tbUserInfo.info
				userInfo.sex = data.tbUserInfo.sex
				userInfo.mineFollow = data.userOtherInfo.mineFollow
			}
		})
	}
	queryUserInfoByUsername()
	const modifyUserInfo = () => {
		toolsData.loading = true
		server.post('/user/auth/updateUserInfo', userInfo, (data: BaseResult) => {
			toolsData.loading = false
			if (data.success) {
				store().updateLoginUser(() => {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
				})
			} else {
				uni.showToast({
					title: data.message,
					icon: 'error'
				})
			}
		})
	}
	//点击列表跳转
	const selceted = (info: string) => {
		for (let key in userInfo) {
			if (key == info) {
				toolsData.sleceted = info
			}
		}
	}
</script>

<style scoped>
	@import url("../../../static/iconfont/iconfont.css");

	.input-box {
		margin: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 6px 12px;
	}


	.input-box .uni-list {
		display: flex;
	}

	.uni-list .uni-list-cell {
		margin: 0 1rem;
	}

	.iconfont.arrow {
		transform: rotateY(180deg);
	}

	.top>view:first-child {
		display: flex;
	}

	.list {
		padding: 40rpx 30rpx 20rpx;
	}

	.list .list_item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px 0;
		border-bottom: 1px solid #bdbdbd;
	}


	.iconfont>text {
		font-size: 14px;
	}
</style>
