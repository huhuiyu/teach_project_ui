<template>
  <div>
    <back-comp></back-comp>
    <div class="text-center pd10 fs20"> <i class="iconfont">&#xe63e;</i> {{ title }}</div>
    <div>
      <!-- 数据呈现 -->
      <div v-loading="loading">
        <el-table :data="list">
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="首次留言时间">
            <template slot-scope="info">
              {{ info.row.lastupdate | formatDate }}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="info">
              <el-button type="primary" @click="showDetail(info.row)"><i class="iconfont">&#xe63f;</i> 查看留言信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div v-loading="loading" class="flex-box pd10">
        <page :page="page" @change-page="query"></page>
      </div>

      <!-- 详细信息 -->
      <el-dialog :visible.sync="detailVisible" :close-on-click-modal="false" title="邮箱留言信息">
        <email-info-comp :info="detailInfo"></email-info-comp>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import BackComp from '../../components/BackComp.vue'
import EmailInfoComp from '../../components/EmailInfoComp.vue'
import Page from '../../components/Page.vue'

export default {
  name: 'UserEmailInfo',
  components: { Page, EmailInfoComp, BackComp },
  data() {
    return {
      title: '邮箱留言信息管理',
      queryInfo: {
        email: '',
        username: '',
      },
      page: {
        pageSize: 5,
      },
      list: [],
      loading: false,
      detailInfo: {},
      detailVisible: false,
    }
  },
  methods: {
    showDetail(info) {
      this.detailInfo = info
      this.detailVisible = true
    },
    query() {
      this.loading = true
      this.$ajax('/portable/emailinfo/queryAllEmail', this.$concatJson(this.queryInfo, this.page), (data) => {
        this.loading = false
        if (!data.success) {
          this.$alert(data.message, '错误')
          return
        }
        this.list = data.list
        this.page = data.page
      })
    },
  },
  created() {
    this.query()
  },
}
</script>
