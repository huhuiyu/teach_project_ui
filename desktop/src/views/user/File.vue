<template>
  <div>
    <back-comp></back-comp>
    <div class="text-center pd10 fs20"> <i class="iconfont">&#xe625;</i> {{ title }}</div>
    <div class="flex-box-right pd10">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="文件类型" v-model="queryInfo.contentType">
            <i slot="prefix" class="el-input__icon iconfont">&#xe625;</i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="文件名称" v-model="queryInfo.filename">
            <i slot="prefix" class="el-input__icon iconfont">&#xe625;</i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="文件描述" v-model="queryInfo.fileinfo">
            <i slot="prefix" class="el-input__icon iconfont">&#xe625;</i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              page.pageNumber = 1
              query()
            "
            ><i class="iconfont">&#xe622;</i> 查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="uploadVisible = true"><i class="iconfont">&#xe614;</i> 上传文件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 文件列表 -->
    <div v-loading="loading">
      <el-table :data="list">
        <el-table-column label="文件名称" prop="filename"></el-table-column>
        <el-table-column label="文件描述" prop="fileinfo"></el-table-column>
        <el-table-column label="类型" prop="contentType"></el-table-column>
        <el-table-column label="文件大小">
          <template slot-scope="info">
            {{ info.row.fileSize | filesize }}
          </template>
        </el-table-column>
        <el-table-column label="上传时间">
          <template slot-scope="info">
            {{ info.row.lastupdate | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button type="primary" size="small" @click="downfile(info.row)">下载</el-button>
            <el-button type="danger" size="small" @click="deletefile(info.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div v-loading="loading" class="flex-box pd10">
      <page :page="page" @change-page="query"></page>
    </div>
    <!-- 上传文件对话框 -->
    <el-dialog :visible.sync="uploadVisible" title="文件上传" @closed="resetFile">
      <div v-loading="uploading">
        <el-form>
          <el-form-item>
            <el-button @click="opefile">浏览文件</el-button>
            <span v-if="file && file.file">{{ file.file.name }}</span>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="文件描述" v-model="fileinfo">
              <i slot="prefix" class="el-input__icon iconfont">&#xe625;</i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" v-loading="uploading">
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button v-loading="uploading" type="primary" @click="upload" :disabled="!file || !fileinfo">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BackComp from '../../components/BackComp.vue'
import Page from '../../components/Page.vue'
import logger from '../../js/logger'
export default {
  components: { Page, BackComp },
  name: 'UserFile',
  data() {
    return {
      uploadVisible: false,
      title: '文件管理',
      loading: false,
      uploading: false,
      page: {
        pageNumber: 1,
        pageSize: 5,
      },
      queryInfo: {
        contentType: '',
        fileinfo: '',
        filename: '',
      },
      list: [],
      file: null,
      fileinfo: '',
    }
  },
  methods: {
    upload() {
      this.uploading = true
      this.$upload('/user/file/upload', { fileinfo: this.fileinfo }, this.file.file, (data) => {
        this.uploading = false
        if (data.success) {
          this.file = null
          this.fileinfo = ''
        }
        this.$alert(data.message, '文件上传结果')
      })
    },
    resetFile() {
      this.file = null
      this.fileinfo = ''
      this.query()
    },
    opefile() {
      this.$openFile((file) => {
        this.file = file
        logger.debug(this.file)
      })
    },
    deletefile(file) {
      logger.debug(file)
      this.$confirm('是否删除文件：' + file.filename + '，该操作无法撤销？', '删除文件确认')
        .then(() => {
          this.loading = true
          this.$ajax('/user/file/delete', { fid: file.fid }, (data) => {
            this.loading = false
            this.$alert(data.message, '删除文件结果', {
              callback: () => {
                if (data.success) {
                  this.query()
                }
              },
            })
          })
        })
        .catch(() => {})
    },
    downfile(file) {
      window.open(this.$getDownloadUrl(file.fid))
    },
    query() {
      this.loading = true
      this.$ajax('/user/file/queryAll', this.$concatJson(this.queryInfo, this.page), (data) => {
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
