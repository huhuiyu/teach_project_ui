<template>
  <div>
    <back-comp></back-comp>
    <div class="text-center pd10 fs20"> <i class="iconfont">&#xe699;</i> {{ title }}</div>

    <div class="flex-box-right pd10">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="分组（多个分组用,分隔）" v-model="queryInfo.messageGroup">
            <i slot="prefix" class="el-input__icon iconfont">&#xe613;</i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="requery()"><i class="iconfont">&#xe622;</i> 查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="showAdd"><i class="iconfont">&#xe614;</i> 添加信息</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportInfo"><i class="iconfont">&#xe6c9;</i> 导出信息</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="showImport"><i class="iconfont">&#xe6ca;</i> 导入信息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据呈现 -->
    <div v-loading="loading">
      <el-table :data="list">
        <el-table-column label="分组" prop="messageGroup"></el-table-column>
        <el-table-column label="标志键名" prop="messageKey"></el-table-column>
        <el-table-column label="内容" prop="message"></el-table-column>
        <el-table-column label="最后时间">
          <template slot-scope="info">
            {{ info.row.lastupdate | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button type="primary" size="small" @click="showModify(info.row)"> <i class="iconfont">&#xe609;</i> 修改</el-button>
            <el-button type="danger" size="small" @click="del(info.row)"> <i class="iconfont">&#xe61c;</i> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div v-loading="loading" class="flex-box pd10">
      <page :page="page" @change-page="query"></page>
    </div>

    <!-- 添加对话框 -->
    <el-dialog :visible.sync="addVisible" title="添加信息" @closed="query">
      <div v-loading="adding">
        <el-form>
          <el-form-item>
            <el-input placeholder="分组" v-model="addInfo.messageGroup">
              <i slot="prefix" class="el-input__icon iconfont">&#xe613;</i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="标志键名" v-model="addInfo.messageKey">
              <i slot="prefix" class="el-input__icon iconfont">&#xe7e1;</i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" placeholder="信息" v-model="addInfo.message">
              <i slot="prefix" class="el-input__icon iconfont">&#xe7a3;</i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" v-loading="adding">
        <el-button @click="addVisible = false"><i class="iconfont">&#xe61b;</i> 取消</el-button>
        <el-button type="primary" @click="add"><i class="iconfont">&#xe61d;</i> 添加</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog :visible.sync="modifyVisible" title="修改信息" @closed="query">
      <div v-loading="modifying">
        <el-form>
          <el-form-item>
            <el-input placeholder="分组" v-model="modifyInfo.messageGroup">
              <i slot="prefix" class="el-input__icon iconfont">&#xe613;</i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="标志键名" v-model="modifyInfo.messageKey">
              <i slot="prefix" class="el-input__icon iconfont">&#xe7e1;</i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="textarea" placeholder="信息" v-model="modifyInfo.message">
              <i slot="prefix" class="el-input__icon iconfont">&#xe7a3;</i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" v-loading="modifying">
        <el-button @click="modifyVisible = false">取消</el-button>
        <el-button type="primary" @click="modify">保存</el-button>
      </div>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog :visible.sync="exportVisible" title="信息导出">
      <div v-loading="exporting">
        <div class="export-info">
          {{ exportData }}
        </div>
      </div>
      <div slot="footer" v-loading="exporting">
        <el-button @click="exportVisible = false"><i class="iconfont">&#xe61b;</i> 关闭</el-button>
        <el-button type="primary" @click="copyExportData"><i class="iconfont">&#xe656; </i>复制</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :visible.sync="importVisible" title="信息导入">
      <div v-loading="importing">
        <div class="export-info">
          <el-input type="textarea" placeholder="导入数据" v-model="importData">
            <i slot="prefix" class="el-input__icon iconfont">&#xe613;</i>
          </el-input>
        </div>
      </div>
      <div slot="footer" v-loading="importing">
        <el-button @click="importVisible = false"><i class="iconfont">&#xe61b;</i> 关闭</el-button>
        <el-button type="primary" @click="importInfo"><i class="iconfont">&#xe8c7;</i> 导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BackComp from '../../components/BackComp.vue'
import Page from '../../components/Page.vue'
export default {
  components: { Page, BackComp },
  name: 'PortableInfo',
  data() {
    return {
      title: '门户信息',
      queryInfo: {},
      page: {
        pageNumber: 1,
        pageSize: 5,
      },
      loading: false,
      list: [],
      addInfo: {},
      addVisible: false,
      adding: false,
      modifyInfo: {},
      modifyVisible: false,
      modifying: false,
      exportVisible: false,
      exporting: false,
      exportData: '',
      importVisible: false,
      importing: false,
      importData: '',
    }
  },
  methods: {
    showImport() {
      this.importData = ''
      this.importVisible = true
    },
    importInfo() {
      this.importing = true
      this.$ajax('/portable/message/import', { data: this.importData }, (data) => {
        this.importing = false
        if (!data.success) {
          this.$alert(data.message, '错误')
          return
        }
        this.$alert(data.message, '成功')
      })
    },
    copyExportData() {
      this.$copyText(this.exportData)
      this.$alert('已经将导出数据复制到剪贴板', '复制')
    },
    exportInfo() {
      this.exportVisible = true
      this.exporting = true
      this.$ajax('/portable/message/export', { messageGroup: this.queryInfo.messageGroup }, (data) => {
        this.exporting = false
        if (!data.success) {
          this.$alert(data.message, '错误')
          return
        }
        this.exportData = data.message
      })
    },
    del(info) {
      this.$confirm('是否删除信息：' + info.messageGroup + ':' + info.messageKey + '，该操作无法撤销？', '删除信息确认')
        .then(() => {
          this.loading = true
          this.$ajax('/portable/message/delete', { pmid: info.pmid }, (data) => {
            this.loading = false
            if (!data.success) {
              this.$alert(data.message, '错误')
              return
            }
            this.$alert(data.message, '信息')
            this.requery()
          })
        })
        .catch(() => {})
    },
    showModify(info) {
      this.modifyInfo = JSON.parse(JSON.stringify(info))
      this.modifyVisible = true
    },
    modify() {
      this.modifying = true
      this.$ajax('/portable/message/update', this.modifyInfo, (data) => {
        this.modifying = false
        if (!data.success) {
          this.$alert(data.message, '错误')
          return
        }
        this.$alert(data.message, '信息')
      })
    },
    showAdd() {
      this.addInfo = {}
      this.addVisible = true
    },
    add() {
      this.adding = true
      this.$ajax('/portable/message/add', this.addInfo, function (data) {
        this.adding = false
        if (!data.success) {
          this.$alert(data.message, '错误')
          return
        }
        this.$alert(data.message, '信息')
        this.addInfo.messageKey = ''
        this.addInfo.message = ''
      })
    },
    requery() {
      this.page.pageNumber = 1
      this.query()
    },
    query() {
      this.loading = true
      this.$ajax('/portable/message/queryUserAll', this.$concatJson(this.queryInfo, this.page), function (data) {
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
<style scoped>
.export-info {
  max-height: 10rem;
  word-break: break-all;
  overflow-y: auto;
}
</style>
