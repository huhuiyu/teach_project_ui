import { TbUser, TbUserInfo, UserOtherInfo } from '../entity/UserInfo'
/**
 * 登录用户信息
 */
class LoginUser {
  isLogin: boolean = false
  tbUser: TbUser = new TbUser()
  tbUserInfo: TbUserInfo = new TbUserInfo()
  userOtherInfo: UserOtherInfo = new UserOtherInfo()

  constructor() {}
}

export default LoginUser
