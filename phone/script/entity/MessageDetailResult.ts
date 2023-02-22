import { TbUser, TbUserInfo, UserOtherInfo } from '../entity/UserInfo'
import { BaseListResult } from '../entity/BaseResult'

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
	constructor() { }
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
	constructor() { }
}

/**
 * 帖子关注列表
 */
class MessageFollow {
	newMessage: number = 0
	user: TbUser = new TbUser()
	userInfo: TbUserInfo = new TbUserInfo()
	userOtherInfo: UserOtherInfo = new UserOtherInfo()
}

/**
 * 当前登录用户和指定用户的私信信息
 */

class PrivateMessage {
	from: string = ''
	info: string = ''
	lastupdate: string = ''
	read: boolean = false
	to: string = ''
}
/**
 * 查询留言举报原因
 */
class ExamineInfo {
	img: string = ''
	info: string = ''
	nickname: string = ''
	username: string = ''
}

/*
 *查询留言板公告
 */
class Announcement {
	info: string = ''
	lastupdate: string = ''
	niid: number = 0
	title: string = ''
}
/**
 * 留言板详情应答结果
 */
class MessageDetailResult extends BaseListResult<MessageReply> {
	info: MessageDetail = new MessageDetail()
}

export { MessageDetail as MessageDetail, MessageDetailResult as MessageDetailResult, MessageReply as MessageReply, MessageFollow as MessageFollow, PrivateMessage as PrivateMessage, ExamineInfo as ExamineInfo, Announcement as Announcement }
export default MessageDetailResult
