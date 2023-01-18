import sparkMd5 from 'spark-md5'
import FileInfo from '../entity/FileInfo'
import logger from './logger'

let tools = {
  md5: (info: string) => {
    return info.trim().length > 0 ? sparkMd5.hash(info) : ''
  },
  changeTitle: (title: string) => {
    const eletitle = document.querySelector('head > title')
    if (eletitle) {
      eletitle.innerHTML = '胡辉煜教学项目' + title
    }
  },
  // 格式化日期
  formatDate: (value: Date | Number, format = 'yyyy-MM-dd hh:mm:ss') => {
    try {
      let time = new Date()
      if (typeof value === 'number') {
        time.setTime(parseInt(value.toString()))
      } else if (value instanceof Date) {
        time = value
      }
      let year = time.getFullYear() + ''
      let month = time.getMonth() + 1 + ''
      let day = time.getDate() + ''
      let hour = time.getHours() + ''
      let minute = time.getMinutes() + ''
      let second = time.getSeconds() + ''
      let ms = time.getMilliseconds() + ''
      month = month.padStart(2, '0')
      day = day.padStart(2, '0')
      hour = hour.padStart(2, '0')
      minute = minute.padStart(2, '0')
      second = second.padStart(2, '0')
      ms = ms.padStart(3, '0')

      format = format.replace(/yyyy/g, year)
      format = format.replace(/MM/g, month)
      format = format.replace(/dd/g, day)
      format = format.replace(/hh/g, hour)
      format = format.replace(/mm/g, minute)
      format = format.replace(/ss/g, second)
      format = format.replace(/ms/g, ms)
      return format
    } catch (ex) {
      logger.error(ex)
      return ''
    }
  },
  // 打开文件选中对话框并获取文件
  openFile: (cb: Function, accept: string = '') => {
    let file = document.createElement('input')
    file.setAttribute('type', 'file')
    file.setAttribute('accept', accept)
    file.setAttribute('multiple', 'multiple')
    // 文件改变事件
    file.addEventListener('change', () => {
      logger.debug('文件选中变化', file.files)
      let files = new Array<FileInfo>()
      if (file.files) {
        for (let index = 0; index < file.files.length; index++) {
          const elefile = file.files[index]
          let result = tools.getFileInfo(elefile)
          result.el = file
          files.push(tools.getFileInfo(elefile))
        }
      }
      cb(files)
    })
    file.click()
  },
  // 获取文件信息
  getFileInfo: (file: File, fileinfo: FileInfo = new FileInfo()): FileInfo => {
    fileinfo.file = file
    fileinfo.size = file.size
    fileinfo.suffix = tools.getFileSuffix(file.name)
    fileinfo.type = tools.getFileType(file.type)
    fileinfo.name = file.name
    fileinfo.fulltype = file.type
    return fileinfo
  },
  // 获取文件扩展名
  getFileSuffix: (filename: string) => {
    let pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos != -1) {
      suffix = filename.substring(pos)
    }
    return suffix
  },
  // 获取大类型名称
  getFileType: (type: string) => {
    let index = type.indexOf('/')
    return index > -1 ? type.substring(0, index) : type
  },
  // 读取图片信息到dataurl
  readImg: (file: File, cb: any) => {
    if (tools.getFileType(file.type) != 'image') {
      cb('')
      return
    }
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      cb(reader.result)
    })

    reader.readAsDataURL(file)
  },
  // 格式化显示文件大小
  formatFileSize: (filesize: number) => {
    logger.debug('in filesize====>', filesize)
    if (filesize === 0) {
      return '0 B'
    }
    let k = 1024
    //单位值
    let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let i = Math.floor(Math.log(filesize) / Math.log(k))
    //.toPrecision(3)
    return (filesize / Math.pow(k, i)).toFixed(1) + '' + sizes[i]
  },

  // 是否为手机模式
  isMobile: () => {
    return tools.getBrowserInfo().versions.mobile
  },
  // 是否为ios
  isIos: () => {
    return tools.getBrowserInfo().versions.ios
  },
  // 是否为android
  isAndroid: () => {
    return tools.getBrowserInfo().versions.android
  },
  // 是否为weixin
  isWx: () => {
    return tools.getBrowserInfo().versions.weixin
  },
  // 获取浏览器信息
  getBrowserInfo: () => {
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
        }
      })(),
    }
    return browser
  },
  // 合并json
  concatJson: (...jsons: any) => {
    let json = {}
    for (let index = 0; index < jsons.length; index++) {
      const element = jsons[index]
      for (let key in element) {
        json[key] = element[key]
      }
    }
    return json
  },
}

export default tools
