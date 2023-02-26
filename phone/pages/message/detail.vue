<template>
	<view style="display: flex;justify-content: space-between;align-items: center;">
		<view style="display: flex;align-items: center;">
			<view @click="jumpUserInfo(d.user.username)">
				<image
					class="titleImg"
					:src="messageData.info.userInfo.img ? messageData.info.userInfo.img : 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'"
				></image>
			</view>
			<view>
				<view>{{ messageData.info.user.username }}</view>
				<view>{{ messageData.info.title }}</view>
				<view style="color: rgba(0, 0, 0, 0.4);">{{ tools.formatDate(messageData.info.lastupdate) }}</view>
			</view>
		</view>
		<view style="margin-right: 10rpx;" v-if="loginUser.isLogin">
			<view v-if="loginUser.tbUser.username == messageData.info.user.username"></view>
			<view v-else>
				<view @click="clickFollow(messageData.info.user.username)">
					<button v-if="messageData.visible.FollowBotton">{{ messageData.info.userOtherInfo.mineFollow ? '已关注' : '关注' }}</button>
					<view v-else id="loader"></view>
				</view>
			</view>
		</view>
		<view style="margin-right: 10rpx;" v-else><button>关注</button></view>
	</view>
	<view style="margin: 20rpx 20rpx 40rpx 0rpx;margin-left: 40rpx;">{{ messageData.info.info }}</view>
	<view>
		<view class="tabbar">
			<view class="navigator">
				<view class="navigator-item" v-for="item in messageData.tabList" :key="item.id" @click="changeOrderBy(item.id)">
					<text :class="['item-text', { 'text-active': messageData.queryInfo.orderBy === item.id }]">{{ item.text }}</text>
				</view>
			</view>
		</view>
	</view>
	<view v-for="d in messageData.list" :key="d.umid" class="box">
		<view class="content">
			<view class="userinfo" @click="jumpUserInfo(d.user.username)">
				<image class="avatar" :src="d.userInfo.img ? d.userInfo.img : 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'"></image>
				<text>{{ d.user.nickname }}</text>
			</view>
			<view>
				<text class="date">{{ tools.formatDate(d.lastupdate) }}</text>
			</view>
			<view class="hr"></view>
			<view class="title">
				<text>{{ d.info }}</text>
			</view>
			<view class="iconList">
				<view @click="delumrid(d)" v-if="d.mine"><text class="iconfont">&#xe68e;</text></view>
				<view @click="likeMessage(d.umrid)">
					<text :class="['iconfont', { 'text-active': d.praise }]">&#xec7f;</text>
					{{ d.praiseCount }}
				</view>
				<view><text class="iconfont">&#xe89d;</text></view>
			</view>
		</view>
	</view>
	<view v-if="messageData.page.total == 0">
		<view class="box">
			<view class="content tc">
				<text>暂时没有找到哦</text>
				<button size="mini" @click="resetQueryAll">重置刷新</button>
			</view>
		</view>
	</view>
	<view class="bottonStyle">
		<view class="footerStyle">
			<view :class="{ 'text-active': messageData.info.praise }" @click="messageTitle(messageData.info.umid)">
				<view class="iconfont">&#xec7f;</view>
				<view>点赞</view>
			</view>
			<view>
				<view class="iconfont">&#xe630;</view>
				<view>评论</view>
			</view>
			<view>
				<view class="iconfont">&#xe89d;</view>
				<view>举报</view>
			</view>
		</view>
	</view>
	<view style="height: 0px;overflow: hidden;">
		<input
			@confirm="pushDetail(messageData.info.umid)"
			v-model="messageData.detailInfo"
			adjust-position="false"
			confirm-type="search"
			:focus="messageData.focus"
			auto-blur="true"
		/>
	</view>
	
</template>

