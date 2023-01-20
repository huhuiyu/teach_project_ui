import TbUser from './TbUser'
import TbUserInfo from './TbUserInfo'
import UserOtherInfo from './UserOtherInfo'

/**
 * 后端基本应答类型
 */
class BaseResult {
  success: boolean = false
  message: string = ''
  code: number = 500
}

/**
 * 带数据的应答类型
 */
class BaseDataResult extends BaseResult {
  data: any
}
class BaseUserInfoResult extends BaseResult {
  tbUser: TbUser = new TbUser()
  tbUserInfo: TbUserInfo = new TbUserInfo()
  userOtherInfo: UserOtherInfo = new UserOtherInfo()
}

/**
 * 带分页查询的应答类型
 */
class BaseListResult<T> extends BaseResult {
  page: PageInfo = new PageInfo()
  list: Array<T> = []
}

/**
 * 分页信息
 */
class PageInfo {
  total: number = 0
  pageCount: number = 0
  pageNumber: number = 1
  pageSize: number = 10
}

export { BaseResult as BaseResult, BaseDataResult as BaseDataResult, BaseListResult as BaseListResult, PageInfo as PageInfo, BaseUserInfoResult as BaseUserInfoResult }

export default BaseResult
