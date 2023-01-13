const routes = [
  {
    path: '/message/home',
    component: () => import('../view/message/Home.vue'),
  },
  {
    path: '/message/edit',
    component: () => import('../view/message/Edit.vue'),
  },
]

export default routes
