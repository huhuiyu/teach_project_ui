class ClassInfo {
  cid: number = 0
  cinfo: string = ''
  cname: string = ''
  lastupdate: string = ''
}

class StudentInfo {
  cid: number = 0
  sid: number = 0
  sname: string = ''
  phone: string = ''
  wechat: string = ''
  qq: string = ''
  address: string = ''
  lastupdate: string = ''
  tbUser: TbClass = new TbClass()
}
class TbClass {
  cid: number = 0
  cname: string = ''
  cinfo: string = ''
  lastupdate: string = ''
}

export { ClassInfo as ClassInfo, StudentInfo as StudentInfo }
