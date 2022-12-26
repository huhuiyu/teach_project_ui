<template>
  <div>
    <div class="text-center pd10 fs20"> {{ title }}</div>
    <div>
      <el-button @click="ajaxError">ajax错误弹框测试</el-button>
      <el-button @click="ajaxOk">ajax正确弹框测试</el-button>
      <el-button @click="ajaxErrorHandle">ajax错误自定义处理测试</el-button>
    </div>
    <hr />
    <div>
      <el-form>
        <el-form-item>
          <el-col :span="11">
            <el-input v-model="echo" placeholder="echo"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button @click="sendEcho" type="primary">发送</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div v-html="echoInfo"></div>
    <hr />
    <div>
      <input type="text" v-model="fileinfo" placeholder="文件描述" />
      <button @click="openFile">浏览文件</button>
      <button @click="upload">上传文件</button>
      {{ file }}
      <button @click="download">下载文件</button>
    </div>
  </div>
</template>

<script>
let app
let ws

export default {
  name: 'Test',
  data() {
    return {
      title: '测试首页',
      file: null,
      fileinfo: '',
      echo: '',
      echoInfo: '',
      chatInfo: {
        name: '',
        info: '',
      },
      chatResult: '',
    }
  },
  methods: {
    // 下载文件
    download() {
      window.open(this.$getDownloadUrl(2))
    },
    // 浏览文件
    openFile() {
      app.$openFile((file) => {
        app.file = file
      })
    },
    upload() {
      app.$upload('/user/file/upload', { fileinfo: app.fileinfo }, app.file.file, function (data) {
        app.$alert(data.message, '文件上传结果')
      })
    },
    // ajax相关测试
    ajaxError() {
      app.$ajax('/user/auth/login', {}, function (data) {
        app.$logger.debug(data)
      })
    },
    ajaxOk() {
      app.$ajax(
        '/user/auth/login',
        {
          username: 'user',
          password: this.$md5('user-pwd'),
        },
        function (data) {
          app.$logger.debug(data)
          app.$alert(data.message, '成功弹出')
        }
      )
    },
    ajaxErrorHandle() {
      app.$ajax(
        '/user/auth/login',
        {},
        function (data) {
          app.$alert(data.message, '自定义处理弹出')
        },
        'post',
        true
      )
    },
    // websocket相关测试
    sendEcho() {
      ws.send(app.echo)
    },
    openWs() {
      ws = app.$ws('echo')
      ws.addListener('message', function (data) {
        app.echoInfo = data
      })
    },
  },
  created() {
    app = this
  },
  mounted() {
    app.openWs()
    app.$ajax(
      '/?a=b',
      {
        echo: '黑暗骑士',
      },
      function (data) {
        app.$logger.debug('get请求数据', data)
      },
      'get'
    )
  },
}
</script>
