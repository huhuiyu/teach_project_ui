<template>
  <div>
    <div class="text-center pd10 fs20"> <i class="iconfont">&#xe73d;</i> {{ title }}</div>
    <div class="main">
      <el-tabs type="border-card" tab-position="top" @tab-click="changeTab">
        <el-tab-pane label="功能菜单">
          <transition name="movein">
            <div v-if="tabIndex == 0">
              <div class="menus">
                <div v-for="m in menus" :key="m.path">
                  <div @click="toPage(m)">
                    <i class="iconfont" v-html="m.icon"></i>
                  </div>
                  <div>{{ m.text }}</div>
                </div>
              </div>
            </div>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="娱乐">
          <transition name="movein">
            <div v-if="tabIndex == 1">
              <div class="video-box">
                <video src="https://media.huhuiyu.top/mv/Green.Day.-.21.Guns.mkv" controls></video>
              </div>
            </div>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="text-right pd10"> 网站访问量：{{ count }} </div>
  </div>
</template>

<script>
const INDEX_COUNTER = 'huhuiyu_top_teach_ui_index_counter'
export default {
  name: 'Home',
  data() {
    return {
      title: '教学演示ui',
      tabIndex: 0,
      menus: [
        { text: '用户首页', icon: '&#xe6da;', path: '/user/main' },
        { text: '简易聊天室', icon: '&#xe6ee;', path: '/user/chatroom' },
        { text: '高德地图演示', icon: '&#xe643;', path: '/api/amap' },
      ],
      count: '...',
    }
  },
  methods: {
    addCount() {
      // 网站访问量添加
      this.$ajax(
        '/portable/message/counterAdd',
        {
          accessKey: this.$getAccessKey(),
          messageKey: INDEX_COUNTER,
        },
        (data) => {
          this.$logger.debug(data)
          this.query()
        }
      )
    },
    query() {
      // 查询网站访问量
      this.$ajax(
        '/portable/message/counterInfo',
        {
          accessKey: this.$getAccessKey(),
          messageKey: INDEX_COUNTER,
        },
        (data) => {
          this.count = data.message
        }
      )
    },
    changeTab(tab, event) {
      this.$logger.debug(tab, event, tab.index)
      this.tabIndex = tab.index
    },
    toPage(menu) {
      // let url = this.$router.resolve({ path: menu.path })
      // window.open(url.href, '_blank')
      this.$router.push(menu.path)
    },
  },
  created() {
    this.addCount()
  },
}
</script>

<style scoped>
.main {
  padding: 1rem;
}

.movein-enter-active,
.movein-leave-active {
  transition: transform 1s;
  transform: translateX(0%);
}
.movein-enter,
.movein-leave-to {
  transform: translateX(100%);
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

.video-box {
  display: flex;
  justify-content: center;
}
.video-box video {
  width: 60vw;
}
</style>
