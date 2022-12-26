<template>
  <div>
    <back-comp></back-comp>
    <div class="pd10 text-center fs20">{{ title }}</div>
    <div class="flex-box-right pd10" v-loading="loading">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="queryInfo.info" placeholder="地址描述信息"></el-input>
        </el-form-item>
        <el-form-item><el-button type="primary" @click="query">查询</el-button></el-form-item>
        <el-form-item><el-button type="danger" @click="requery">重置</el-button></el-form-item>
        <el-form-item><el-button @click="showAdd">添加</el-button></el-form-item>
      </el-form>
    </div>
    <div v-loading="loading">
      <!-- 数据呈现部分 -->
      <el-table :data="list">
        <el-table-column label="地址信息">
          <template slot-scope="scope">
            {{ scope.row.info }} <br />
            {{ scope.row.address }}
          </template>
        </el-table-column>
        <el-table-column label="坐标(lng,lat)">
          <template slot-scope="scope"> {{ scope.row.lng }},{{ scope.row.lat }} </template>
        </el-table-column>
        <el-table-column label="信息最后修改时间">
          <template slot-scope="scope"> {{ scope.row.lastupdate | formatDate }} </template>
        </el-table-column>
        <el-table-column label="信息最后修改时间">
          <template slot-scope="scope">
            <!-- <el-button size="small" type="primary" @click="openMap(scope.row)">打开地图</el-button> -->
            <el-button size="small" type="success" @click="copyMapUrl(scope.row)">复制链接</el-button>
            <el-button size="small" type="text" @click="showQrCode(scope.row)">显示二维码</el-button>
            <el-button size="small" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page :page="page" @change-page="query"></page>
    </div>
    <!-- 二维码显示部分 -->
    <div>
      <el-dialog :visible.sync="qrcodeVisible" title="扫码打开地图">
        <div class="qrcode">
          <img :src="qrcodeData" />
        </div>
      </el-dialog>
    </div>
    <!-- 拖拽定位组件 -->
    <div>
      <el-dialog :visible.sync="locatorVisible" :append-to-body="true" :fullscreen="true" title="地图拖拽选址">
        <div>
          <locator-comp @choosed="locationChoosed"></locator-comp>
        </div>
      </el-dialog>
    </div>
    <!-- 添加对话框 -->
    <div>
      <el-dialog :close-on-click-modal="false" :visible.sync="addVisible" title="添加地址信息" @closed="requery">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="addInfo.info" placeholder="地址描述信息"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="locatorVisible = true">选择地址</el-button>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.address" :readonly="true" placeholder="地址信息，点击选择地址修改"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.lng" :readonly="true" placeholder="lng信息，点击选择地址修改">
                <template slot="prepend">LNG:</template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.lat" :readonly="true" placeholder="lat信息，点击选择地址修改">
                <template slot="prepend">LAT:</template>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="text-right">
            <el-button type="danger" @click="addVisible = false">关闭</el-button>
            <el-button type="primary" @click="add">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import BackComp from '../../components/BackComp.vue'
import Page from '../../components/Page.vue'
import logger from '../../js/logger'
import tools from '../../js/tools'
import QRCode from 'qrcode'
import LocatorComp from '../../components/LocatorComp.vue'
let app
export default {
  components: { BackComp, Page, LocatorComp },
  data() {
    return {
      title: '地址管理',
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
      qrcodeData: '',
      qrcodeVisible: false,
      locatorVisible: false,
    }
  },
  computed: {},
  methods: {
    del(info) {
      app
        .$confirm('是否删除地址：' + info.info + '?该动作无法撤销。', '删除', { type: 'warning' })
        .then(() => {
          app.loading = true
          app.$ajax('/mapinfo/delete', { mid: info.mid }, (data) => {
            app.loading = false
            if (data.success) {
              app.requery()
              app.$message({
                type: 'success',
                message: data.message,
              })
            } else {
              app.$message.error(data.message)
            }
          })
        })
        .catch(() => {})
    },
    requery() {
      this.page = {
        pageNumber: 1,
        pageSize: 5,
      }
      this.queryInfo = {}
      this.query()
    },
    add() {
      this.adding = true
      this.$ajax('/mapinfo/add', this.addInfo, (data) => {
        this.adding = false
        if (data.success) {
          this.$message.success(data.message)
          this.addInfo = {}
        } else {
          this.$message.error(data.message)
        }
      })
    },
    showAdd() {
      this.addInfo = {}
      this.addVisible = true
    },
    locationChoosed(info) {
      this.locatorVisible = false
      this.addInfo = this.$concatJson(this.addInfo, info)
    },
    showQrCode(info) {
      let url = this.getMapUrl(info)
      this.loading = true
      QRCode.toDataURL(url)
        .then(function (data) {
          app.loading = false
          app.qrcodeData = data
          app.qrcodeVisible = true
        })
        .catch(function () {
          app.loading = false
          app.$message.error('解析二维码失败')
        })
    },
    getMapUrl(info) {
      let markerurl = `https://uri.amap.com/marker?position=${info.lng},${info.lat}&name=${info.info}`
      return markerurl
    },
    copyMapUrl(info) {
      tools.copyText(this.getMapUrl(info))
      this.$message.success('复制地址成功')
    },
    openMap(info) {
      location = this.getMapUrl(info)
    },
    query() {
      this.loading = true
      this.$ajax('/mapinfo/queryAll', this.$concatJson(this.queryInfo, this.page), function (data) {
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
    app = this
    logger.debug('页面标题：', app.title)
    app.query()
  },
}
</script>
<style scoped>
.qrcode {
  display: flex;
  justify-content: center;
}
</style>
