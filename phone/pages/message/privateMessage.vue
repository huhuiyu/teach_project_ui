<template>
	<view>
		<view>
			<view class="tabbar">
				<view class="navigator">
					<view class="navigator-item" v-for="item in toolsData.tabList" :key="item.id"
						@click="toolsData.selceted = item.id">
						<text :class="['item-text',{'text-active':toolsData.selceted == item.id}]">{{item.text}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="toolsData.selceted==2">
			<view class="hr">
				<text>聊天列表</text>
			</view>
			<view v-for="d in privateMessageData.list" :key="d.user.uid" class="box"
				@click="jumpPrivateMessageDetails(d)">
				<view class="content">
					<view class="userinfo">
						<image class="avatar" :src="d.userInfo.img?d.userInfo.img:toolsData.lazyImg">
						</image>
						<text>{{d.user.nickname}}</text>
					</view>
					<view class="badge" v-if="d.newMessage!=0">
						{{d.newMessage}}条私信未读
					</view>
					<view class="badge" v-else>
						私信已读
					</view>
				</view>
			</view>
			<view v-if="!loginUser.isLogin">
				<view class="box">
					<view class="content">
						<text>请登录后查看</text>
						<button style="margin:0" size="mini" plain @click="jumpLoginModal">登录</button>
					</view>

				</view>
			</view>
			<view v-else-if="privateMessageData.list.length==0&&!toolsData.loading.queryPMU">
				<view class="box">
					<view class="content tc">
						<text>您暂时还没有消息哦</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="toolsData.selceted==3">
			<view class="hr">
				<text>留言板公告</text>
			</view>
			<view v-for="d in messageNoticeData.list" :key="d.niid" class="box" @click="queryNoticeDetails(d)">
				<view class="content">
					<text>{{d.title}}</text>
					<text>{{tools.formatDate( parseInt(d.lastupdate))}}</text>
				</view>
			</view>
			<view v-if="messageNoticeData.list.length==0&&!toolsData.loading.queryPMU">
				<view class="box">
					<view class="content tc">
						<text>暂时还没有公告哦</text>
					</view>
				</view>
			</view>
		</view>
		<messageTbaBar></messageTbaBar>
	</view>
</template>

<script setup lang="ts">
	import messageTbaBar from '../../component/messageTabBar.vue'
	import {
		reactive
	} from "vue";
	import {
		MessageFollow,
		Announcement
	} from '../../script/entity/MessageDetailResult';
	import {
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app";
	import server from '../../script/server';
	import tools from '../../script/tools';
	import {
		BaseListResult
	} from '../../script/entity/BaseResult';
	import store from '../../store/index'
	const {
		loginUser
	} = store()

	const toolsData = reactive({
		lazyImg: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81',
		selceted: 3,
		tabList: [{
				id: 2,
				text: "私信",
			},
			{
				id: 3,
				text: "公告",
			},
		],
		loading: {
			queryPMU: false,
			queryNotice: false,
		}
	})

	const privateMessageData = reactive({
		list: [] as MessageFollow[],
		page: {
			pageNumber: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0
		},
		level: 1
	})
	//查询当前用户私信用户私信（需登录）
	const queryPrivateMessageUser = () => {
		if (privateMessageData.level == 1) {
			privateMessageData.page.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		toolsData.loading.queryPMU = true
		server.post('/user/auth/findPrivateMessageUserInfo', privateMessageData.page, (data: BaseListResult <
			MessageFollow > ) => {
			toolsData.loading.queryPMU = false
			uni.hideLoading()
			if (privateMessageData.level == 1) {
				privateMessageData.list = data.list
				uni.stopPullDownRefresh()
			}
			if (privateMessageData.level == 2) {
				privateMessageData.list = privateMessageData.list.concat(data.list)
			}
			privateMessageData.page = data.page

		})
	}
	//登录后才可查询私信
	if (loginUser.isLogin) {
		toolsData.selceted = 2
		queryPrivateMessageUser()
	}
	const messageNoticeData = reactive({
		list: [] as Announcement[],
		page: {
			pageNumber: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0
		},
		level: 1
	})
	//查询留言板公告
	const queryMessageNotice = () => {
		if (messageNoticeData.level == 1) {
			messageNoticeData.page.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		toolsData.loading.queryNotice = true
		server.post('/message/queryNotice', {}, (data: BaseListResult < Announcement > ) => {
			toolsData.loading.queryNotice = false
			uni.hideLoading()
			if (messageNoticeData.level == 1) {
				messageNoticeData.list = data.list
				uni.stopPullDownRefresh()
			}
			if (messageNoticeData.level == 2) {
				messageNoticeData.list = messageNoticeData.list.concat(data.list)
			}
			messageNoticeData.page = data.page


		})
	}
	queryMessageNotice()
	//查询公告详情

	const queryNoticeDetails = (info: Announcement) => {
		uni.showModal({
			title: info.title,
			content: info.info,
			showCancel: false,
			confirmText: '关闭'
		});

	}
	//跳转登录弹框
	const jumpLoginModal = () => {
		uni.showModal({
			title: '请登录后访问！！！',
			content: "是否跳转登录",
			success: (res: any) => {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/Login?oldUrl=' + '/pages/message/privateMessage'
					})
				}
			},
		})
	}
	//跳转私信详情
	const jumpPrivateMessageDetails = (d: MessageFollow) => {
		uni.navigateTo({
			url: `/pages/message/privateMessageDetails?username=${d.user.username}&nickname=${d.user.username}&img=${d.userInfo.img}`
		})
	}

	//加载更多的下拉----页面触底生命周期
	onReachBottom(() => {
		if (toolsData.selceted == 2) {
			privateMessageData.level = 2
			if (privateMessageData.page.pageNumber < privateMessageData.page.pageCount) {
				uni.showLoading({
					title: '加载中',
				});
				setTimeout(function() {
					uni.hideLoading();
					privateMessageData.page.pageNumber++
					queryPrivateMessageUser()
				}, 1000);

			} else {
				uni.showToast({
					title: '没有更多了~',
					icon: 'none'
				})
			}
		} else if (toolsData.selceted == 3) {
			messageNoticeData.level = 2
			if (messageNoticeData.page.pageNumber < messageNoticeData.page.pageCount) {
				uni.showLoading({
					title: '加载中',
				});
				setTimeout(function() {
					uni.hideLoading();
					messageNoticeData.page.pageNumber++
					queryMessageNotice()
				}, 1000);

			} else {
				uni.showToast({
					title: '没有更多了~',
					icon: 'none'
				})
			}
		}
	})
	// 刷新的生命周期
	onPullDownRefresh(() => {
		if (toolsData.selceted == 2) {
			privateMessageData.level = 1
			queryPrivateMessageUser()
		} else if (toolsData.selceted == 3) {
			messageNoticeData.level = 1
			queryMessageNotice()
		}
	})
</script>

<style scoped>
	.tabbar {
		width: 100%;
		height: 60rpx;
		margin: 10rpx;
	}


	.navigator {
		display: flex;
		justify-content: space-between;
		width: 85%;
		margin: 0 auto;
		padding: 15rpx;
	}

	.navigator-item {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 80px;
		height: 100%;
	}

	.item-text {
		margin-top: 6rpx;
		color: #777E86;
		font-size: 24rpx;
	}

	.text-active {
		color: #2E92FD !important;
	}

	.box {
		border: 1px solid #8e8e8e4f;
		border-radius: 10px;
		padding: 10px;
		margin: 10px;
		word-break: break-all;
		box-shadow: 0 0 0 1px rgb(0 0 0/5%), 0 1px 3px 1px rgba(0, 0, 0, .16);
	}

	.content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.content .userinfo {
		display: flex;
		align-items: center;
	}

	.content .userinfo .avatar {
		clip-path: circle(50% at 50% 50%);
		width: 50rpx;
		height: 50rpx;
		object-fit: cover;
		overflow: hidden;
		margin-right: 10rpx;
	}

	.avatar img {
		width: 100%;
		height: 100%;
	}

	.hr {
		font-size: 14px;
		/* margin-left: 10px; */
		background-color: #f1f1f1;
		padding: 10px;
	}

	.badge {
		font-size: 12px;
		color: rgb(154, 154, 158);
	}
</style>
