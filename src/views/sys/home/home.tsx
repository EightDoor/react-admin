import React, { useState, useEffect, Suspense } from 'react'
import type { MenuDataItem } from '@ant-design/pro-layout'
import ProLayout, { PageContainer } from '@ant-design/pro-layout'
import { useHistory, Switch, Route } from 'react-router-dom'
import { message } from 'antd'
import { logOutUtils } from '@/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Loading from '@/views/Loading'
import { SysMenu } from '@/type/sys/sys'
import { getAsyncComponent } from '@/components/asyncComponent'
import customMenuDate from './customMenu'
import RightContentRender from './rightContentRender'

const Home = () => {
  const history = useHistory()
  const [menuData, setMenuData] = useState<MenuDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pathname, setPathname] = useState<string>('/')
  const menus = useSelector((state: RootState) => state.sys.menus)
  const [defaultMenus, setDefaultMenus] = useState<SysMenu[]>([])
  useEffect(() => {
    setMenuData([])
    setLoading(true)
    setTimeout(() => {
      setMenuData(customMenuDate)
      setLoading(false)
    }, 2000)
  }, [])
  useEffect(() => {
    if (menus && menus.length > 0) {
      setDefaultMenus(menus)
    }
  }, [menus])

  const onMenuHeaderClick = async (val: React.MouseEvent<HTMLDivElement>) => {
    message.loading('退出中...')
    await logOutUtils()
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
        fixSiderbar
        fixedHeader
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
        rightContentRender={RightContentRender}
        onMenuHeaderClick={onMenuHeaderClick}
        // location={{
        //   pathname: '/welcome/welcome',
        // }}
        location={{ pathname }}
        menuDataRender={() => menuData}
      >
        <PageContainer content="欢迎使用">
          <Switch>
            {defaultMenus.map((route, index) => (
              <Route
                key={`router${index}`}
                path={route.path}
                component={getAsyncComponent(route.component)}
                // render={(props: any) => {
                //   const Component = route.component
                //   console.log(Component)
                //   return getAsyncComponent(Component)
                // }}
              />
            ))}
          </Switch>
        </PageContainer>
      </ProLayout>
    </>
  )
}

export default Home
