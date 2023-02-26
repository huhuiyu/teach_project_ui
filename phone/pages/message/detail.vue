<template>
	<view>
		<view>
			<image
				class="titleImg"
				:src="messageData.info.userInfo.img ? messageData.info.userInfo.img : 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=81'"
			></image>
		</view>
		<view>
			<view>{{ messageData.info.user.username }}</view>
			<view>{{ messageData.info.title }}</view>
			<view>{{ tools.formatDate(messageData.info.lastupdate) }}</view>
		</view>
		<view v-if="loginUser.isLogin"><button>关注</button></view>
		<view v-else><button>关注</button></view>
	</view>
	<view><messageTbaBar></messageTbaBar></view>
</template>

<script setup lang="ts">
import { onReachBottom, onPullDownRefresh, onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import messageTbaBar from '../../component/messageTabBar.vue';
import { PageInfo } from '../../script/entity/BaseResult';
import MessageDetailResult, { MessageDetail, MessageReply } from '../../script/entity/MessageDetailResult';
import server from '../../script/server';
import tools from '../../script/tools';
import store from '../../store/index';
const { loginUser } = store();
const messageData = reactive({
	query: {
		umid: '',
		orderBy: '',
		umisdf: '2'
	},
	page: new PageInfo(),
	info: new MessageDetail(),
	list: [] as MessageReply[]
});
const queryAll = () => {
	server.post('/message/queryDetail', tools.concatJson(messageData.query), (data: MessageDetailResult) => {
		console.log('chaksgihsdn', tools.concatJson(messageData.query));
		if (data.success) {
			messageData.info = data.info;
			messageData.list = data.list;
			messageData.page = data.page;
		}
	});
};
onLoad((option: any) => {
	console.log('查实查看umid', option.umid);
	if (option.umid) {
		messageData.query.umid = option.umid;
		queryAll();
	} else {
		uni.navigateTo({
			url: '/pages/message/home'
		});
	}
});
</script>

<style scoped>
.titleImg {
	width: 100rpx;
	height: 80rpx;
}
</style>
