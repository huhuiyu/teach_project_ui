class BaseResult {
  success: boolean = false
  message: string = ''
  code: number = 500
  data: any
  page: any
  list: Array<any> = []
}

export default BaseResult
