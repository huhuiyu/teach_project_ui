<template>
  <div>
    <n-tree block-line checkable draggable />
    <div>
      <div v-for="d in toolsData.selected.get(-1)" :key="d.mid">
        <div>
          <div @click="query(d.mid)">{{ d.text }}</div>
          <div v-if="toolsData.selected.get(d.mid)">
            <div v-for="dd in toolsData.selected.get(d.mid)" :key="dd.mid">
              <div>{{ dd.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- {{ toolsData.selected.get(-1) }} -->
  </div>
</template>

<script setup lang="ts">
import { NTree } from 'naive-ui'
import { reactive } from 'vue'
import { BaseListResult } from '../../entity/BaseResult'
import server from '../../tools/server'

const toolsData = reactive({
  selected: new Map(),
})
const query = (parent: any) => {
  server.post('/admin/menu/queryMenusByParent', { parent: parent }, (data: BaseListResult<any>) => {
    
    toolsData.selected.set(parent, data.list)
  })
}
query(-1)
</script>

<style scoped></style>
