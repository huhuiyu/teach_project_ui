class TbBucket {
  bucketName: string = ''
  endpoint: string = ''
  expiration: string = ''
  info: string = ''
  obid: number = -1
  ocid: number = -1
  lastupdate: number = 0
  domains: string = ''
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
  obid: number = -1
  objectName: string = ''
  filename: string = ''
  contentType: string = ''
  filesize: number = 0
  fileinfo: string = ''
}

class UploadInfo {
  info: string = ''
  percent: number = 0
}

export { TbBucket as TbBucket, OssSign as OssSign, TbOssInfo as TbOssInfo, UploadInfo as UploadInfo }
