const routes = [
  {
    path: '/admin/log',
    component: () => import('../view/superAdminManage/SystemLog.vue'),
  },
  {
    path: '/admin/config',
    component: () => import('../view/superAdminManage/SystemConfig.vue'),
  },
  {
    path: '/admin/user',
    component: () => import('../view/superAdminManage/SystemUser.vue'),
  },
]

export default routes
