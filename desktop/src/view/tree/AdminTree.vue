<template>
  <MainTopNavComp title="管理菜单"></MainTopNavComp>
  <div class="container">
    <aside>
      <n-card>
        <n-tree :show-irrelevant-nodes="false" :data="MenuData.list" block-line @update:expanded-keys="queryAdminMenu" accordion :node-props="MenuData.nodeProps" key-field="mid" label-field="text" />
        <n-menu :options="MenuData.list" accordion key-field="mid" label-field="text" @update:expanded-keys="test" @update:value="test"></n-menu>
      </n-card>

      <n-dropdown trigger="manual" placement="bottom-start" :show="MenuData.showDropdown" :options="MenuData.options" :x="MenuData.x" :y="MenuData.y" @select="handleSelect" />
    </aside>
    <main></main>
    <n-modal v-model:show="MenuData.modal" preset="dialog" title="菜单项" @after-leave="resetData(MenuData.Info)">
      <n-form ref="fromRef" :model="MenuData.Info" label-placement="left" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }" :rules="MenuData.Rules">
        <n-form-item path="icon">
          <n-input v-model:value="MenuData.Info.icon" placeholder="输入菜单的图标" />
        </n-form-item>
        <n-form-item path="info">
          <n-input v-model:value="MenuData.Info.info" placeholder="输入菜单的描述信息" />
        </n-form-item>
        <n-form-item path="role">
          <n-select v-model:value="MenuData.Info.role" placeholder="选择用户角色" multiple :options="MenuData.role" />
        </n-form-item>
        <n-form-item path="text">
          <n-input v-model:value="MenuData.Info.text" placeholder="菜单文本" />
        </n-form-item>
        <n-form-item path="url">
          <n-input v-model:value="MenuData.Info.url" placeholder="菜单地址" />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="addOrModifyMenu()" class="mr05">{{ MenuData.selected == 'modify' ? '修改' : '添加' }}</n-button>
          <n-button type="error" size="small" @click="MenuData.modal = false" class="mr05">关闭</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { NButton, NDropdown, NForm, NFormItem, NInput, NModal, NTree, TreeOption, FormInst, NSelect, NCard, NMenu } from 'naive-ui'
import { reactive, h, ref } from 'vue'
import MainTopNavComp from '../../component/Home/MainTopNavComp.vue'
import BaseResult, { BaseListResult } from '../../entity/BaseResult'
import { MenuInfo } from '../../entity/MenuInfo'
import dialogApi from '../../tools/dialog'
import server from '../../tools/server'
const fromRef = ref<FormInst | null>(null)
const MenuData = reactive({
  list: [] as MenuInfo[],
  modal: false,
  loading: {
    add: false,
  },
  Info: {
    icon: '',
    info: '',
    parent: '' as any,
    role: '',
    text: '',
    url: '',
    mid: '' as any,
  },
  Rules: {
    icon: [
      {
        required: true,
        message: '请输入菜单的图标',
        trigger: ['input', 'blur'],
      },
    ],
    info: [
      {
        required: true,
        message: '请输入菜单描述信息',
        trigger: ['input', 'blur'],
      },
    ],
    role: [
      {
        type: 'array',
        required: true,
        message: '请选择菜单权限角色',
        trigger: ['input', 'blur'],
      },
    ],
    text: [
      {
        required: true,
        message: '请输入菜单的文本',
        trigger: ['input', 'blur'],
      },
    ],
    url: [
      {
        required: true,
        message: '请输入菜单的地址',
        trigger: ['input', 'blur'],
      },
    ],
  } as any,
  //用户权限role
  role: [
    { value: 'app-admin', label: 'app管理员' },
    { value: 'admin', label: '超级管理员' },
    { value: 'user', label: '登录用户' },
    { value: '', label: '无需登录' },
  ],
  //记录点击操作
  selected: 'add',
  //右击菜单
  options: [
    { label: '添加子级', key: 'addSon' },
    { label: '添加同级', key: 'add' },
    { label: '修改', key: 'modify' },
    { label: '删除', key: 'del' },
  ],
  x: 0,
  y: 0,
  showDropdown: false,
  nodeProps: ({ option }: { option: TreeOption }) => {
    return {
      onContextmenu(e: MouseEvent): void {
        for (const key in MenuData.Info) {
          MenuData.Info[key] = option[key]
        }
        MenuData.showDropdown = true
        MenuData.x = e.clientX
        MenuData.y = e.clientY
        e.preventDefault()
      },
    }
  },
})

