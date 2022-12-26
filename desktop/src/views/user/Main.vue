<template>
  <div>
    <back-comp></back-comp>
    <!-- 标题栏 -->
    <div class="text-center pd10 fs20">
      <i class="iconfont">&#xe73d;</i> {{ title }} <span v-if="user.isLogin"> {{ user.tbUser.nickname }}</span>
    </div>
    <!-- 菜单项 -->
    <div class="user_main">
      <el-card>
        <div slot="header"> <i class="iconfont">&#xe617;</i> 功能菜单 </div>
        <div>
          <div class="menus">
            <div v-for="m in menus" :key="m.path">
              <div @click="toPage(m)">
                <i class="iconfont" v-html="m.icon"></i>
              </div>
              <div>{{ m.text }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import BackComp from '../../components/BackComp.vue'
export default {
  components: { BackComp },
  name: 'Main',
  data() {
    return {
      title: '用户首页',
      menus: [
        { text: '返回登录', icon: '&#xe89f;', path: '/login' },
        { text: '文件管理', icon: '&#xec17;', path: '/user/file' },
        { text: '门户信息管理', icon: '&#xe699;', path: '/user/portable' },
        { text: '邮箱留言信息管理', icon: '&#xe611;', path: '/user/emailinfo' },
        { text: '地址信息管理', icon: '&#xe763;', path: '/user/mapinfo' },
      ],
      isLogin: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.loginInfo
    },
  },
  methods: {
    toPage(menu) {
      // let url = this.$router.resolve({ path: menu.path })
      // window.open(url.href, '_blank')
      this.$router.push(menu.path)
    },
    userChanged(isLogin) {
      this.$logger.debug('登录状态改变', isLogin)
      this.isLogin = isLogin
    },
  },
  created() {
    if (!this.user.isLogin) {
      this.$alert('请登录', {
        callback: () => {
          this.$router.push('/login')
        },
      })
    }
  },
}
</script>
<style scoped>
.user_main {
  padding: 1rem;
  margin: 1rem;
}

.menus {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}

.menus > div {
  margin: 1rem;
  padding: 5px 10px;
  border: 3px solid transparent;
  border-radius: 5px;
  transition: border 0.5s linear;
}

.menus > div:hover {
  border-color: #dcdcdc;
}

.menus > div :first-child .iconfont {
  font-size: 5rem;
  transition: color 0.5s linear;
}

.menus > div :first-child .iconfont:hover {
  color: #409eff;
  cursor: pointer;
}
.menus > div :last-child {
  padding: 0.5rem;
}

.menus > div:hover :last-child {
  animation: shake 0.5s;
}
</style>
