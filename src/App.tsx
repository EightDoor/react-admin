import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Route, RouteProps, Switch, useHistory } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'

import SysHome from '@/views/sys/home/home'
import Login from '@/views/login/login'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
// import SysUserView from '@/views/sys/user/user'
// import SysDeptView from '@/views/sys/dept/dept'
// import SysRole from '@/views/sys/role/role'
import NotFond from '@/views/sys/noFond'
import { useMount } from 'ahooks'
import Lottie, { Options } from 'react-lottie'
import * as animationData from '@/assets/loading-spinner.json'
import { getTokenValue, getUserInfo } from './utils'
import { store, Dispatch } from './store/store'
import styles from './App.module.less'
import { SysMenu } from './type/sys/sys'
import { getAsyncComponent } from './components/asyncComponent'

interface MenusShow extends RouteProps {
  id?: string
  parentId?: number
}
function App() {
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

  useMount(async () => {
    setLoading(true)
    // 获取token的情况下获取用户信息
    const result = await getTokenValue()
    if (result) {
      getUserInfo()
        .then((res) => {
          console.log(res, 'userInfo')

          const treeObj: any = {}
          res.menus.map((item: SysMenu) => {
            treeObj[item.id] = item
            item.parentId = Number(item.parentId)
            // @ts-ignore
            item.component = () => import(`./views/${item.component}`)
          })
          for (const node of res.menus) {
            if (node.parentId !== 0 && treeObj[node.parentId]) {
              node.path = treeObj[node.parentId].path + node.path
            }
          }
          dispatch({ type: 'sys/setUserInfo', payload: res })
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
            <Router>
              <Switch>
                {baseRoutes.map((item: RouteProps, index) => (
                  <Route key={`router${index}`} path={item.path} component={item.component} />
                ))}
              </Switch>
            </Router>
          )}
        </ConfigProvider>
      </Provider>
    </>
  )
}

export { App }
