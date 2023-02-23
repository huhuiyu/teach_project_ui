<template>
	<view>
		<view>
			<view class="tabbar">
				<view class="navigator">
					<view class="navigator-item" v-for="item in toolsData.tabList" :key="item.id"
						@click="changeOrderBy(item.id)">
						<text
							:class="['item-text',{'text-active':messageData.queryInfo.orderBy === item.id}]">{{item.text}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-for="d in messageData.list" :key="d.umid" class="box">
			<view class="content">
				<view class="userinfo">
					<image class="avatar"
						:src="d.userInfo.img?d.userInfo.img:'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'">
					</image>
					<text>{{d.user.nickname}}</text>
				</view>
				<view>
					<text class="date">{{tools.formatDate(d.lastupdate)}}</text>
				</view>
				<view class="hr"></view>
				<view class="title" @click="jumpDetail(d.umid)">
					<text>{{d.info}}</text>
				</view>
				<view class="iconList">
					<view @click="likeComment(d.umrid)">
						<text :class="['iconfont',{'text-active':d.praise}]">&#xec7f;</text>
						{{d.praiseCount}}
					</view>
					<view @click="delComment(d)" v-if="d.mine">
						<text class="iconfont">&#xe68e;</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="messageData.list.length==0">
			<view class="box">
				<view class="content tc">
					<text>暂时没有找到哦</text>
					<button size="mini" @click="resetQueryAll">重置刷新</button>
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
	import BaseResult, {
		BaseListResult
	} from '../../../script/entity/BaseResult';
	import {
		MessageReply
	} from '../../../script/entity/MessageDetailResult'
	import server from '../../../script/server'
	import tools from '../../../script/tools'

	const toolsData = reactive({
		tabList: [{
				id: 2,
				text: "最新",
			},
			{
				id: 3,
				text: "最热",
			},
		],
	})
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
		list: [] as MessageReply[],
	})
	//初始化获取username
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

	//点赞评论
	const likeComment = (umrid: number) => {
		server.post('/message/supportReply', {
			umrid: umrid
		}, (data: BaseResult) => {
			if (data.success) {
				uni.showToast({
					title: data.message,
					duration: 500,
				})
				queryAll()
			} else {
				uni.showToast({
					title: data.message,
					duration: 500
				})
			}
		})
	}
	const queryAll = () => {
		if (messageData.level == 1) {
			messageData.page.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		server.post('/message/queryReplyByUsername', tools.concatJson(messageData.queryInfo, messageData.page), (data:
			BaseListResult < MessageReply > ) => {
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
	//删除评论
	const delComment = (comment: MessageReply) => {
		uni.showModal({
			title: '提示',
			content: '确认是否删除' + comment.info,
			success: function(res) {
				if (res.confirm) {
					server.post('/manage/deletUserMessageReply', {}, function(data: BaseResult) {
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
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
	//切换查询方式
	const changeOrderBy = (orderBy: number) => {
		messageData.level = 1
		messageData.page.pageNumber = 1
		messageData.queryInfo.orderBy = orderBy
		queryAll()
	}

	//重置查询
	const resetQueryAll = () => {
		messageData.level = 1
		queryAll()
	}
	const jumpDetail = (umid: number) => {
		uni.navigateTo({
			url: '/pages/message/detail?umid' + umid
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

	.tabbar {
		width: 100%;
		height: 60rpx;
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
		width: 60px;
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
		flex-direction: column;
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

	.content .hr {
		border-bottom: 1px solid #bdbdbd;
		margin: 10rpx;
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
