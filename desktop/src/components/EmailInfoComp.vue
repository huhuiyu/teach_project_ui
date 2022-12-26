<template>
  <div>
    <div style="display: none">{{ peid }}</div>
    <div class="text-center pd10">{{ info.email }}({{ info.username }})</div>
    <div>
      <!-- 数据呈现 -->
      <div v-loading="loading">
        <el-table :data="list">
          <el-table-column label="留言信息" prop="info"></el-table-column>
          <el-table-column label="留言时间">
            <template slot-scope="info">
              {{ info.row.lastupdate | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="是否为回复">
            <template slot-scope="info">
              <el-switch v-model="info.row.infoType" :disabled="true" active-value="website" inactive-value="user"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div v-loading="loading" class="flex-box pd10">
        <page :page="page" @change-page="query"></page>
      </div>
      <!-- 回复 -->
      <div class="text-center" v-loading="loading">
        <el-form>
          <el-form-item>
            <el-input v-model="replyInfo.info" :autosize="{ minRows: 4, maxRows: 4 }" type="textarea" placeholder="回复内容">
              <i slot="prefix" class="el-input__icon iconfont">&#xe914;</i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reply"> <i class="iconfont">&#xe60d;</i> 回复 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Page from '../components/Page.vue'
export default {
  name: 'EmailInfoComp',
  components: { Page },
  data() {
    return {
      queryInfo: {
        peid: -1,
      },
      page: {
        pageSize: 5,
      },
      list: [],
      loading: false,
      replyInfo: {},
    }
  },
  props: {
    info: {
      default() {
        return { peid: -1 }
      },
    },
  },
  computed: {
    peid() {
      this.$logger.debug('信息更新', this.info)
      // 相同信息不要触发查询
      if (this.info.peid != this.queryInfo.peid) {
        this.query()
      }
      return this.info.peid
    },
  },
  methods: {
    reply() {
      this.replyInfo.peid = this.queryInfo.peid
      this.loading = true
      this.$ajax('/portable/emailinfo/reply', this.replyInfo, (data) => {
        this.loading = false
        this.$alert(data.message, '错误')
        this.query()
        if (data.success) {
          this.replyInfo.info = ''
          return
        }
      })
    },
    query() {
      this.$logger.debug('查询', this.info)
      this.queryInfo.peid = this.info.peid
      this.loading = true
      this.$ajax('/portable/emailinfo/queryAll', this.$concatJson(this.queryInfo, this.page), (data) => {
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
}
</script>
