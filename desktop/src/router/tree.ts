const routes = [
  {
    path: '/tree/user',
    component: () => import('../view/tree/UserTree.vue'),
  },
  {
    path: '/tree/admin',
    component: () => import('../view/tree/AdminTree.vue'),
  },
]
export default routes
