import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import SysHome from '@/views/sys/home'
import Login from '@/views/login/login'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import SysUserView from './views/sys/user/user'
import SysDeptView from './views/sys/dept/dept'
import SysRole from './views/sys/role/role'
import SysMenu from './views/sys/menu/menu'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route path="/" component={SysHome}>
            <Route exact path="/sys/user" component={SysUserView} />
            <Route exact path="/sys/dept" component={SysDeptView} />
            <Route exact path="/sys/role" component={SysRole} />
            <Route exact path="/sys/menu" component={SysMenu} />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>
  )
}

export default App
