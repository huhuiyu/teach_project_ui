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

export { TbBucket as TbBucket, OssSign as OssSign }
