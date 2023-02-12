import { defineStore } from 'pinia'
import CityInfoDAO from '../dao/CityInfoDAO'
import UserInfoDAO from '../dao/UserInfoDAO'
import BaseResult, { BaseDataResult } from '../entity/BaseResult'
import { CityInfo } from '../entity/CityInfo'
import LoginUser from '../entity/LoginUser'
import logger from '../tools/logger'
import { server, serverInfo } from '../tools/server'

const store = defineStore('main', {
  state: () => {
    return {
      loginUser: UserInfoDAO.getInstance().load(),
      cityInfo: CityInfoDAO.getInstance().load(),
      countInfo: '',
    }
  },
  actions: {
    // 获取网站计数器信息
    queryCountInfo() {
      let instance = this
      // 如果有添加过计数器就直接调用查询
      let countInfo = sessionStorage.getItem(serverInfo.counterKey)
      logger.debug('计数器是否已经添加过了：', countInfo)
      if (countInfo) {
        server.post('/portable/message/counterInfo', { accessKey: serverInfo.accessKey, messageKey: serverInfo.counterMessageKey }, (data: BaseResult) => {
          instance.countInfo = data.message
        })
        return
      }
      // 否则先调用添加流程，然后调用查询
      server.post('/portable/message/counterAdd', { accessKey: serverInfo.accessKey, messageKey: serverInfo.counterMessageKey }, () => {
        // 标记为已经添加过计数了
        sessionStorage.setItem(serverInfo.counterKey, 'hassave')
        server.post('/portable/message/counterInfo', { accessKey: serverInfo.accessKey, messageKey: serverInfo.counterMessageKey }, (data: BaseResult) => {
          instance.countInfo = data.message
        })
      })
    },
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
