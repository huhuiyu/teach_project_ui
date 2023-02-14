class UserOtherInfo {
	follow: number = 0
	followMe: number = 0
	followMine: boolean = false
	message: number = 0
	mineFollow: boolean = false
	regDays: number = 0
	reply: number = 0
	supporteMessage: number = 0
	supporteReply: number = 0
	totalHits: number = 0

	constructor() { }
}

class TbUserInfo {
	email: string = ''
	img: string = ''
	lastupdate: number = 0
	info: string = ''
	phone: string = ''
	qq: string = ''
	sex: string = ''
	wechat: string = ''
	uid: number = 0

	constructor() { }
}

class TbUser {
	accessKey: string = ''
	enable: string = ''
	lastupdate: number = 0
	nickname: string = ''
	password: string = ''
	role: string = ''
	uid: number = 0
	username: string = ''
	constructor() { }
}

export { TbUser as TbUser, TbUserInfo as TbUserInfo, UserOtherInfo as UserOtherInfo }