//查询菜单项
const queryAdminMenu = (parent: string[] = ['-1'], option: any = {}) => {
  console.log('parent :>> ', parent, option)
  let result = parent.length != 1 ? parent[parent.length - 1] : parent[0]
  server.post('/admin/menu/queryMenusByParent', { parent: result }, (data: BaseListResult<MenuInfo>) => {
    if (data.success) {
      if (parent[0] == '-1') {
        MenuData.list = arrToTree1(data.list)
      } else if (result != '-1' && data.list.length > 0) {
        // 生产ui需要的键对值
        data.list.map((item: MenuInfo) => {
          item.iconMenu = item.icon
          item.prefix = () => h('i', { class: 'iconfont', innerHTML: item.iconMenu })
          item.icon = () => h('i', { class: 'iconfont', innerHTML: item.iconMenu })
          item.children = []
        })
        //添加到点击的菜单子集
        option[option.length - 1].children = data.list
      }
    }
  })
}
queryAdminMenu()
//添加菜单
const addOrModifyMenu = () => {
  fromRef.value?.validate().then(() => {
    MenuData.Info.role = MenuData.Info.role + ''
    if (MenuData.selected == 'addSon') {
      MenuData.Info.parent = MenuData.Info.mid
    }
    if (MenuData.selected.indexOf('add') > -1) delete MenuData.Info.mid
    server.post(`/admin/menu/${MenuData.selected == 'modify' ? 'update' : 'add'}`, MenuData.Info, (data: BaseResult) => {
      dialogApi.messageInfo(data.message)
      queryAdminMenu(['-1'])
    })
  })
}

const test = (key: any) => {
  console.log('key :>> ', key)
}

//重置数据
const resetData = (obj: object) => {
  for (const key in obj) {
    obj[key] = ''
  }
}
//右击选择打开添加或修改
const handleSelect = (key: string) => {
  //记录添加需要的项，删除不需要的
  let obj = { parent: MenuData.Info.parent, mid: MenuData.Info.mid }
  switch (key) {
    case 'add':
      resetData(MenuData.Info)
      MenuData.Info.mid = obj.mid
      MenuData.Info.parent = obj.parent
      MenuData.modal = true
      MenuData.selected = 'add'
      break
    case 'addSon':
      resetData(MenuData.Info)
      MenuData.Info.mid = obj.mid
      MenuData.Info.parent = obj.parent
      MenuData.modal = true
      MenuData.selected = 'addSon'
      break
    case 'modify':
      MenuData.modal = true
      MenuData.selected = 'modify'
      break
    case 'del':
      dialogApi.showWarning({
        title: '警告',
        content: `你确定删除'${MenuData.Info.text}'？,该项下面的菜单都会销毁`,
        positiveText: '确定',
        negativeText: '不确定',
        onPositiveClick: () => {
          server.post('/admin/menu/delete', { mid: MenuData.Info.mid }, (data: BaseResult) => {
            if (data.success) {
              dialogApi.messageInfo(data.message)
              queryAdminMenu(['-1'])
            }
          })
        },
        onNegativeClick: () => {
          resetData(MenuData.Info)
        },
      })
      break
  }
  MenuData.showDropdown = false
}
//平面数据转化为ui需要的树形格式（详情看test/ArrayToTree）
const arrToTree1 = (arr: Array<MenuInfo>) => {
  let objMap = {}
  let result = [] as any
  arr.forEach((element) => {
    element.iconMenu = element.icon
    element.prefix = () => h('i', { class: 'iconfont', innerHTML: element.iconMenu })
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
