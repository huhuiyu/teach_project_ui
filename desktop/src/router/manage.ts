const routes = [
  {
    path: '/test/dept',
    component: () => import('../view/manage/DeptView.vue'),
  },
  {
    path: '/test/employee',
    component: () => import('../view/manage/Employee.vue'),
  },
]

export default routes
