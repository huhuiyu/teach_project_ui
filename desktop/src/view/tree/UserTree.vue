<template>
  <MainTopNavComp title="用户菜单"></MainTopNavComp>
  <div class="container">
    <aside>
      <n-menu :options="MenuData.list" accordion key-field="mid" label-field="text"></n-menu>
    </aside>
    <main></main>
  </div>
</template>

<script setup lang="ts">
import { NMenu } from 'naive-ui'
import { reactive, h } from 'vue'
import MainTopNavComp from '../../component/Home/MainTopNavComp.vue'
import { BaseListResult } from '../../entity/BaseResult'
import { MenuInfo } from '../../entity/MenuInfo'
import server from '../../tools/server'

const MenuData = reactive({
  list: [] as MenuInfo[],
})
const queryUserMenu = () => {
  server.post('/user/auth/queryUserMenu', {}, (data: BaseListResult<MenuInfo>) => {
    if (data.success) {
      MenuData.list = arrToTree1(data.list)
    }
  })
}

const arrToTree1 = (arr: Array<MenuInfo>) => {
  let objMap = {}
  let result = [] as any
  arr.forEach((element) => {
    element.iconMenu = element.icon
    element.icon = () => h('i', { class: 'iconfont', innerHTML: element.iconMenu })
    if (!objMap[element.mid]) {
      objMap[element.mid] = []
    }
    if (objMap[element.mid]) {
      element.children = objMap[element.mid]
    }
    if (element.parent != -1) {
      if (!objMap[element.parent]) {
        objMap[element.parent] = []
      }
      objMap[element.parent].push(element)
    }
    if (element.parent == -1) {
      result.push(element)
    }
  })
  return result
}
queryUserMenu()
</script>
<style scoped>
.container {
  display: flex;
}
aside {
  flex: 2;
}
main {
  flex: 7;
}
</style>
