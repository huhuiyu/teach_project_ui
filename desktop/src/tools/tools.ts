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
  openFile: (cb: any) => {
    let result = new FileInfo()
    let file = document.createElement('input')
    file.setAttribute('type', 'file')
    result.el = file
    // 文件改变事件
    file.addEventListener('change', () => {
      logger.debug('文件选中变化', file.files)
      if (file.files && file.files.length == 1) {
        tools.getFileInfo(file.files[0], result)
        logger.debug("获取文件信息：", tools.getFileInfo(file.files[0]))
        cb(result)
      }
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
    let reader = new FileReader();
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
    return ((filesize / Math.pow(k, i)).toFixed(1)) + '' + sizes[i]
  }
}

export default tools