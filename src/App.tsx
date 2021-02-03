import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import SysHome from '@/views/sys/home'
import Login from '@/views/login/login'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route path="/">
            <SysHome />
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
