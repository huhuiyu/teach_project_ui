// ajax配置信息对象
class AjaxConfig {
  method: string = 'POST'
  url: string = ''
  param: any = {}
  cb: any = () => { }
  handleMessage: boolean = false
  returnPromise: boolean = false
  headers: any = {}
  paramObj: any = {}
  constructor() { }

  static buildConfig(url: string, param: any, cb: any, method: string, handleMessage: boolean, returnPromise = false): AjaxConfig {
    let config = new AjaxConfig()
    config.url = url
    config.param = param
    config.cb = cb
    config.method = method
    config.handleMessage = handleMessage
    config.returnPromise = returnPromise
    return config
  }

  static buildPostConfig(url: string, param: any, cb: any, handleMessage = false): AjaxConfig {
    return this.buildConfig(url, param, cb, 'POST', handleMessage)
  }

  static buildGetConfig(url: string, param: any, cb: any, handleMessage = false): AjaxConfig {
    return this.buildConfig(url, param, cb, 'GET', handleMessage)
  }

  static buildPostConfigPromise(url: string, param: any, cb: any, handleMessage = false): AjaxConfig {
    let config = this.buildPostConfig(url, param, cb, handleMessage)
    config.returnPromise = true
    return config
  }

  static buildGetConfigPromise(url: string, param: any, cb: any, handleMessage = false): AjaxConfig {
    let config = this.buildGetConfig(url, param, cb, handleMessage)
    config.returnPromise = true
    return config
  }
}

export default AjaxConfig