import React, { ReactNode } from 'react'
import CommonTable from '@/components/table/table'
import { ProColumns } from '@ant-design/pro-table'
import { SysUser } from '@/type/user/user'

const SysUserView = () => {
  const columns: ProColumns<SysUser, 'text'>[] = [
    {
      title: '账户',
      dataIndex: 'account',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: ReactNode) => ({ text }),
    },
  ]
  return (
    <>
      <CommonTable<SysUser> columns={columns} url="user" />
    </>
  )
}

export default SysUserView
