// 门户信息
class PortableInfo {
  pmid: number = 0
  accessKey: string = ''
  message: string = ''
  messageGroup: string = ''
  messageKey: string = ''
  lastupdate: number = 0

  constructor() {}
}

// 测试用门户信息
class TestPortableInfo {
  logo: string = ''
  qq: string = ''
  title: string = ''
}

class PortableInfoConverter<T extends Object> {
  convert(data: Array<PortableInfo>, t: T): T {
    data.forEach((element) => {
      if (element.messageKey in t) {
        t[element.messageKey] = element.message
      }
    })
    return t
  }
}

// 转换为json
function convert(data: Array<PortableInfo>): any {
  let json = {}
  data.forEach((element) => {
    json[element.messageKey] = element.message
  })
  return json
}

export { PortableInfo as PortableInfo, TestPortableInfo as TestPortableInfo, PortableInfoConverter as PortableInfoConverter, convert as convert }

export default PortableInfo
