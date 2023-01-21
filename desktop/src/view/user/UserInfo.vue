<script setup lang="ts">
import { NButton, NCard, NForm, NFormItem, NInput, NRadio, NTabPane, NTabs, NRadioGroup, NSpace, NImage, NSpin, FormRules, FormItemRule, FormInst, NAvatar } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import BaseResult, { BaseDataResult } from '../../entity/BaseResult'
import FileInfo from '../../entity/FileInfo'
import { FileInfoResult } from '../../entity/FileResult'
import store from '../../store'
import dialog from '../../tools/dialog'
import logger from '../../tools/logger'
import server from '../../tools/server'
import tools from '../../tools/tools'

//pinia
const storeInfo = store()
const { loginUser } = storeToRefs(storeInfo)
//路由
const router = useRouter()
// 用户附加信息
const userInfo = reactive({
  img: loginUser.value.tbUserInfo.img,
  nickname: loginUser.value.tbUser.nickname,
  qq: loginUser.value.tbUserInfo.qq,
  wechat: loginUser.value.tbUserInfo.wechat,
  info: loginUser.value.tbUserInfo.info,
  sex: loginUser.value.tbUserInfo.sex,
})
//懒加载默认图片
const lazyImg = 'https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg'

//相关设置状态
const accountSetting = reactive({
  email: false,
  phone: false,
  pwd: false,
})
const loading = reactive({
  userInfo: false,
  pwd: false,
  phone: false,
  email: false,
  uploadfile: false,
})
// 退出登录
const logout = () => {
  loading.userInfo = true
  server.post('/user/auth/logout', {}, () => {
    storeInfo.updateLoginUser(() => {
      loading.userInfo = false
    })
  })
}
//修改用户信息
const updateUserInfo = () => {
  loading.userInfo = true
  server.post('/user/auth/updateUserInfo', userInfo, (data: BaseResult) => {
    dialog.notifyInfo({
      content: data.message,
      duration: 2000,
    })
    if (data.success) {
      storeInfo.updateLoginUser((userinfo: any) => {
        loading.userInfo = false
      })
    }
    loading.userInfo = false
  })
}
//上传文件信息
const upfileinfo = ref(new FileInfo())
//打开文件，获取文件信息
const browserFile = () => {
  upfileinfo.value = new FileInfo()
  tools.openFile((file: FileInfo) => {
    upfileinfo.value = file[0]
    if (file[0].file == null) {
      return
    }
    tools.readImg(file[0].file, (result: string) => {
      if (result == '') {
        dialog.notifyWarning({
          content: '头像只能选择图片',
          duration: 2000,
          keepAliveOnHover: true,
        })
        return
      }
      upload()
    })
  })
}
//上传文件，修改头像，删除之前头像
const upload = () => {
  if (upfileinfo.value.file == null) {
    return
  }
  if (upfileinfo.value.size >= 2097152) {
    dialog.notifyWarning({
      content: '图片大小不能超过2MB',
      duration: 2000,
      keepAliveOnHover: true,
    })
    return
  }
  let fid = server.isDownloadUrl(userInfo.img)
  server.upload(
    '/user/file/upload',
    upfileinfo.value.file,
    {
      fileinfo: loginUser.value.tbUser.nickname + '的头像',
    },
    (data: BaseDataResult<FileInfoResult>) => {
      if (data.success) {
        userInfo.img = server.getDownloadUrl(data.data.fid)
        updateUserInfo()
        if (fid != -1) {
          server.post('/user/file/delete', { fid }, (data: any) => {
            logger.debug(data)
          })
        }
      }
    }
  )
}
//账号设置ref
const settingPwdRef = ref<FormInst | null>(null)
const settingPhoneRef = ref<FormInst | null>(null)
const settingEmailRef = ref<FormInst | null>(null)
//确认两次密码是否相同
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === pwdInfo.pwd
}
//修改密码表单验证
const pwdRules: FormRules = {
  oldpwd: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
  ],
  pwd: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,16}$/g.test(value)) return new Error('密码由6-16位数字、字母或符号组成 至少含2种以上字符')
        return true
      },
      message: '密码由8-16位数字、字母或符号组成 至少含2种以上字符',
      trigger: ['input', 'blur'],
    },
  ],
  okPwd: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
}

