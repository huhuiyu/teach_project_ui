const routes = [
  {
    path: '/message/home',
    component: () => import('../view/message/Home.vue'),
  },
  {
    path: '/message/edit',
    component: () => import('../view/message/Edit.vue'),
  },
  {
    path: '/message/personal/:username',
    component: () => import('../view/message/PersonalHomePage.vue'),
  },
]

export default routes
