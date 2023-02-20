const routes = [
  {
    path: '/toll',
    component: () => import('../view/Toll/TollHome.vue'),
  },
  {
    path: '/toll/encrypt',
    component: () => import('../view/Toll/TollEncrypt.vue'),
  },
  {
    path: '/toll/userencrypt',
    component: () => import('../view/Toll/TollUserEncrypt.vue'),
  },
]
export default routes
