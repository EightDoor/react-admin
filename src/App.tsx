import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import SysHome from '@/views/sys/home'
import Login from '@/views/login/login'

function App() {
  return (
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
  )
}

export default App
