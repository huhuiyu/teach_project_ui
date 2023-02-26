<template>
	<view v-if="Data.bottonTabbarId == '1'">
		<view class="header">
			<view>
				<view style="font-size: 2rem;">Mr. or girl</view>
				<view style="text-indent: 7em;">{{ Data.titleInfo }},欢迎您来到这</view>
			</view>
		</view>
		<view class="main">
			<view class="mainList" v-for="item in list" :key="item.path" @click="actionFunction(item.path)">
				<image style="width: 100%;height: 100%;border-radius: 5px;" :src="item.img"></image>
				<span>{{ item.info }}</span>
			</view>
		</view>
	</view>
	<view v-else>
		<view class="userInfo" v-if="loginUser.isLogin">
			<view class="userInfoImgNickname">
				<view><image class="UserInfoImg" src="https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=92"></image></view>
				<view class="NicknameImg">
					<view>账号:{{ loginUser.tbUser.username }}</view>
					<view>昵称:{{ loginUser.tbUser.nickname }}</view>
				</view>
			</view>
			<view @click="ClickUserInfo()" class="userInfoview">
				<view>设置</view>
				<view class="iconfont arrow">&#xe615;</view>
			</view>
			<view @click="LogOut()" class="userInfoview">
				<view>退出登录</view>
				<view class="iconfont arrow">&#xe615;</view>
			</view>
		</view>
	</view>

	<view class="bottomFixed">
		<view class="bottom">
			<view
				class="bottomTabbarStyle"
				:class="{ bottomActive: item.id == Data.bottonTabbarId }"
				v-for="item in Data.bottonTabbar"
				:key="item.text"
				@click="actionFooterInfo(item.id)"
			>
				<image class="bottomTabbar" :src="item.image"></image>
				<view>{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import store from '../store/index';
import server from '../script/server';
const { loginUser } = store();
console.log('chakna', loginUser);
const Data = reactive({
	titleInfo: '',
	bottonTabbarId: '1',
	bottonTabbar: [
		{
			id: '1',
			text: '首页',
			image: 'https://service.huhuiyu.top/teach_project_service/user/file/download?fid=99'
		},
		{
			id: '2',
			text: '我的',
			image: 'https://service.huhuiyu.top/teach_project_service/user/file/download?fid=106'
		}
	]
});
const OLD_URL = '/pages/home';
const actionFooterInfo = (id: number) => {
	Data.bottonTabbarId = id;
	if (id == 2 && !loginUser.isLogin) {
		uni.showModal({
			title: '请登录后访问！！！',
			content: '是否跳转登录',
			success: (res: any) => {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/Login?oldUrl=' + OLD_URL
					});
				} else if (res.cancel) {
					uni.navigateTo({
						url: '/pages/home'
					});
					return;
				}
			}
		});
	}
};

const actionFunction = (path: string) => {
	uni.navigateTo({
		url: path
	});
};
const dataTime = () => {
	const date = new Date().getHours();
	if (date > 0 && date < 12) {
		Data.titleInfo = '上午好';
	} else if (date > 12 && date < 18) {
		Data.titleInfo = '下午好';
	} else {
		Data.titleInfo = '晚上好';
	}
};
dataTime();
const list = reactive([
	{ path: '/pages/message/home', img: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=95', info: '留言板' },
	{ path: '/pages/message/home', img: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=95', info: '简言板' },
	{ path: '/pages/message/home', img: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=95', info: '留言板' },
	{ path: '/pages/message/home', img: 'https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=95', info: '留言板' }
]);
const Login = () => {
	uni.navigateTo({
		url: '/pages/Login'
	});
};

const LogOut = () => {
	uni.showModal({
		title: '提示',
		content: '确定退出登录',
		success: function(res) {
			if (res.confirm) {
				server.post('/user/auth/logout', {}, function() {
					store().updateLoginUser(() => {
						uni.navigateTo({
							url: '/pages/Login'
						});
					});
				});
				console.log('data.message');
			} else if (res.cancel) {
				console.log('用户点击取消');
			}
		}
	});
};

const ClickUserInfo = () => {
	uni.navigateTo({
		url: '/pages/message/my/userInfo?username=' + loginUser.tbUser.username
	});
};
</script>

<style scoped>
@import url('../static/iconfont/iconfont.css');
.iconfont.arrow {
	transform: rotateY(180deg);
}
.header {
	width: 100vw;
	height: 35vh;
	background-image: url(https://service.huhuiyu.top/teach_project_service/oss/ossinfo/openOssFile?oiid=95);
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
}
.header > uni-view {
	padding: 3rem 0 0 1rem;
	letter-spacing: 1px;
	color: #fff;
}
.main {
	margin: 2rem 1rem;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	text-align: center;
	box-sizing: border-box;
	gap: 3rem 1rem;
}
.mainList {
	margin: 0 auto;
	width: 60%;
	height: 120%;
}

.bottomTabbar > img,
.bottomTabbar {
	width: 55rpx;
	height: 55rpx;
}

.bottom {
	display: grid;
	grid-template-columns: repeat(2, 2fr);
	text-align: center;
	box-sizing: border-box;
	gap: 0rem;
}
.bottomFixed {
	position: fixed;
	width: 100vw;
	bottom: 0px;
	border-top: 1px solid #000;
}
.bottomTabbarStyle {
	padding-top: 4%;
}

.bottomActive {
	background-color: rgba(0, 0, 0, 0.2);
}

.userInfoview {
	border-bottom: 1rpx solid #000;
	display: flex;
	justify-content: space-between;
	margin-top: 2%;
	padding: 2% 3%;
	padding-left: 5%;
}
.userInfoImgNickname {
	display: flex;
	padding: 5% 0px 10% 0px;
	padding-left: 5%;
	background-color: rgba(0, 0, 0, 0.2);
}
.UserInfoImg {
	width: 200rpx;
	height: 200rpx;
	border-radius: 10px;
	border: 1px solid #000;
}
.NicknameImg {
	margin-left: 10%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
</style>
