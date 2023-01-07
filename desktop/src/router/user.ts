const routes = [
  {
    path: '/ user/userinfo',
    component: () => import('../view/user/UserInfo.vue'),
  },
  {
    path: '/user/findpwd',
    component: () => import('../view/user/FindPwd.vue'),
  },
]

let exportRouter = routes

export default exportRouter
