<template>
  <div v-if="page.pageCount > 1">
    <el-pagination background :layout="layout" :page-sizes="sizes" @current-change="changePage" @size-change="changeSize" :page-size="page.pageSize" :page-count="page.pageCount" :current-page="page.pageNumber" :total="page.total"></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    page: {
      default() {
        return {}
      },
    },
    layout: {
      default() {
        return 'total,prev,pager,next,sizes'
      },
    },
    sizes: {
      default() {
        return [5, 8, 10, 20, 50, 100]
      },
    },
  },
  methods: {
    changePage(pn) {
      this.page.pageNumber = pn
      this.$emit('change-page', this.page)
    },
    changeSize(ps) {
      this.page.pageSize = ps
      this.$emit('change-page', this.page)
    },
  },
}
</script>
