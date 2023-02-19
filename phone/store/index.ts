import { defineStore } from 'pinia'
import UserInfoDAO from '../script/dao/UserInfoDao'
import LoginUser from '../script/entity/LoginUser'
import server from '../script/server'

const store = defineStore('main', {
	state: () => {
		return { loginUser: UserInfoDAO.getInstance().load() }
	},
	actions: {
		updateLoginUser(cb: any) {
			server.post('/user/auth/getUserInfo', {}, (data: any) => {
				if (data.success) {
					const user = new LoginUser()
					user.isLogin = data.success
					user.tbUser = data.tbUser
					user.tbUserInfo = data.tbUserInfo
					user.userOtherInfo = data.userOtherInfo
					UserInfoDAO.getInstance().save(user)
				} else {
					UserInfoDAO.getInstance().save(null)
				}
				this.loginUser = UserInfoDAO.getInstance().load()
				cb(this.loginUser)
			})
		}
	}
})
export default store