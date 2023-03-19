import { VNodeChild } from 'vue'

class MenuInfo {
  mid: number = 0
  parent: number | string = -1
  url: string = ''
  text: string = ''
  info: string = ''
  icon: string | any
  iconMenu: any
  role: string = ''
  enable: string = 'y'
  lastupdate: string | number = ''
  key: number = 0
  label: string = ''
  children: Array<MenuInfo> = []
  prefix: any
  constructor(mid: number, parent: number, url: string, text: string, icon: string, role: string, enable: string, lastupdate: string | number) {
    this.mid = mid
    this.parent = parent
    this.url = url
    this.text = text
    this.icon = icon
    this.iconMenu = icon
    this.role = role
    this.enable = enable
    this.lastupdate = lastupdate
    this.key = mid
    this.label = text
  }
}
export { MenuInfo as MenuInfo }
