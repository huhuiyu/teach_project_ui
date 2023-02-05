import { defineStore } from 'pinia'
import CityInfoDAO from '../dao/CityInfoDAO'
import UserInfoDAO from '../dao/UserInfoDAO'
import { BaseDataResult } from '../entity/BaseResult'
import { CityInfo } from '../entity/CityInfo'
import LoginUser from '../entity/LoginUser'
import server from '../tools/server'

const store = defineStore('main', {
  state: () => {
    return {
      loginUser: UserInfoDAO.getInstance().load(),
      cityInfo: CityInfoDAO.getInstance().load(),
    }
  },
  actions: {
    // 更新用户信息
    updateLoginUser(cb: any) {
      server.post(
        '/user/auth/getUserInfo',
        {},
        (data: any) => {
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
        },
        true
      )
    },
    queryCityInfo() {
      server.post('/api/queryIpCtiyInfo', {}, (data: BaseDataResult<CityInfo>) => {
        if (data.success) {
          CityInfoDAO.getInstance().save(data.data)
        } else {
          CityInfoDAO.getInstance().save(null)
        }
        this.cityInfo = CityInfoDAO.getInstance().load()
      })
    },
  },
})

export default store
