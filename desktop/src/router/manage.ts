const routes = [
  {
    path: '/manage/dept',
    component: () => import('../view/manage/DeptView.vue'),
  },
  {
    path: '/manage/employee',
    component: () => import('../view/manage/Employee.vue'),
  },
]

export default routes
