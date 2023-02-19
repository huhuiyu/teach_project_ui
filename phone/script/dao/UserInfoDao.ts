import LoginUser from '../entity/LoginUser'
class UserInfoDAO {
	private static instance: UserInfoDAO = new UserInfoDAO()
	localKey: string = 'huhuiyu.teach-project-userinfo'
	load(): LoginUser {
		let user = uni.getStorageSync(this.localKey)
		console.log('读取用户信息：', user)
		if (user) {
			return user
		}
		return new LoginUser()
	}
	save(loginUser: LoginUser | null): void {
		console.log('保存用户信息：', loginUser)
		if (loginUser == null) {
			uni.removeStorageSync(this.localKey)
		} else {
			uni.setStorageSync(this.localKey, loginUser)
		}
	}

	static getInstance() {
		return this.instance
	}

	private constructor() { }
}
export default UserInfoDAO
