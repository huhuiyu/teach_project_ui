import { thingDark } from 'naive-ui'
import plupload from 'plupload'
import FileInfo from '../entity/FileInfo'
import logger from './logger'

class OssUploadConfig {
  max_file_size: number = 200 * 1024 * 1024
  url: string = 'http://oss.aliyuncs.com'
  prevent_duplicates: boolean = true
  multi_selection: boolean = true
  constructor() {}
}

class UploadOssInfo {
  host: string
  key: string
  policy: string
  OSSAccessKeyId: string
  //让服务端返回200,不然，默认会返回204
  success_action_status: string
  signature: string
  constructor(
    host: string,
    key: string,
    policy: string,
    OSSAccessKeyId: string,
    signature: string,
    //让服务端返回200,不然，默认会返回204
    success_action_status: string = '200'
  ) {
    this.host = host
    this.key = key
    this.policy = policy
    this.OSSAccessKeyId = OSSAccessKeyId
    this.signature = signature
    this.success_action_status = success_action_status
  }
}
/**
 * oss文件上传
 */
class OssUploader {
  uploader: plupload.Uploader
  config: OssUploadConfig
  ossinfo: UploadOssInfo
  fileinfo: FileInfo
  element: HTMLElement
  constructor(config: OssUploadConfig, ossinfo: UploadOssInfo, fileinfo: FileInfo) {
    this.config = config
    this.ossinfo = ossinfo
    this.fileinfo = fileinfo
    // 创建不存在的元素初始化上传组件
    let eleupdiv = document.createElement('div')
    eleupdiv.style.display = 'none'
    let eleupspan = document.createElement('span')
    eleupdiv.append(eleupspan)
    this.element = eleupdiv
    document.body.append(eleupdiv)
    // 创建上传对象实例
    this.uploader = new plupload.Uploader({
      runtimes: 'html5,html4',
      //触发文件选择对话框的按钮，为那个元素id
      browse_button: eleupspan,
      //服务器端的上传页面地址
      url: config.url,
      filters: {
        max_file_size: config.max_file_size,
        prevent_duplicates: config.prevent_duplicates,
      },
      multi_selection: config.multi_selection,
    })
  }

  start() {
    let instance = this
    instance.uploader.bind('PostInit', () => {
      logger.debug('启动传送任务')
      instance.uploader.addFile(instance.fileinfo.file)
      instance.uploader.setOption({
        url: instance.ossinfo.host,
        multipart_params: {
          key: instance.ossinfo.key,
          policy: instance.ossinfo.policy,
          OSSAccessKeyId: instance.ossinfo.OSSAccessKeyId,
          //让服务端返回200,不然，默认会返回204
          success_action_status: instance.ossinfo.success_action_status,
          signature: instance.ossinfo.signature,
        },
      })
      this.uploader.start()
    })
    instance.uploader.bind('UploadComplete', () => {
      // 移除绑定的虚拟元素
      instance.element.remove()
    })
    instance.uploader.init()
  }
}
export { OssUploader as OssUploader, UploadOssInfo as UploadOssInfo, OssUploadConfig as OssUploadConfig }

export default OssUploader
