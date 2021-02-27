import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Route, RouteProps, Switch, useHistory } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'

import SysHome from '@/views/sys/home/home'
import Login from '@/views/login/login'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import SysUserView from '@/views/sys/user/user'
import SysDeptView from '@/views/sys/dept/dept'
import SysRole from '@/views/sys/role/role'
import SysMenu from '@/views/sys/menu/menu'
import NotFond from '@/views/sys/noFond'
import { useMount } from 'ahooks'
import Lottie, { Options } from 'react-lottie'
import * as animationData from '@/assets/loading-spinner.json'
import { getTokenValue, getUserInfo, logOutUtils } from './utils'
import { store, RootState, Dispatch } from './store/store'
import styles from './App.module.less'

function App() {
  const history = useHistory()
  // const userInfoState = useSelector((state: RootState) => state.sys)
  // const dispatch = useDispatch<Dispatch>()
  const baseRoutes: RouteProps[] = [
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
  ]

  const [loading, setLoading] = useState(true)
  const routes = useRef<RouteProps[]>(baseRoutes)

  // useMount(async () => {
  //   setLoading(true)
  //   // 获取token的情况下获取用户信息
  //   const result = await getTokenValue()
  //   if (result) {
  //     getUserInfo()
  //       .then((res) => {
  //         console.log(res, 'userInfo')

  //         res.menus.forEach((item) => {
  //           const obj: RouteProps = {
  //             path: item.path,
  //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //             // @ts-ignore
  //             component: () => import(item.component),
  //           }
  //           baseRoutes.push(obj)
  //         })
  //         baseRoutes.push({
  //           path: '*',
  //           component: NotFond,
  //         })
  //         console.log(routes.current, 'routes')
  //         routes.current = baseRoutes
  //         setLoading(false)
  //       })
  //       .catch((error) => {
  //         console.error(error)
  //         setLoading(false)
  //         message.error('获取用户信息失败,跳转到登陆页面')
  //       })
  //   } else {
  //     setLoading(false)
  //   }
  // })

  const defaultOptions: Options = {
    loop: true,
    autoplay: true,
    animationData,
  }
  return (
    <>
      <Provider store={store}>
        <ConfigProvider locale={zhCN}>
          {loading ? (
            <div className={styles.lottieContainer}>
              <h2>页面加载中...</h2>
              <Lottie options={defaultOptions} width={300} height={300} />
            </div>
          ) : (
            <Router>
              <Switch>
                {routes.current.map((route) => (
                  <RouteWithSubRoutes key={route.path} {...route} />
                ))}
              </Switch>
            </Router>
          )}
        </ConfigProvider>
      </Provider>
    </>
  )
}

function RouteWithSubRoutes(route: any) {
  return <Route path={route.path} render={(props) => <route.component {...props} routes={route.children} />} />
}

export { App, RouteWithSubRoutes }
