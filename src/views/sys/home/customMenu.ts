export default [
  {
    path: '/sys',
    name: '系统管理',
    children: [
      {
        path: '/sys/user',
        name: '用户管理',
      },
      {
        path: '/sys/role',
        name: '角色管理',
      },
      {
        path: '/sys/dept',
        name: '部门管理',
      },
      {
        path: '/sys/menu',
        name: '菜单管理',
      },
      {
        path: '/sys/dict',
        name: '字典管理',
      },
    ],
  },
]
