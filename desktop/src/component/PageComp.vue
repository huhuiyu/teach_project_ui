<script setup lang="ts">
import { NPagination } from 'naive-ui'
import { computed } from 'vue'
import { PageInfo } from '../entity/BaseResult'
import logger from '../tools/logger'

const props = defineProps({
  page: {
    type: Object,
    required: true,
    default: new PageInfo(),
  },
  showSizePicker: {
    type: Boolean,
    requeired: false,
    default: false,
  },
})

const pageInfo = computed(() => {
  return props.page
})

const emits = defineEmits(['number-change', 'size-change', 'page-change'])

const changeNumber = (pageNumber: number) => {
  pageInfo.value.pageNumber = pageNumber
  emits('number-change', pageNumber, props.page)
  emits('page-change', props.page)
}
const changeSize = (pageSize: number) => {
  pageInfo.value.pageSize = pageSize
  emits('size-change', pageSize, props.page)
  emits('page-change', props.page)
}

logger.debug('初始化分页组件')
</script>

<template>
  <div class="flex-box-center">
    <div><slot></slot></div>
    <div class="mr05">
      {{ pageInfo }}
      <n-pagination :item-count="pageInfo.total" :page-size="pageInfo.pageSize" :page="pageInfo.pageNumber" :page-sizes="[5, 10, 20]" :showSizePicker="showSizePicker" @update-page="changeNumber" @update:page-size="changeSize" />
    </div>
    <div> <slot name="page-end"></slot></div>
  </div>
</template>
