import { BaseListResult } from './BaseResult'
import TbUser from './TbUser'
import TbUserInfo from './TbUserInfo'
import UserOtherInfo from './UserOtherInfo'

/**
 * 帖子详情
 */
class MessageDetail {
  user: TbUser = new TbUser()
  userInfo: TbUserInfo = new TbUserInfo()
  userOtherInfo: UserOtherInfo = new UserOtherInfo()
  umid: number = 0
  uid: number = 0
  title: string = ''
  replyCount: number = 0
  praiseCount: number = 0
  praise: boolean = false
  mine: boolean = false
  lastupdate: number = 0
  info: string = ''
  hits: number = 0
  examine: string = 'n'
  disableReason: string = ''
  disable: string = 'n'
  constructor() {}
}

/**
 * 帖子回复详情
 */
class MessageReply {
  user: TbUser = new TbUser()
  userInfo: TbUserInfo = new TbUserInfo()
  umid: number = 0
  umrid: number = 0
  uid: number = 0
  praiseCount: number = 0
  praise: boolean = false
  mine: boolean = false
  lastupdate: number = 0
  info: string = ''
  hits: number = 0
  examine: string = 'n'
  disableReason: string = ''
  disable: string = 'n'
  constructor() {}
}

/**
 * 留言板详情应答结果
 */
class MessageDetailResult extends BaseListResult<MessageReply> {
  info: MessageDetail = new MessageDetail()
}

export { MessageDetail as MessageDetail, MessageDetailResult as MessageDetailResult, MessageReply as MessageReply }
export default MessageDetailResult
