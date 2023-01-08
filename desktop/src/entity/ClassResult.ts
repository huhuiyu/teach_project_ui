class ClassInfo {
  cid: number = 0
  cinfo: string = ''
  cname: string = ''
  lastupdate: number = 0
}

class StudentInfo {
  cid: number = 0
  sid: number = 0
  sname: string = ''
  phone: string = ''
  wechat: string = ''
  qq: string = ''
  address: string = ''
  lastupdate: number = 0
  tbClass: ClassInfo = new ClassInfo()
}

export { ClassInfo as ClassInfo, StudentInfo as StudentInfo }
