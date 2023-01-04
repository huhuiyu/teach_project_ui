const routes = [
  {
    path: '/userinfo',
    component: () => import('../view/user/UserInfoView.vue'),
  },

]

let exportRouter = routes

export default exportRouter
