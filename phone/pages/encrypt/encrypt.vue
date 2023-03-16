<template>
	<view>
		<textarea class="testTop" v-model="dataInfo.encrypt" placeholder-style="color:#F76260" placeholder="请输入需要加密的信息" />
		<view class="buttonmartop">
			<button @click="clickEncrypt" class="buttonbackclolor">加密信息</button>
			<button @click="clickMD" class="buttonbackclolorMD">md5加密（不可逆）</button>
			<button @click="copyTest" class="outcomebackclolor">复制结果</button>
			<button @click="clickDecrypt" class="buttontwobackclolor">解密信息</button>
		</view>
		<textarea v-model="dataInfo.decrypt" placeholder-style="color:#F76260" placeholder="请输入需要解密的信息" />
	</view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BaseResult from '../../script/entity/BaseResult';
import server from '../../script/server';
const dataInfo = reactive({
	copyVisible: false,
	copyText: '',
	encrypt: '',
	decrypt: ''
});
const copyTest = () => {
	uni.setClipboardData({
		data: dataInfo.copyText,
		showToast: true
	});
};
const clickEncrypt = () => {
	server.post('/tool/encrypt', { info: dataInfo.encrypt }, (data: BaseResult) => {
		if (data.success) {
			dataInfo.copyText = data.message;
			// dataInfo.encrypt = '';
			dataInfo.decrypt = data.message;
		}
	});
};
const clickDecrypt = () => {
	server.post('/tool/decrypt', { info: dataInfo.decrypt }, (data: BaseResult) => {
		if (data.success) {
			dataInfo.copyText = data.message;
			// dataInfo.decrypt = '';
			dataInfo.encrypt = data.message;
		}
	});
};

const clickMD = () => {
	server.post('/tool/md5', { info: dataInfo.encrypt }, (data: BaseResult) => {
		if (data.success) {
			dataInfo.copyText = data.message;
			// dataInfo.encrypt = '';
			dataInfo.decrypt = data.message;
		}
	});
};
</script>

<style scoped>
.buttonbackclolorMD {
	background-color: aqua;
}
.testTop {
	margin-top: 30rpx;
}
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
.outcomebackclolor {
	background-color: bisque;
}
</style>
