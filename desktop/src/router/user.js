// 用户模块路由配置
let routers = []

routers = routers.concat([
  {
    path: '/user/main',
    name: 'Main',
    component: () => import('../views/user/Main.vue'),
  },
  {
    path: '/user/chatroom',
    name: 'ChatRoom',
    component: () => import('../views/user/ChatRoom.vue'),
  },
  {
    path: '/user/reg',
    name: 'UserReg',
    component: () => import('../views/user/Reg.vue'),
  },
  {
    path: '/user/file',
    name: 'UserFile',
    component: () => import('../views/user/File.vue'),
  },
  {
    path: '/user/portable',
    name: 'PortableInfo',
    component: () => import('../views/user/PortableInfo.vue'),
  },
  {
    path: '/user/emailinfo',
    name: 'EmailInfo',
    component: () => import('../views/user/EmailInfo.vue'),
  },
  {
    path: '/user/mapinfo',
    name: 'MapInfo',
    component: () => import('../views/user/MapInfo.vue'),
  },
])
export default routers
