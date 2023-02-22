<template>
	<view>
		<view v-for="d in messageData.list" :key="d.user.uid" class="box">
			<view class="content">
				<view class="userinfo" @click="jumpUserInfo(d.user.username)">
					<image class="avatar"
						:src="d.userInfo.img?d.userInfo.img:'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'">
					</image>
					<text>{{d.user.nickname}}</text>
				</view>
				<view>
					<button size="mini" @click="followUser" plain :type="d.userOtherInfo.mineFollow?'primary':'default'"
						:loading="toolsData.loading.follow">{{d.userOtherInfo.mineFollow ? '已关注' : '关注' }}</button>
				</view>
			</view>
		</view>
		<view v-if="messageData.list.length==0">
			<view class="box">
				<view class="content tc">
					<text>您暂时还没有关注的哦</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive,

	} from 'vue'
	import {
		onReachBottom,
		onPullDownRefresh,
		onLoad
	} from "@dcloudio/uni-app";
	import {
		BaseListResult
	} from '../../../script/entity/BaseResult';
	import {
		MessageFollow
	} from '../../../script/entity/MessageDetailResult'
	import server from '../../../script/server'
	import tools from '../../../script/tools'
	const toolsData = (reactive({
		loading: {
			follow: false
		}
	}))
	const messageData = reactive({
		queryInfo: {
			orderBy: 2,
			username: ''
		},
		page: {
			pageNumber: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0
		},
		level: 1,
		list: [] as MessageFollow[],
	})

	const jumpUserInfo = (username: string) => {
		uni.navigateTo({
			url: '/pages/message/personalHome?username=' + username
		})
	}

	onLoad((option: any) => {
		if (option.username) {
			messageData.queryInfo.username = option.username
			queryAll()
		} else {
			uni.navigateTo({
				url: '/pages/message/personalHome'
			})
		}
	})

	const queryAll = () => {
		if (messageData.level == 1) {
			messageData.page.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		server.post('/message/queryFollowMeUserListByName', tools.concatJson(messageData.queryInfo, messageData.page),
			(data:
				BaseListResult < MessageFollow > ) => {
				uni.hideLoading()
				if (messageData.level == 1) {
					messageData.list = data.list
					uni.stopPullDownRefresh()
				}
				if (messageData.level == 2) {
					messageData.list = messageData.list.concat(data.list)
				}
				messageData.page = data.page
			})
	}
	const followUser = (username: string) => {
		toolsData.loading.follow = true
		server.post('/message/followUser', {
			username
		}, () => {
			toolsData.loading.follow = false

		})
	}
	//加载更多的下拉----页面触底生命周期 
	onReachBottom(() => {
		messageData.level = 2
		if (messageData.page.pageNumber < messageData.page.pageCount) {
			uni.showLoading({
				title: '加载中',
			});
			setTimeout(function() {
				uni.hideLoading();
				messageData.page.pageNumber++
				queryAll();
			}, 1000);

		} else {
			uni.showToast({
				title: '没有更多了~',
				icon: 'none'
			})
		}
	})
	// 刷新的生命周期
	onPullDownRefresh(() => {
		messageData.level = 1
		queryAll()
	})
</script>

<style scoped>
	@import url("../../../static/iconfont/iconfont.css");

	.tc {
		text-align: center;
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

	.content .date {
		font-size: 14px;
		color: #8d8d8d;
	}


	.content .title {
		font-size: 18px;
		margin-bottom: 15rpx;
	}

	.content .iconList {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.content .iconList>view {
		margin: 2rpx 10rpx;
		font-size: 14px;
	}
</style>
