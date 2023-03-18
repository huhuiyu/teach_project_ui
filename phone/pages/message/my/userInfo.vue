<template>
	<view>
		<view class="list" v-if="toolsData.sleceted=='default'">
			<view class="list_item" v-for="d in toolsData.list" :key="d.id" @click="selceted(d.id)">
				<view>
					<text>{{d.text}}</text>
				</view>
				<view style="display: flex;align-items: center;">
					<view v-if="d.id=='avatar'">
						<image :src="d.value" style="width:40px;height: 40px;margin-right: 5px;" lazy-load>
						</image>
					</view>
					<view v-else style="margin-right: 5px;">
						{{d.value}}
					</view>
					<view class="iconfont arrow">&#xe615; </view>
				</view>
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
		computed,
		reactive,
	} from 'vue'
	import BaseResult, {
		BaseDataResult,
		BaseUserInfoResult
	} from '../../../script/entity/BaseResult'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import server from '../../../script/server'
	import tools from '../../../script/tools';
	import store from '../../../store/index'
	import logger from '../../../script/logger';
	import {
		FileInfoResult
	} from '../../../script/entity/FileInfoResult';
	const {
		loginUser
	} = store()
	const user = computed(() => loginUser)
	const toolsData = reactive({
		username: '',
		sleceted: 'default',
		loading: false,
		list: [{
				id: 'avatar',
				text: "头像",
				value: user.value.tbUserInfo.img
			}, {
				id: 'sex',
				text: "性别",
				value: tools.sexReverse(user.value.tbUserInfo.sex)
			},
			{
				id: 'nickname',
				text: "昵称",
				value: user.value.tbUser.nickname
			},
			{
				id: 'wechat',
				text: "微信",
				value: user.value.tbUserInfo.wechat
			},
			{
				id: 'qq',
				text: "QQ",
				value: user.value.tbUserInfo.qq
			},
			{
				id: 'info',
				text: "个人描述",
			}
		],
		file: null
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
	onLoad((option: any) => {
		if (option.username) {
			toolsData.username = option.username
			queryUserInfoByUsername()
		} else {
			uni.navigateTo({
				url: '/pages/message/personalHome'
			})
		}
	})

	console.log(toolsData.list);
	//打开文件
	const openImg = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album'],
			extension: ['image'],
			success: function(res) {
				console.log('files===》', res.tempFiles, res.tempFilePaths);
				toolsData.file = res.tempFiles[0]
				upload()
			}
		})
	}

	//上传文件，修改头像，删除之前头像
	const upload = () => {
		if (toolsData.file == null) {
			return
		}
		let fid = server.isDownloadUrl(userInfo.img)
		server.upload(
			toolsData.file, {
				fileinfo: loginUser.tbUser.nickname + '的头像',
			},
			(data: BaseDataResult < FileInfoResult > ) => {
				if (data.success) {
					userInfo.img = server.getDownloadUrl(data.data.fid)
					modifyUserInfo()
					if (fid != -1) {
						server.post('/user/file/delete', {
							fid
						}, (data: any) => {
							logger.debug(data)
						})
					}
				}
			}
		)
	}

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
		if (info == 'avatar') {
			openImg()
			return
		}
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
