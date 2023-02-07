class TbBucket {
  bucketName: string = ''
  cachetime: string = ''
  endpoint: string = ''
  expiration: string = ''
  info: string = ''
  obid: number = -1
  ocid: number = -1
  lastupdate: number = 0
  domains: string = ''
  enable: String = 'y'
  constructor() {}
}

class OssSign {
  objectName: string = ''
  policyBase64: string = ''
  expiration: string = ''
  signature: string = ''
  dir: string = ''
  host: string = ''
  expire: number = 0
  accessid: string = ''
}

class TbOssInfo {
  // bucket: TbBucket = new TbBucket()
  obid: number = -1
  objectName: string = ''
  // oiid: number = -1
  filename: string = ''
  contentType: string = ''
  filesize: number = 0
  fileinfo: string = ''
  lastupdate: number = -1
}
class queryTbOssInfoclss {
  bucket: TbBucket = new TbBucket()
  obid: number = -1
  objectName: string = ''
  oiid: number = -1
  filename: string = ''
  contentType: string = ''
  filesize: number = 0
  fileinfo: string = ''
  lastupdate: number = -1
}

class UploadInfo {
  info: string = ''
  percent: number = 0
  success: boolean = true
  errorInfo: any = null
}

class OssConfig {
  accessKeyId: string = ''
  accessKeySecret: string = ''
  description: string = ''
  enable: string = 'y'
  lastupdate: string = ''
  ocid: number = 0
  uid: number = 0
}
class OssEndPoints {
  region: string = ''
  regionId: string = ''
  endpoint: string = ''
  internalEndpoint: string = ''
  length: any = null
}
export { TbBucket as TbBucket, OssSign as OssSign, TbOssInfo as TbOssInfo, UploadInfo as UploadInfo, OssConfig as OssConfig, OssEndPoints as OssEndPoints, queryTbOssInfoclss as queryTbOssInfoclss }
