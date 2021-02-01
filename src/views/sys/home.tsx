import React, { useState, useEffect } from 'react'
import type { MenuDataItem } from '@ant-design/pro-layout'
import ProLayout, { PageContainer } from '@ant-design/pro-layout'
import { useHistory } from 'react-router-dom'
import customMenuDate from './customMenu'

const Home = () => {
  const history = useHistory()
  const [menuData, setMenuData] = useState<MenuDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [pathname, setPathname] = useState<string>('/')
  useEffect(() => {
    setMenuData([])
    setLoading(true)
    setTimeout(() => {
      setMenuData(customMenuDate)
      setLoading(false)
    }, 2000)
  }, [])

  const onMenuHeaderClick = (val: React.MouseEvent<HTMLDivElement>) => {
    history.push('/')
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
        <PageContainer content="欢迎使用">首页哦</PageContainer>
      </ProLayout>
    </>
  )
}

export default Home
