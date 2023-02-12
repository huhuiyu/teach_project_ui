//超级管理信息
class LogInfo {
  lid: number = 0
  logInfo: string = ''
  logType: string = ''
  lastupdate: number = 0
  constructor() {}
}

class SystemConfig {
  imageCodeAmount: number = 0
  imageCodeLength: number = 0
  imageCodeTimeout: number = 0
  ipBanTimeout: number = 0
  ipMaxTokenCount: number = 0
  loginPasswordErrorLimit: number = 0
  loginPasswordErrorTimeout: number = 0
  mailCodeTimeout: number = 0
  phoneCodeTimeout: number = 0
  tokenTimeout: number = 0
  constructor() {}
}
class SystemUser {
  uid: number = 0
  accessKey: string = ''
  enable: string = ''
  nickname: string = ''
  password: string = ''
  role: string = ''
  username: string = ''
  lastupdate: number = 0
  constructor() {}
}
export { LogInfo as LogInfo, SystemConfig as SystemConfig, SystemUser as SystemUser }