// 修改密码信息
const pwdInfo = reactive({
  oldpwd: '',
  pwd: '',
  okPwd: '',
})
// 修改密码
const updatePwd = () => {
  settingPwdRef.value?.validate((errors) => {
    if (!errors) {
      loading.pwd = true
      server.post(
        '/user/auth/updatePwd',
        {
          oldpwd: tools.md5(pwdInfo.oldpwd),
          password: tools.md5(pwdInfo.pwd),
        },
        (data: BaseResult) => {
          dialog.notifyWarning({
            content: data.message,
            duration: 2000,
          })
          loading.pwd = false
        },
        true
      )
    }
    return
  })
}
//手机校验规则
const phoneRules: FormRules = {
  newPhone: [
    {
      key: 'phone',
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) return new Error('请输入正确手机号格式')
        return true
      },
      message: '请输入正确手机号格式',
      trigger: ['input', 'blur'],
    },
  ],
  imgCode: [
    {
      key: 'imgCode',
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^[0-9A-Za-z]{5}$/.test(value)) return new Error('图片验证码')
        return true
      },
      message: '图片验证码',
      trigger: ['input', 'blur'],
    },
  ],
  phoneCode: [
    {
      key: 'phoneCode',
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^\d{6}$/.test(value)) return new Error('六位数验证码')
        return true
      },
      message: '请输入正确的验证码',
      trigger: ['input', 'blur'],
    },
  ],
}
//修改手机信息
const phoneInfo = reactive({
  imgCode: '',
  imgUrl: '',
  newPhone: '',
  phoneCode: '',
})
// 发送图片验证码
const sendImgCode = () => {
  loading.phone = true
  server.post('/tool/getImageCode', {}, (data: BaseResult) => {
    phoneInfo.imgUrl = data.message
  })
  loading.phone = false
}
sendImgCode()
//发送手机验证码
const sendPhoneCode = () => {
  //嵌套验证多个表单
  settingPhoneRef.value
    ?.validate(
      () => {},
      (rule) => {
        return rule?.key === 'phone'
      }
    )
    .then(() => {
      settingPhoneRef.value
        ?.validate(
          () => {},
          (rule) => {
            return rule?.key === 'imgCode'
          }
        )
        .then(() => {
          loading.phone = true
          server.post(
            '/tool/sendValidateCode',
            {
              imageCode: phoneInfo.imgCode,
              phone: phoneInfo.newPhone,
            },
            (data: BaseResult) => {
              dialog.notifyWarning({
                content: data.message,
                duration: 2000,
                keepAliveOnHover: true,
              })
              loading.phone = false
            },
            true
          )
        })
        .catch((error) => {
          logger.error(error)
        })
    })
    .catch((error) => {
      logger.error(error)
    })
}
//修改手机号
const updatePhone = () => {
  settingPhoneRef.value
    ?.validate(
      () => {},
      (rule) => {
        return rule?.key === 'phone'
      }
    )
    .then(() => {
      settingPhoneRef.value
        ?.validate(
          () => {},
          (rule) => {
            return rule?.key === 'phoneCode'
          }
        )
        .then((value) => {
          loading.phone = true
          server.post(
            '/user/auth/updateUserPhone',
            {
              code: phoneInfo.phoneCode,
              phone: phoneInfo.newPhone,
            },
            (data: BaseResult) => {
              dialog.notifyWarning({
                content: data.message,
                duration: 2000,
                keepAliveOnHover: true,
              })
              loading.phone = false
            },
            true
          )
        })
        .catch((error) => {
          logger.error(error)
        })
    })
    .catch((error) => {
      logger.error(error)
    })
}
//邮箱验证规则
const EmailRules: FormRules = {
  email: [
    {
      key: 'email',
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)) {
          return new Error('请输入正确的邮箱格式')
        }
        return true
      },
      message: '请输入正确的邮箱格式',
      trigger: ['input', 'blur'],
    },
  ],
  emailCode: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string) => {
        if (!/^\d{6}$/.test(value)) return new Error('六位数验证码')
        return true
      },
      message: '请输入正确的验证码',
      trigger: ['input', 'blur'],
    },
  ],
}
//修改邮箱信息
const emailInfo = reactive({
  email: '',
  emailCode: '',
})
//发送邮箱验证码
const sendEmailCode = () => {
  settingEmailRef.value?.validate(
    (errors) => {
      if (!errors) {
        loading.email = true
        server.post(
          '/tool/sendEmailCode',
          { email: emailInfo.email },
          (data: BaseResult) => {
            dialog.notifyWarning({
              content: data.message,
              duration: 2000,
              keepAliveOnHover: true,
            })
            loading.email = false
          },
          true
        )
      }
      return
    },
    (rule) => {
      return rule?.key === 'email'
    }
  )
}
//修改邮箱
const updateEmail = () => {
  settingEmailRef.value?.validate((errors) => {
    if (!errors) {
      loading.email = true
      server.post(
        '/user/auth/updateUserEmail',
        { email: emailInfo.email, code: emailInfo.emailCode },
        (data: BaseResult) => {
          dialog.notifyWarning({
            content: data.message,
            duration: 2000,
            keepAliveOnHover: true,
          })
          loading.email = false
        },
        true
      )
    }
    return
  })
}
const closeRules = (parameter: string) => {
  if (parameter == 'email') {
    accountSetting.email = !accountSetting.email
    for (const key in emailInfo) {
      emailInfo[key] = ''
    }
    settingEmailRef.value?.restoreValidation()
  } else if (parameter == 'phone') {
    phoneInfo.imgCode = ''
    phoneInfo.phoneCode = ''
    phoneInfo.newPhone = ''
    accountSetting.phone = !accountSetting.phone
    settingPhoneRef.value?.restoreValidation()
  } else if (parameter == 'pwd') {
    for (const key in pwdInfo) {
      pwdInfo[key] = ''
    }
    accountSetting.pwd = !accountSetting.pwd
    settingPwdRef.value?.restoreValidation()
  }
}
</script>
<template>
  <div class="container">
    <header>
      <div class="header_title">
        <div><n-avatar round size="small" src="https://media.huhuiyu.top/huhuiyu.top/hu-logo.jpg"></n-avatar> </div>
        <div> 用户信息管理</div>
      </div>
      <div class="header_menu">
        <p v-if="loginUser.isLogin">欢迎，{{ loginUser.tbUser.nickname }}</p>
        <n-button v-if="loginUser.isLogin" @click="logout">退出登录</n-button>
        <n-button v-if="!loginUser.isLogin" @click="router.push('/login')">登录</n-button>
        <n-button @click="router.push('/')">主站</n-button>
      </div>
    </header>
    <main>
      <n-card>
        <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;" animated>
          <n-tab-pane name="个人资料">
            <n-spin size="large" :show="loading.userInfo">
              <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging" :style="{ maxWidth: '640px' }">
                <n-form-item label="头像" path="avatar" id="image">
                  <n-image class="avatar" width="90" height="90" object-fit="cover" @click="browserFile" preview-disabled lazy :intersection-observer-options="{ root: '#image' }" :fallback-sr="lazyImg" :preview-src="lazyImg" :src="userInfo.img">
                    <template #placeholder>
                      <img style="width: 90px; height: 90px; object-fit: cover; border-radius: 50%; overflow: hidden" :src="lazyImg" />
                    </template>
                  </n-image>
                </n-form-item>
                <n-form-item label="昵称" path="inputNickName">
                  <n-input placeholder="昵称" v-model:value="userInfo.nickname" clearable />
                </n-form-item>
                <n-form-item label="QQ" path="inputQQ">
                  <n-input placeholder="QQ" v-model:value="userInfo.qq" clearable />
                </n-form-item>
                <n-form-item label="微信" path="inputWeChat">
                  <n-input placeholder="微信" v-model:value="userInfo.wechat" clearable />
                </n-form-item>
                <n-form-item label="性别" path="radioGroupSex">
                  <n-radio-group name="radiogroup1" v-model:value="userInfo.sex">
                    <n-space>
                      <n-radio value="m"> 男 </n-radio>
                      <n-radio value="f"> 女 </n-radio>
                      <n-radio value="n"> 保密 </n-radio>
                    </n-space>
                  </n-radio-group>
                </n-form-item>
                <n-form-item label="描述" path="textareaDescription">
                  <n-input
                    placeholder="简单介绍一下吧"
                    type="textarea"
                    v-model:value="userInfo.info"
                    :autosize="{
                      minRows: 3,
                      maxRows: 5,
                    }"
                    clearable
                    show-count
                  />
                </n-form-item>
                <n-form-item label="  ">
                  <n-button type="info" style="width: 100%" @click="updateUserInfo"> 提交 </n-button>
                </n-form-item>
              </n-form>
            </n-spin>
          </n-tab-pane>
          <n-tab-pane name="账号设置">
            <div :style="{ maxWidth: '440px' }">
              <n-spin :show="loading.email">
                <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging" ref="settingEmailRef" :model="emailInfo" :rules="EmailRules">
                  <n-form-item label="绑定邮箱" path="email">
                    <n-input :placeholder="loginUser.tbUserInfo.email ? loginUser.tbUserInfo.email : '未绑定邮箱'" v-model:value="emailInfo.email" :disabled="!accountSetting.email" clearable />
                    <n-button dashed @click="closeRules('email')">
                      {{ accountSetting.email ? '收起' : '编辑' }}
                    </n-button>
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.email" path="emailCode">
                    <n-input placeholder="邮箱验证码" v-model:value="emailInfo.emailCode" clearable :maxlength="6" />
                    <n-button dashed @click="sendEmailCode"> 发送验证码 </n-button>
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.email">
                    <n-button type="info" style="width: 100%" @click="updateEmail"> 提交 </n-button>
                  </n-form-item>
                </n-form>
              </n-spin>
              <n-spin :show="loading.phone">
                <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging" ref="settingPhoneRef" :model="phoneInfo" :rules="phoneRules">
                  <n-form-item label="绑定手机" path="newPhone">
                    <n-input :placeholder="loginUser.tbUserInfo.phone ? loginUser.tbUserInfo.phone : '未绑定手机'" v-model:value="phoneInfo.newPhone" :disabled="!accountSetting.phone" clearable :maxlength="11" />
                    <n-button dashed @click="closeRules('phone')">
                      {{ accountSetting.phone ? '收起' : '编辑' }}
                    </n-button>
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.phone" path="imgCode">
                    <n-input placeholder="图片验证码" clearable v-model:value="phoneInfo.imgCode" :maxlength="5" />
                    <img :src="phoneInfo.imgUrl" @click="sendImgCode" />
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.phone" path="phoneCode">
                    <n-input placeholder="手机验证码" clearable v-model:value="phoneInfo.phoneCode" :maxlength="6" />
                    <n-button dashed @click="sendPhoneCode"> 发送验证码 </n-button>
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.phone">
                    <n-button type="info" style="width: 100%" @click="updatePhone"> 提交 </n-button>
                  </n-form-item>
                </n-form>
              </n-spin>
              <n-spin :show="loading.pwd">
                <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging" :model="pwdInfo" ref="settingPwdRef" :rules="pwdRules">
                  <n-form-item label="修改密码" path="oldpwd">
                    <n-input placeholder="原密码" v-model:value="pwdInfo.oldpwd" :disabled="!accountSetting.pwd" type="password" show-password-on="mousedown" :maxlength="16" :minlength="4" />
                    <n-button dashed @click="closeRules('pwd')">
                      {{ accountSetting.pwd ? '收起' : '编辑' }}
                    </n-button>
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.pwd" path="pwd">
                    <n-input placeholder="新密码" type="password" show-password-on="mousedown" v-model:value="pwdInfo.pwd" :maxlength="16" :minlength="4" />
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.pwd" path="okPwd">
                    <n-input placeholder="确认密码" type="password" :disabled="!pwdInfo.pwd" show-password-on="mousedown" v-model:value="pwdInfo.okPwd" :maxlength="16" :minlength="4" />
                  </n-form-item>
                  <n-form-item label="  " v-show="accountSetting.pwd">
                    <n-button type="info" style="width: 100%" @click="updatePwd"> 提交 </n-button>
                  </n-form-item>
                </n-form>
              </n-spin>
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </main>
  </div>
</template>

<style scoped>
.container {
  background-color: rgb(246, 246, 246);
  height: 100vh;
}
p {
  margin: 0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 10px rgb(0 0 0 / 20%);
  padding: 12px 50px;
}

.header_title {
  display: flex;
  font-size: 1.1rem;
}

.header_menu {
  display: flex;
  align-items: center;
}

.header_menu button {
  margin: 0 1rem;
}

main {
  width: 60vw;
  margin: 2rem auto;
}

.avatar {
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.avatar::before {
  content: '\e8bc';
  font-family: 'iconfont';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #fff;
  line-height: 90px;
  font-size: 2rem;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}
.avatar:hover::before {
  visibility: visible;
}
</style>
