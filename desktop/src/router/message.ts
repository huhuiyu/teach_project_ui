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
    path: '/message/edits',
    component: () => import('../view/message/MessageList.vue'),
  },
  {
    path: '/message/personal/:username',
    component: () => import('../view/message/PersonalHomePage.vue'),
  },
  {
    path: '/message/privateMessage',
    component: () => import('../view/message/PrivateMessage.vue'),
  },
  {
    path: '/message/manage',
    component: () => import('../view/message/MessageManage.vue'),
  },
  {
    path: '/message/notice',
    component: () => import('../view/message/NoticeManage.vue'),
  },
]

export default routes
