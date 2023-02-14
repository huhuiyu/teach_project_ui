const routes = [
  {
    path: '/portable',
    component: () => import('../view/portable/Home.vue'),
  },
  {
    path: '/portable/email',
    component: () => import('../view/portable/Email.vue'),
  },
  {
    path: '/portable/portal',
    component: () => import('../view/portable/UserPortal.vue'),
  },
]

export default routes
