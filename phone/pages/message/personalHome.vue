<template>
	<view>
		<view class="top">
			<view>
				<view class="avatar">
					<image class="avatar"
						:src="userInfo.img?userInfo.img:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
					</image>
				</view>
				<view class="userinfo">
					<text>{{userInfo.nickname}}</text>
					<text>{{toolsData.username}}</text>
				</view>
			</view>
			<view v-if="toolsData.username==loginUser.tbUser.username" class="iconfont arrow" @click="selceted(0)">
				&#xe615; </view>
			<view class="btns" v-if="toolsData.username!=loginUser.tbUser.username">
				<button size="mini" plain @click="followUser(toolsData.username)" :type="userInfo.mineFollow?'primary':'default'
					">{{ userInfo.mineFollow ? '已关注' : '关注' }}</button>
				<button size="mini" plain @click="addFriend">加好友</button>
			</view>
		</view>
		<view class="list">
			<view class="list_item" v-for="d in toolsData.list" :key="d.id" @click="selceted(d.id)">
				<view class="infoIcon">
					<view class="iconfont" v-html="d.icon"> </view>
					<text>{{d.text}}</text>
				</view>
				<view class="iconfont arrow">&#xe615; </view>
			</view>
		</view>
		<view v-if="toolsData.username != loginUser.tbUser.username">
			<view class="hr"></view>
			<view class="privateMessage" @click="jumpPrivateMessage">
				<view class="iconfont">&#xe89c;</view><text>私信</text>
			</view>
		</view>
		<messageTbaBar v-if="toolsData.username==loginUser.tbUser.username"></messageTbaBar>
	</view>
</template>

<script setup lang="ts">
	import messageTbaBar from '../../component/messageTabBar.vue'
	import {
		reactive,
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";

	import {
		BaseUserInfoResult,
		BaseResult
	} from '../../script/entity/BaseResult'
	import server from '../../script/server'
	import store from '../../store/index'
	const {
		loginUser
	} = store()
	onLoad((option: any) => {
		if (option.username) {
			toolsData.username = option.username
		} else {
			if (loginUser.isLogin) {
				toolsData.username = loginUser.tbUser.username
			} else {
				uni.showModal({
					title: '请登录后访问！！！',
					content: "是否跳转登录",
					success: (res: any) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/Login?oldUrl=' + OLD_URL
							})
						} else if (res.cancel) {
							uni.navigateTo({
								url: '/pages/message/home'
							})
							return
						}
					},

				})
				return
			}
			if (toolsData.username == loginUser.tbUser.username) {
				toolsData.list = toolsData.list.concat(toolsData.loginList)
				console.log(toolsData.list);

			}
		}
		queryUserInfoByUsername()
	})
	const OLD_URL = '/pages/message/personalHome'
	const toolsData = reactive({
		loading: {
			follow: false
		},
		username: '',
		loginList: [{
				id: 3,
				text: "好友",
				icon: '&#xe696;'
			},
			{
				id: 6,
				text: "退出登录",
				icon: '&#xe79c;'
			}
		],
		list: [{
				id: 1,
				text: "留言",
				icon: '&#xe89c;'
			},
			{
				id: 2,
				text: "评论",
				icon: '&#xe630;'
			},
			{
				id: 4,
				text: "粉丝",
				icon: '&#xe6da;'
			},
			{
				id: 5,
				text: "关注",
				icon: '&#xe71c;'
			},

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
	// 关注或取消关注用户
	const followUser = (username: string) => {
		if (!loginUser.isLogin) {
			uni.showModal({
				title: '请登录后再操作！！！',
				content: "是否跳转登录",
				success: (res: any) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/Login?oldUrl=' + OLD_URL
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
						return
					}
				},
			})
			return
		}
		toolsData.loading.follow = true
		server.post('/message/followUser', {
			username
		}, () => {
			toolsData.loading.follow = false
			queryUserInfoByUsername()
		})
	}
	//添加好友
	const addFriend = () => {
		if (!loginUser.isLogin) {
			uni.showModal({
				title: '请登录后再操作！！！',
				content: "是否跳转登录",
				success: (res: any) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/Login?oldUrl=' + OLD_URL
						})
					} else if (res.cancel) {
						console.log('用户点击取消');
						return
					}
				},
			})
			return
		}
		server.post('/user/auth/friend', {
			username: toolsData.username
		}, (data: BaseResult) => {
			if (data.success) uni.showToast({
				title: data.message,
				icon: 'none'
			})
		})
	}
	//退出登录
	const logOut = () => {
		uni.showModal({
			title: '提示',
			content: '确定退出登录',
			success: function(res) {
				if (res.confirm) {
					server.post('/user/auth/logout', {}, function() {
						store().updateLoginUser(() => {
							uni.navigateTo({
								url: '/pages/Login'
							})
						})
					})
					console.log('data.message');
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	//点击列表跳转
	const selceted = (id: number) => {
		if (id == 0) {
			uni.navigateTo({
				url: '/pages/message/my/userInfo?username=' + toolsData.username
			})
		} else if (id == 1) {
			uni.navigateTo({
				url: '/pages/message/my/myMessage?username=' + toolsData.username
			})
		} else if (id == 2) {
			uni.navigateTo({
				url: '/pages/message/my/myComment?username=' + toolsData.username
			})
		} else if (id == 3) {
			uni.navigateTo({
				url: '/pages/message/my/myFriend'
			})
		} else if (id == 4) {
			uni.navigateTo({
				url: '/pages/message/my/followMe?username=' + toolsData.username
			})
		} else if (id == 5) {
			uni.navigateTo({
				url: '/pages/message/my/meFollow?username=' + toolsData.username
			})
		} else if (id == 6) {
			logOut()
		}
	}
	//跳转私信
	const jumpPrivateMessage = () => {
		uni.navigateTo({
			url: `/pages/message/privateMessageDetails?username=${toolsData.username}&nickname=${userInfo.nickname}&img=${userInfo.img}`
		})
	}
</script>

<style scoped>
	@import url("../../static/iconfont/iconfont.css");

	.top {
		padding: 60rpx 30rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.iconfont.arrow {
		transform: rotateY(180deg);
	}

	.top>view:first-child {
		display: flex;
	}

	.userinfo {
		display: flex;
		flex-direction: column;
	}

	.userinfo>text:first-child {
		font-size: 20px;
		word-wrap: break-word;
		margin-bottom: 10px;
	}

	.avatar {
		border-radius: 15rpx;
		width: 110rpx;
		height: 110rpx;
		object-fit: cover;
		overflow: hidden;
		margin-right: 20rpx;
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

	.list_item .infoIcon {
		display: flex;
		align-items: center;
	}

	.infoIcon>view {
		margin-right: 10px;
	}

	.iconfont>text {
		font-size: 14px;
	}

	.btns>button {
		margin: 0px 5px;
		font-size: 12px;
	}

	.hr {
		background-color: #f1f1f1;
		padding: 5px;
	}

	.privateMessage {
		color: #495a80;
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #bdbdbd;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.privateMessage .iconfont {
		margin-right: 5px;
	}
</style>
