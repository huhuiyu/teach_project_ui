import { CityInfo } from '../entity/CityInfo'
import logger from '../tools/logger'

class CityInfoDAO {
  private static instance: CityInfoDAO = new CityInfoDAO()
  localKey: string = 'huhuiyu.teach-project-cityinfo'
  load(): CityInfo {
    let info = localStorage.getItem(this.localKey)
    if (info) {
      return JSON.parse(info)
    }
    return new CityInfo()
  }
  save(cityInfo: CityInfo | null): void {
    logger.debug('保存用户信息：', cityInfo)
    if (cityInfo == null) {
      localStorage.removeItem(this.localKey)
    } else {
      localStorage.setItem(this.localKey, JSON.stringify(cityInfo))
    }
  }

  static getInstance() {
    return this.instance
  }

  private constructor() {}
}
export default CityInfoDAO
