import logger from '../js/logger'
import serverInfo from './server'

let tools = {}
// 格式化日期
tools.formatDate = function (value, format) {
  try {
    // 获取日期格式参数
    format = format ? format : 'yyyy-MM-dd hh:mm:ss'
    if (!isNaN(value) && !(value instanceof Date)) {
      let time = new Date()
      time.setTime(parseInt(value))
      value = time
    }
    let year = value.getFullYear() + ''
    let month = value.getMonth() + 1
    let day = value.getDate()
    let hour = value.getHours()
    let minute = value.getMinutes()
    let second = value.getSeconds()
    month = month < 10 ? '0' + month : '' + month
    day = day < 10 ? '0' + day : '' + day
    hour = hour < 10 ? '0' + hour : '' + hour
    minute = minute < 10 ? '0' + minute : '' + minute
    second = second < 10 ? '0' + second : '' + second
    format = format.replace('yyyy', year)
    format = format.replace('MM', month)
    format = format.replace('dd', day)
    format = format.replace('hh', hour)
    format = format.replace('mm', minute)
    format = format.replace('ss', second)
    return format
  } catch (ex) {
    logger.error(ex)
    return ''
  }
}

// 是否为手机模式
tools.isMobile = function () {
  return tools.getBrowserInfo().versions.mobile
}

// 是否为ios
tools.isIos = function () {
  return tools.getBrowserInfo().versions.ios
}
// 是否为android
tools.isAndroid = function () {
  return tools.getBrowserInfo().versions.android
}
// 是否为weixin
tools.isWx = function () {
  return tools.getBrowserInfo().versions.weixin
}

// 获取浏览器信息
tools.getBrowserInfo = function () {
  let browser = {
    versions: (function () {
      let u = navigator.userAgent
      // let app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == ' qq', //是否QQ
      }
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
  }

  return browser
}

// json格式化
const styles = {
  key: 'color: red',
  string: 'color: fuchsia',
  number: 'color: green',
  boolean: 'color: maroon',
  other: 'color: maroon',
}

tools.formatJson = function (json, highlight) {
  // 缩进显示json字符串
  const result = JSON.stringify(json, undefined, 4)
  if (highlight) {
    return tools.jsonSyntaxHighlight(result)
  }
  return result
}

tools.jsonSyntaxHighlight = function (json) {
  // 格式化显示json
  // json语法高亮
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let style = 'number'
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        style = 'key'
      } else {
        style = 'string'
      }
    } else if (/true|false/.test(match)) {
      style = 'boolean'
    } else if (/null/.test(match)) {
      style = 'other'
    }
    return '<span style="' + styles[style] + '">' + match + '</span>'
  })
  return json
}

// 文件相关功能
// 获取文件扩展名
tools.getFileSuffix = function (filename) {
  let pos = filename.lastIndexOf('.')
  let suffix = ''
  if (pos != -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

// 获取大类型名称
tools.getFileType = function (type) {
  let index = type.indexOf('/')
  return index > -1 ? type.substring(0, index) : type
}

// 打开文件选中对话框并获取文件
tools.openFile = function (cb, instance) {
  let result = { el: null, file: null, type: '' }
  let file = document.createElement('input')
  file.setAttribute('type', 'file')
  result.el = file
  // 文件改变事件
  file.addEventListener('change', function () {
    logger.debug('文件选中变化', file.files)
    if (file.files && file.files.length == 1) {
      result.file = file.files[0]
      result.type = tools.getFileType(result.file.type)
      result.suffix = tools.getFileSuffix(result.file.name)
      cb.call(instance, result)
      return
    }
    cb.call(instance, null)
  })
  file.addEventListener('cancel', function () {
    logger.debug('文件选中取消')
    cb.call(instance, null)
  })
  file.click()
}

// 获取文件信息
tools.getFileInfo = function (file) {
  return {
    suffix: tools.getFileSuffix(file.name),
    size: file.size,
    type: file.type,
    origSize: file.origSize,
    name: file.name,
  }
}

// 复制文本的方法
tools.copyText = async (str) => {
  // 尝试先用剪贴板api复制文本
  try {
    await navigator.clipboard.writeText(str)
    logger.debug('剪贴板复制文本成功')
    return
  } catch (err) {
    logger.debug('剪贴板复制文本失败: ', err)
  }
  // 不成功则用原始的方式复制
  let input = document.createElement('input')
  input.readOnly = 'readonly'
  input.value = str
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, input.value.length)
  document.execCommand('Copy')
  document.body.removeChild(input)
  logger.debug('原始api复制文本成功')
}

tools.getDownloadUrl = function (fid) {
  return serverInfo.serverUrl + '/user/file/download?fid=' + fid
}

export default tools
