import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Route, RouteProps, Switch, useHistory } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'

import SysHome from '@/views/sys/home/home'
import Login from '@/views/login/login'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import SysUserView from '@/views/sys/user/user'
import SysDeptView from '@/views/sys/dept/dept'
import SysRole from '@/views/sys/role/role'
import NotFond from '@/views/sys/noFond'
import { useMount } from 'ahooks'
import Lottie, { Options } from 'react-lottie'
import * as animationData from '@/assets/loading-spinner.json'
import { cloneDeep } from 'lodash'
import { getTokenValue, getUserInfo, logOutUtils } from './utils'
import { store, RootState, Dispatch } from './store/store'
import styles from './App.module.less'
import { SysMenu } from './type/sys/sys'
import SysMenuCom from './views/sys/menu/menu'
import Loading from './views/Loading'

interface MenusShow extends RouteProps {
  id?: string
  parentId?: number
}
function App() {
  const history = useHistory()
  // const userInfoState = useSelector((state: RootState) => state.sys)
  const dispatch = useDispatch<Dispatch>()
  const baseRoutes: MenusShow[] = [
    {
      path: '/login',
      exact: true,
      component: Login,
    },
    {
      path: '/',
      component: SysHome,
      children: [
        // {
        //   path: '/sys/user',
        //   component: SysUserView,
        // },
        // {
        //   path: '/sys/dept',
        //   component: SysDeptView,
        // },
        // {
        //   path: '/sys/role',
        //   component: SysRole,
        // },
        // {
        //   path: '/sys/menu',
        //   component: SysMenuCom,
        // },
        // {
        //   path: '*',
        //   component: NotFond,
        // },
      ],
    },
    {
      path: '*',
      component: NotFond,
    },
  ]

  const [loading, setLoading] = useState(true)
  const routes = useRef<MenusShow[]>(baseRoutes)

  useMount(async () => {
    setLoading(true)
    // 获取token的情况下获取用户信息
    const result = await getTokenValue()
    if (result) {
      getUserInfo()
        .then((res) => {
          console.log(res, 'userInfo')
          dispatch({ type: 'sys/setUserInfo', payload: res })
          const resultV = cloneDeep(res)

          const resultR: MenusShow[] = []
          const treeObj: any = {}
          resultV.menus.map((item: SysMenu) => {
            treeObj[item.id] = item
            item.parentId = Number(item.parentId)
            // @ts-ignore
            item.component = lazy(() => import(item.component))
          })
          for (const node of resultV.menus) {
            if (node.parentId !== 0) {
              if (treeObj[node.parentId].children) {
                node.path = treeObj[node.parentId].path + node.path
                treeObj[node.parentId].children.push(node)
              } else {
                treeObj[node.parentId].children = [node]
              }
            } else {
              // @ts-ignore
              resultR.push(node)
            }
          }
          routes.current[1].children = resultV.menus
          console.log(resultV)
          setLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
          message.error('获取用户信息失败,跳转到登陆页面')
        })
    } else {
      setLoading(false)
    }
  })

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
            <Suspense fallback={<Loading />}>
              <Router>
                <Switch>{routes.current.map((item: RouteProps, index) => RouteWithSubRoutes(item, index))}</Switch>
              </Router>
            </Suspense>
          )}
        </ConfigProvider>
      </Provider>
    </>
  )
}

function RouteWithSubRoutes(route: RouteProps, index: number) {
  return <Route key={index} path={route.path} render={(props) => OnEnter(route.component, props, route)} />
}

function OnEnter(Component: any, props: any, route: RouteProps) {
  return (
    <>
      <Component {...props} routes={route.children} />
    </>
  )
}

export { App, RouteWithSubRoutes }
