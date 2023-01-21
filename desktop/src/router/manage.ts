const routes = [
  {
    path: '/manage/dept',
    component: () => import('../view/manage/DeptView.vue'),
  },
  {
    path: '/manage/employee',
    component: () => import('../view/manage/Employee.vue'),
  },
  {
    path: '/manage/class',
    component: () => import('../view/classManage/ClassView.vue'),
  },
  {
    path: '/manage/student',
    component: () => import('../view/classManage/StudentView.vue'),
  },
  {
    path: '/manage/file',
    component: () => import('../view/manage/FileManagement.vue'),
  },
]

export default routes
