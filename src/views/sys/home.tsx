import React, { useState, useEffect } from 'react'
import type { MenuDataItem } from '@ant-design/pro-layout'
import ProLayout, { PageContainer } from '@ant-design/pro-layout'
import { RouteProps, useHistory, Switch } from 'react-router-dom'
import { Ulog } from '@/utils/log'
import { RouteWithSubRoutes } from '@/App'
import customMenuDate from './customMenu'

interface Props {
  routes: RouteProps[]
}
const Home = (props: Props) => {
  const history = useHistory()
  const [menuData, setMenuData] = useState<MenuDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pathname, setPathname] = useState<string>('/')
  useEffect(() => {
    Ulog.log('test')
    setMenuData([])
    setLoading(true)
    setTimeout(() => {
      setMenuData(customMenuDate)
      setLoading(false)
    }, 2000)
  }, [])

  const onMenuHeaderClick = (val: React.MouseEvent<HTMLDivElement>) => {
    history.push('/')
    setPathname('/')
  }
  const Change = (val: MenuDataItem) => {
    console.log('🚀 ~ file: home.tsx ~ line 25 ~ Change ~ val', val.path)
    if (val.path) {
      setPathname(val.path)
      history.push(val.path)
    }
  }
  return (
    <>
      <ProLayout
        style={{
          height: '100vh',
        }}
        menu={{
          loading,
        }}
        menuItemRender={(item, dom) => (
          <>
            <a
              onClick={() => {
                Change(item)
              }}
            >
              {dom}
            </a>
          </>
        )}
        onMenuHeaderClick={onMenuHeaderClick}
        // location={{
        //   pathname: '/welcome/welcome',
        // }}
        location={{ pathname }}
        menuDataRender={() => menuData}
      >
        <PageContainer content="欢迎使用">
          <Switch>
            {props.routes.map((route) => (
              <RouteWithSubRoutes key={route.path} {...route} />
            ))}
          </Switch>
        </PageContainer>
      </ProLayout>
    </>
  )
}

export default Home
