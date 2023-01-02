import Ajax from './Ajax'
import AjaxConfig from '../entity/AjaxConfig'
import qs from 'qs'

let serverInfo = {
  url: 'https://service.huhuiyu.top/teach_project_service',
  websocket: 'wss://service.huhuiyu.top/teach_project_service/ws/',
  tokenKey: 'teach_project_service_token',
  saveToken: (data: any) => {
    if (data && data.token) {
      localStorage.setItem(serverInfo.tokenKey, data.token)
    }
  },
  loadToken() {
    let token = localStorage.getItem(serverInfo.tokenKey)
    return token ? token : ''
  },
}

// 创建ajax实例
const ajax = new Ajax()
// 前置函数
ajax.before = (config: AjaxConfig) => {
  // 请求地址补全
  config.url = serverInfo.url + config.url
  // 处理json参数
  config.param = qs.stringify(config.param, { allowDots: true })
  // 处理get请求（如果链接带有?查询参数就拼接&，否则就直接拼接查询参数）
  let getStr = config.url.indexOf('?') > -1 ? '&' : '?'
  if (config.method.toLowerCase() == 'get') {
    config.url = config.url + getStr + config.param
    config.param = ''
  }

  // 处理token头信息
  let headers = config.headers ? config.headers : {}
  headers.token = serverInfo.loadToken()
  config.headers = headers
}

// 应答函数
ajax.after = (data: any) => {
  serverInfo.saveToken(data)
}

const server = {
  post: (url: string, param: any, cb: any, handleMessage = false) => {
    ajax.send(AjaxConfig.buildPostConfig(url, param, cb, handleMessage))
  },
  get: (url: string, param: any, cb: any, handleMessage = false) => {
    ajax.send(AjaxConfig.buildGetConfig(url, param, cb, handleMessage))
  },
  upload: (url: string, file: File, param: any, cb: any, handleMessage = false) => {
    let config = AjaxConfig.buildPostConfig(url, param, cb, handleMessage)
    ajax.upload(config, file)
  },
  // 获取文件下载地址
  getDownloadUrl: (fid: number | string) => {
    return serverInfo.url + `/user/file/download?fid=${fid}`
  },
  // 是否为文件下载地址，如果是返回fid信息，否则返回-1
  isDownloadUrl: (url: string) => {
    const baseUrl = serverInfo.url + '/user/file/download?fid='
    let index = url.indexOf(baseUrl)
    if (index == 0) {
      return url.replace(baseUrl, '')
    } else {
      return -1
    }
  },
}

export default server
