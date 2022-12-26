import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 本地保存用户信息
const LOGIN_USER_INFO_KEY = 'huhuiyu.teach_project_ui_userinfo'
const EMPTY_USER_INFO = { tbUser: {}, tbUserInfo: {}, isLogin: false }

function saveUser(loginInfo) {
  localStorage.setItem(LOGIN_USER_INFO_KEY, JSON.stringify(loginInfo))
}
function loadUser() {
  let info = localStorage.getItem(LOGIN_USER_INFO_KEY)
  if (info) {
    try {
      return JSON.parse(info)
    } catch (error) {
      return EMPTY_USER_INFO
    }
  }
  return EMPTY_USER_INFO
}
function removeUser() {
  localStorage.removeItem(LOGIN_USER_INFO_KEY)
}
export default new Vuex.Store({
  state: {
    loginInfo: loadUser(),
  },
  mutations: {
    setLoginInfo(state, loginInfo) {
      saveUser(loginInfo)
      state.loginInfo = loadUser()
    },
    removeLoginInfo(state) {
      removeUser()
      state.loginInfo = loadUser()
    },
  },
  actions: {},
  modules: {},
})
