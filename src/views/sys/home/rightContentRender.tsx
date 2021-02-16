import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header'
import { Avatar, Dropdown, Menu } from 'antd'
import React from 'react'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

const RightContentRender = (props: HeaderViewProps) => {
  const history = useHistory()
  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => logOut()}>退出</a>
      </Menu.Item>
    </Menu>
  )
  const logOut = () => {
    history.push('/login')
  }
  return (
    <>
      <Dropdown overlay={menu}>
        <Avatar shape="square" size="large" icon={<UserOutlined />} />
      </Dropdown>
    </>
  )
}

export default RightContentRender
