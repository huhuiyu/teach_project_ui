import sparkMd5 from 'spark-md5'

let tools = {
  md5: (info: string) => {
    return info.trim().length > 0 ? sparkMd5.hash(info) : ''
  }
}

export default tools