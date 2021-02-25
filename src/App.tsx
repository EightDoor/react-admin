import React from 'react'
import { BrowserRouter as Router, Route, RouteProps, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import SysHome from '@/views/sys/home/home'
import Login from '@/views/login/login'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import SysUserView from '@/views/sys/user/user'
import SysDeptView from '@/views/sys/dept/dept'
import SysRole from '@/views/sys/role/role'
import SysMenu from '@/views/sys/menu/menu'
import NotFond from '@/views/sys/noFond'
import { store } from './store/store'

function App() {
  const routes: RouteProps[] = [
    {
      path: '/login',
      exact: true,
      component: Login,
    },
    {
      path: '/',
      component: SysHome,
      children: [
        {
          path: '/sys/user',
          component: SysUserView,
        },
        {
          path: '/sys/dept',
          component: SysDeptView,
        },
        {
          path: '/sys/role',
          component: SysRole,
        },
        {
          path: '/sys/menu',
          component: SysMenu,
        },
        {
          path: '*',
          component: NotFond,
        },
      ],
    },
    {
      path: '*',
      component: NotFond,
    },
  ]
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <Switch>
            {routes.map((route) => (
              <RouteWithSubRoutes key={route.path} {...route} />
            ))}
          </Switch>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

function RouteWithSubRoutes(route: any) {
  return <Route path={route.path} render={(props) => <route.component {...props} routes={route.children} />} />
}

export { App, RouteWithSubRoutes }
