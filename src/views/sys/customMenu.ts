export default [
  {
    path: '/',
    name: 'welcome',
    children: [
      {
        path: '/welcome',
        name: 'one',
        children: [
          {
            path: '/welcome/welcome',
            name: 'two',
            exact: true,
          },
        ],
      },
    ],
  },
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
  {
    path: '/demo',
    name: 'demo',
  },
]