<script setup lang="ts">
import { onReachBottom, onPullDownRefresh, onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import BaseResult, { PageInfo } from '../../script/entity/BaseResult';
import MessageDetailResult, { MessageDetail, MessageReply } from '../../script/entity/MessageDetailResult';
import server from '../../script/server';
import tools from '../../script/tools';
import store from '../../store/index';
const { loginUser } = store();
const messageData = reactive({
	detailInfo: '',
	focus: false,
	level: 1,
	queryInfo: {
		umid: '',
		orderBy: '1'
	},
	page: { pageNumber: 1, pageSize: 10, pageCount: 0, total: 0 },
	info: new MessageDetail(),
	list: [] as MessageReply[],
	visible: {
		FollowBotton: true
	},
	tabList: [
		{
			id: 1,
			text: '最新'
		},
		{
			id: 3,
			text: '最热'
		}
	]
});

const queryAll = () => {
	if (messageData.level == 1) {
		messageData.page.pageNumber = 1;
	}
	uni.showLoading({
		title: '加载中'
	});
	messageData.page.total == 0;
	server.post('/message/queryDetail', tools.concatJson(messageData.queryInfo), (data: MessageDetailResult) => {
		messageData.page = data.page;
		messageData.visible.FollowBotton = true;
		uni.hideLoading();
		if (messageData.level == 1) {
			messageData.info = data.info;
			messageData.list = data.list;
		}
		if (messageData.level == 2) {
			messageData.list = messageData.list.concat(data.list);
		}
	});
};
queryAll();
onLoad((option: any) => {
	if (option.umid) {
		messageData.queryInfo.umid = option.umid;
		queryAll();
	} else {
		uni.navigateTo({
			url: '/pages/message/home'
		});
	}
});
const jumpUserInfo = (username: string) => {
	uni.navigateTo({
		url: '/pages/message/personalHome?username=' + username
	});
};

const clickFollow = (username: string) => {
	messageData.visible.FollowBotton = false;
	server.post('/message/followUser', { username: username }, (data: BaseResult) => {
		queryAll();
	});
};
const changeOrderBy = (umid: number) => {
	messageData.queryInfo.orderBy = umid;
	messageData.page.pageNumber = 1;
	queryAll();
};
const jumpDetail = (abc: number) => {
	console.log(abc);
};
const resetQueryAll = () => {
	messageData.queryInfo.orderBy = 1;
	messageData.page.pageNumber = 1;
	queryAll();
};
const likeMessage = (umrid: number) => {
	server.post('/message/supportReply', { umrid: umrid }, (data: BaseResult) => {
		uni.showToast({
			title: data.message,
			duration: 500
		});
		if (data.success) {
			queryAll();
		}
	});
};
const delumrid = (item: number) => {
	uni.showModal({
		title: '提示',
		content: '确定删除' + item.info,
		success: function(res: any) {
			if (res.confirm) {
				toolsData.loading.del = true;
				server.post('/message/manage/deletUserMessageReply', { umrid: item.umrid }, (data: BaseResult) => {
					toolsData.loading.del = false;
					uni.showToast({
						title: data.message,
						icon: 'none'
					});
					if (data.success) {
						friendData.level = 1;
						queryFriend();
					}
				});
			} else if (res.cancel) {
				uni.showToast({
					title: '已取消',
					icon: 'none'
				});
			}
		}
	});
};
// 点赞帖子

const messageTitle = (umid: number) => {
	server.post('/message/support', { umid: umid }, (data: BaseResult) => {
		uni.showToast({
			title: data.message,
			duration: 500
		});
		if (data.success) {
			queryAll();
		}
	});
};
// 发表评论
const pushDetail = (umid: number) => {
	server.post('/message/addReply', tools.concatJson(umid, messageData.detailInfo), (data: BaseResult) => {
		uni.showToast({
			title: data.message,
			duration: 500
		});
		if (data.success) {
			queryAll();
		}
	});
};
//加载更多的下拉----页面触底生命周期
onReachBottom(() => {
	messageData.level = 2;
	if (messageData.page.pageNumber < messageData.page.pageCount) {
		uni.showLoading({
			title: '加载中'
		});
		setTimeout(function() {
			uni.hideLoading();
			messageData.page.pageNumber++;
			queryAll();
		}, 1000);
	} else {
		uni.showToast({
			title: '没有更多了~',
			icon: 'none'
		});
	}
});
// 刷新的生命周期
onPullDownRefresh(() => {
	messageData.level = 1;
	queryAll();
});
</script>

<style scoped>
@import url('../../static/iconfont/iconfont.css');
.titleImg {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin: 0 40rpx;
}
#loader {
	border: 5px solid #f3f3f3;
	border-top: 5px solid #555;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	display: inline-block;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
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
	color: #777e86;
	font-size: 24rpx;
}

.text-active {
	color: #2e92fd !important;
}
.box {
	border: 1px solid #8e8e8e4f;
	border-radius: 10px;
	padding: 10px;
	margin: 10px;
	word-break: break-all;
	box-shadow: 0 0 0 1px rgb(0 0 0/5%), 0 1px 3px 1px rgba(0, 0, 0, 0.16);
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

.content .iconList > view {
	margin: 4rpx 10rpx;
	font-size: 14px;
}

.footerStyle {
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.footerStyle > view {
	display: flex;
	align-items: center;
}
.footerStyle > view > view {
	margin-left: 10rpx;
}
.bottonStyle {
	width: 100%;
	height: 98upx;
	display: flex;
	align-items: center;
	position: fixed;
	left: 0;
	bottom: 0;
}
</style>
