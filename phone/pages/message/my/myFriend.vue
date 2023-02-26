<template>
	<view v-if="toolsData.friendApply==1&&toolsData.now=='friend'">
		<view class="box" style="display: flex;align-items: center;"
			@click="toolsData.friendApply=2;toolsData.now='else'">
			<view class="iconfont" style="font-size: 20px;margin-right: 10px;">&#xe6d6;</view>
			<text>好友申请</text>
		</view>
		<view class="hr">
			<text>我的好友</text>
		</view>
		<view v-for="d in friendData.list" :key="d.user.uid" class="box">
			<view class="content">
				<view class="userinfo" @click="jumpUserInfo(d.user.username)">
					<image class="avatar" :src="d.userInfo.img?d.userInfo.img:toolsData.lazyImg">
					</image>
					<text>{{d.user.nickname}}</text>
				</view>
				<view>
					<button size="mini" plain :loading="toolsData.loading.del" @click="delFriend(d)"> 删除好友</button>
				</view>
			</view>
		</view>
		<view v-if="friendData.list.length==0&&!toolsData.loading.friend">
			<view class="box">
				<view class="content tc">
					<text>您暂时还没有好友哦</text>
				</view>
			</view>
		</view>
	</view>
	<view v-else>
		<view class="box" style="display: flex;align-items: center;"
			@click="toolsData.friendApply=1;toolsData.now='friend'">
			<view class="iconfont" style="font-size: 20px;margin-right: 10px;">&#xe80f;</view>
			<text>返回我的好友</text>
		</view>
		<view>
			<view class="tabbar">
				<view class="navigator">
					<view class="navigator-item" v-for="item in toolsData.tabList" :key="item.id"
						@click="changeMode(item.id)">
						<text :class="['item-text',{'text-active':toolsData.friendApply==item.id}]">{{item.text}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="toolsData.friendApply==2&&toolsData.now=='else'">
			<view class="hr">
				<text>您收到的申请</text>
			</view>
			<view v-for="d in friendData.elseList" :key="d.user.uid" class="box">
				<view class="content">
					<view class="userinfo" @click="jumpUserInfo(d.user.username)">
						<image class="avatar" :src="d.userInfo.img?d.userInfo.img:toolsData.lazyImg">
						</image>
						<text>{{d.user.nickname}}</text>
					</view>
					<view class="btns">
						<button size="mini" :loading="toolsData.loading.agree" plain @click="friendAgree('agree',d)">
							同意</button>
						<button size="mini" :loading="toolsData.loading.deny" plain
							@click="friendAgree('deny',d)">拒绝</button>
					</view>
				</view>
			</view>
			<view v-if=" friendData.elseList.length==0&&!toolsData.loading.else">
				<view class="box">
					<view class="content tc">
						<text>您暂时还没收到申请哦</text>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="hr">
				<text>您发的申请（用户拒绝后信息消失）</text>
			</view>
			<view v-for="d in friendData.applyList" :key="d.user.uid" class="box">
				<view class="content">
					<view class="userinfo" @click="jumpUserInfo(d.user.username)">
						<image class="avatar" :src="d.userInfo.img?d.userInfo.img:toolsData.lazyImg">
						</image>
						<text>{{d.user.nickname}}</text>
					</view>

				</view>
			</view>
			<view v-if=" friendData.applyList.length==0&&!toolsData.loading.apply">
				<view class="box">
					<view class="content tc">
						<text>您暂时还没收到申请哦</text>
					</view>
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
	} from "@dcloudio/uni-app";
	import {
		BaseResult,
		BaseListResult
	} from '../../../script/entity/BaseResult';
	import {
		MessageFollow
	} from '../../../script/entity/MessageDetailResult'
	import server from '../../../script/server'
	import tools from '../../../script/tools';
	const toolsData = reactive({
		lazyImg: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81',
		friendApply: 1,
		now: 'friend',
		loading: {
			del: false,
			agree: false,
			deny: false,
			friend: false,
			apply: false,
			else: false
		},
		tabList: [{
				id: 2,
				text: "收到的申请",
			},
			{
				id: 3,
				text: "发出的申请",
			},
		]
	})

	//好友信息查询
	const friendData = reactive({
		list: [] as MessageFollow[],
		page: {
			pageNumber: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0
		},
		applyList: [] as MessageFollow[],
		elseList: [] as MessageFollow[],
		applyPage: {
			pageNumber: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0
		},
		elsePage: {
			pageNumber: 1,
			pageSize: 10,
			pageCount: 0,
			total: 0
		},
		level: 1,
		applyLevel: 1,
		elseLevel: 1
	})

	//查询我的好友
	const queryFriend = () => {
		if (friendData.level == 1) {
			friendData.page.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		let result = tools.concatJson({
			info: 'friend'
		}, friendData.page)
		toolsData.loading.friend = true
		server.post('/user/auth/friendQuery', result, (data: BaseListResult < MessageFollow > ) => {
			toolsData.loading.friend = false
			uni.hideLoading()
			if (friendData.level == 1) {
				friendData.list = data.list
				uni.stopPullDownRefresh()
			}
			if (friendData.level == 2) {
				friendData.list = friendData.list.concat(data.list)
			}
		})
	}
	queryFriend()
	//查询我申请添加的好友
	const queryApplyFriend = () => {
		if (friendData.applyLevel == 1) {
			friendData.applyPage.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		let result = tools.concatJson({
			info: 'apply'
		}, friendData.page)
		toolsData.loading.agree = true
		server.post('/user/auth/friendQuery', result, (data: BaseListResult < MessageFollow > ) => {
			toolsData.loading.agree = false
			uni.hideLoading()
			if (friendData.applyLevel == 1) {
				friendData.applyList = data.list
				uni.stopPullDownRefresh()
			}
			if (friendData.applyLevel == 2) {
				friendData.applyList = friendData.applyList.concat(data.list)
			}

		})
	}
	//查询添加我的好友
	const queryElseFriend = () => {
		if (friendData.elseLevel == 1) {
			friendData.elsePage.pageNumber = 1
		}
		uni.showLoading({
			title: '加载中',
		})
		let result = tools.concatJson({
			info: 'else'
		}, friendData.page)
		toolsData.loading.else = true
		server.post('/user/auth/friendQuery', result, (data: BaseListResult < MessageFollow > ) => {
			toolsData.loading.else = false
			uni.hideLoading()
			if (friendData.elseLevel == 1) {
				friendData.elseList = data.list
				uni.stopPullDownRefresh()
			}
			if (friendData.elseLevel == 2) {
				friendData.elseList = friendData.elseList.concat(data.list)
			}

		})
	}
	queryElseFriend()
	queryApplyFriend()

	//删除好友
	const delFriend = (info: MessageFollow) => {
		uni.showModal({
			title: '提示',
			content: '确定删除' + info.user.nickname,
			success: function(res: any) {
				if (res.confirm) {
					toolsData.loading.del = true
					server.post('/user/auth/friendDelete', {
						username: info.user.username
					}, (data: BaseResult) => {
						toolsData.loading.del = false
						uni.showToast({
							title: data.message,
							icon: 'none',
						})
						if (data.success) {
							friendData.level = 1
							queryFriend()
						}
					})
				} else if (res.cancel) {
					uni.showToast({
						title: '已取消',
						icon: 'none',

					})
				}
			}
		});
	}

	//好友申请处理
	const friendAgree = (mode: string | number, info: MessageFollow) => {
		if (mode == 'agree') {
			toolsData.loading.agree = true
		} else {
			toolsData.loading.deny = true
		}
		server.post('/user/auth/friendAgree', {
			info: mode,
			username: info.user.username
		}, (data: BaseResult) => {
			if (mode == 'agree') {
				toolsData.loading.agree = false
			} else {
				toolsData.loading.deny = false
			}
			if (data.success) {
				friendData.list = []
				friendData.page.pageNumber = 1
				friendData.level = 1
				friendData.elseList = []
				friendData.elsePage.pageNumber = 1
				friendData.elseLevel = 1
				queryFriend()
				queryElseFriend()
			}
		})
	}
	//切换查询类型
	const changeMode = (mode: String | number) => {
		if (mode == 2) {
			toolsData.friendApply = 2
			toolsData.now = 'else'
		} else {
			toolsData.now = 'apply'
			toolsData.friendApply = 3
		}
	}
	const jumpUserInfo = (username: string) => {
		uni.navigateTo({
			url: '/pages/message/personalHome?username=' + username
		})
	}
	//加载更多的下拉----页面触底生命周期 
	onReachBottom(() => {
		if (toolsData.now == 'friend') {
			friendData.level = 2
			if (friendData.page.pageNumber < friendData.page.pageCount) {
				uni.showLoading({
					title: '加载中',
				});
				setTimeout(function() {
					uni.hideLoading();
					friendData.page.pageNumber++
					queryFriend()
				}, 1000);

			} else {
				uni.showToast({
					title: '没有更多了~',
					icon: 'none'
				})
			}
			return
		} else if (toolsData.now == 'apply') {
			friendData.applyLevel = 2
			if (friendData.applyPage.pageNumber < friendData.applyPage.pageCount) {
				uni.showLoading({
					title: '加载中',
				});
				setTimeout(function() {
					uni.hideLoading();
					friendData.applyPage.pageNumber++
					queryApplyFriend()
				}, 1000);

			} else {
				uni.showToast({
					title: '没有更多了~',
					icon: 'none'
				})
			}
			return
		} else if (toolsData.now == 'else') {
			friendData.elseLevel = 2
			if (friendData.elsePage.pageNumber < friendData.elsePage.pageCount) {
				uni.showLoading({
					title: '加载中',
				});
				setTimeout(function() {
					uni.hideLoading();

					friendData.elsePage.pageNumber++
					queryElseFriend()
				}, 1000);

			} else {
				uni.showToast({
					title: '没有更多了~',
					icon: 'none'
				})
			}
			return
		}
	})
	// 刷新的生命周期
	onPullDownRefresh(() => {
		if (toolsData.now == 'friend') {
			friendData.level = 1
			queryFriend()
			return
		} else if (toolsData.now == 'apply') {
			friendData.applyLevel = 1
			queryApplyFriend()
			return
		} else if (toolsData.now == 'else') {
			friendData.elseLevel = 1
			queryElseFriend()
			return
		}
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

	.hr {
		font-size: 14px;
		/* margin-left: 10px; */
		background-color: #f1f1f1;
		padding: 10px 5px;
	}

	.btns>button {
		margin: 0px 5px;
		font-size: 12px;
	}

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
</style>
