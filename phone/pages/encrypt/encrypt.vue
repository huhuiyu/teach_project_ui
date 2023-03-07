<template>
	<view>
		<view @click="encrypt(1)" class="buttonmartop"><button class="buttonbackclolor">加密信息</button></view>
		<view @click="encrypt(2)" class="buttontowmartop"><button class="buttontwobackclolor">解密信息</button></view>
	</view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BaseResult from '../../script/entity/BaseResult';
import server from '../../script/server';
const encryptInfo = reactive({
	urlOne: '/tool/encrypt',
	urlTwo: '/tool/decrypt',
	titleOne: '输入需要加密的信息',
	titleTwo: '输入需要解密密的信息',
	title: '',
	url: ''
});
const encrypt = (value: number) => {
	if (value == 1) {
		encryptInfo.title = encryptInfo.titleOne;
		encryptInfo.url = encryptInfo.urlOne;
	} else if (value == 2) {
		encryptInfo.title = encryptInfo.titleTwo;
		encryptInfo.url = encryptInfo.urlTwo;
	}
	uni.showModal({
		title: encryptInfo.title,
		showCancel: false,
		editable: true,
		placeholderText: '请输入需要加密的信息',
		success: function(res) {
			console.log('查看内容', res.content);
			if (res.confirm) {
				uni.showLoading({
					title: '加载中'
				});
				server.post(encryptInfo.url, { info: res.content }, (data: BaseResult) => {
					uni.hideLoading();
					if (data.success && data.message != '请输入要加密的信息') {
						uni.setClipboardData({
							data: data.message,
							showToast: true
						});
					} else {
						uni.showToast({
							title: '请求失败',
							icon: 'error'
						});
					}
				});
			} else if (res.cancel) {
				return;
			}
		}
	});
};
</script>

<style scoped>
.buttonmartop {
	margin-top: 100rpx;
}

.buttontowmartop {
	margin-top: 20rpx;
}

.buttonbackclolor {
	background-color: #bfc;
}

.buttontwobackclolor {
	background-color: aquamarine;
}
</style>
