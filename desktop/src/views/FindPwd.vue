<template>
  <div>
    <div class="pd10 text-center fs15">{{ title }}</div>
    <div class="main-div">
      <el-steps :active="active">
        <el-step title="找回方式"></el-step>
        <el-step :title="stepTitle"></el-step>
        <el-step title="密码修改"></el-step>
      </el-steps>

      <div v-if="active == 0" class="find-mode">
        <div @click="chooseMode('phone')">
          <div>
            <i class="iconfont">&#xe608;</i>
          </div>
          <div> 通过手机找回 </div>
        </div>

        <div @click="chooseMode('email')">
          <div>
            <i class="iconfont">&#xe64f;</i>
          </div>
          <div> 通过邮箱找回 </div>
        </div>
      </div>
      <div v-if="active == 1">
        <div class="form-div">
          <el-form v-loading="sending">
            <el-form-item>
              <el-input type="text" placeholder="用户登录名" v-model="sendInfo.username">
                <i slot="prefix" class="el-input__icon iconfont">&#xe601;</i>
              </el-input>
            </el-form-item>
            <el-form-item v-if="mode == 'phone'">
              <el-input type="text" placeholder="图片验证码" v-model="sendInfo.imageCode">
                <i slot="prefix" class="el-input__icon iconfont">&#xe63d;</i>
              </el-input>
            </el-form-item>
            <el-form-item v-if="mode == 'phone'" v-loading="getImging">
              <el-button type="danger" @click="getCodeImg"> <i class="iconfont">&#xe7d8;</i>刷新图片校验码 </el-button>
            </el-form-item>
            <el-form-item v-if="mode == 'phone'" v-loading="getImging">
              <el-image v-if="codeImgSrc" @click="getCodeImg" :src="codeImgSrc" fit="scale-down"></el-image>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-div">
          <el-form :inline="true" v-loading="sending">
            <el-form-item>
              <el-button type="danger" @click="active = 0"> <i class="iconfont">&#xe80f;</i> </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!sendInfo.username.trim()" @click="sendCode"> <i class="iconfont">&#xe60d;</i> 发送验证码 </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" :disabled="!sendInfo.username.trim()" @click="active = 2"> <i class="iconfont">&#xe60e;</i> </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="active == 2">
        <div class="form-div">
          <el-form :inline="true" v-loading="sending">
            <el-form-item>
              <el-button type="danger" @click="active = 1"> <i class="iconfont">&#xe80f;</i> </el-button>
            </el-form-item>
            <el-form-item>
              <el-input type="password" show-password placeholder="新密码" v-model="sendInfo.password">
                <i slot="prefix" class="el-input__icon iconfont">&#xe601;</i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="text" show-password placeholder="验证码" v-model="sendInfo.code">
                <i slot="prefix" class="el-input__icon iconfont">&#xe601;</i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!sendInfo.password" @click="modifyPwd"> <i class="iconfont">&#xe60d;</i> 修改密码 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FindPwd',
  data() {
    return {
      title: '用户找回密码',
      active: 0,
      mode: '',
      codeImgSrc: '',
      sendInfo: {
        username: '',
        password: '',
        code: '',
        imageCode: '',
      },
      sending: false,
      getImging: false,
    }
  },
  methods: {
    modifyPwd() {
      this.sending = true
      let url = '/user/auth/findPwdByEmail'
      if ('phone' == this.mode) {
        url = '/user/auth/findPwdByPhone'
      }
      this.sendInfo.password = this.$md5(this.sendInfo.password)
      this.$ajax(url, this.sendInfo, (data) => {
        this.sendInfo.password = ''
        this.sending = false
        this.$alert(data.message, '修改密码结果')
      })
    },
    getCodeImg() {
      this.getImging = true
      this.$ajax('/tool/getImageCode', {}, function (data) {
        this.getImging = false
        if (data.success) {
          this.codeImgSrc = data.message
        } else {
          this.$alert(data.message, '图片错误')
        }
      })
    },
    sendCode() {
      let url = this.mode == 'phone' ? '/tool/sendUserValidateCode' : '/tool/sendUserEmailCode'
      let sendInfo = { username: this.sendInfo.username }
      if ('phone' == this.mode) {
        sendInfo.imageCode = this.sendInfo.imageCode
      }
      this.sending = true
      this.$ajax(url, sendInfo, function (data) {
        this.sending = false
        this.$alert(data.message, '发送结果')
      })
    },
    chooseMode(mode) {
      this.mode = mode
      this.active = 1
    },
  },
  computed: {
    stepTitle() {
      if (this.mode == 'email') {
        return '邮箱验证'
      } else if (this.mode == 'phone') {
        return '手机验证'
      } else {
        return '信息验证'
      }
    },
  },
}
</script>
<style scoped>
.main-div {
  padding: 2rem;
}
.main-div .find-mode {
  display: flex;
  justify-content: center;
}
.main-div .find-mode > div {
  border: 1px solid #999;
  box-shadow: #999 0rem 0rem 0px;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  margin: 1rem;
  transition: all 0.5s;
}
.main-div .find-mode > div:hover {
  box-shadow: #999 0.2rem 0.2rem 0px;
  border-width: 2px;
  cursor: pointer;
}
.main-div .find-mode .iconfont:hover {
  text-shadow: #ac00ac 0px 0px 1rem;
}

.main-div .find-mode > div > div:first-of-type {
  padding: 0.5rem 1rem;
  margin: 1rem;
}
.main-div .find-mode > div > div:last-of-type {
  margin: 0.2rem 0.5rem;
}
.main-div .find-mode .iconfont {
  font-size: 5rem;
  text-shadow: #ac00ac 0px 0px 0rem;
  transition: text-shadow 0.5s;
}

.form-div {
  display: flex;
  justify-content: center;
}
</style>
