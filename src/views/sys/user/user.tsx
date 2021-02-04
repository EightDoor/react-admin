import React from 'react'
import CommonTable, { TableActions } from '@/components/table/table'
import { ProColumns } from '@ant-design/pro-table'
import { SysUser } from '@/type/user/user'
import { Tag } from 'antd'

const SysUserView = () => {
  const actions: TableActions[] = [
    {
      title: '编辑',
      key: 'edit',
    },
    {
      title: '删除',
      type: 'del',
      key: 'del',
    },
  ]
  const columns: ProColumns<SysUser>[] = [
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
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        1: { text: '正常' },
        0: { text: '禁用' },
      },
      render: (text: any) => {
        const d = text.props.text
        return d === 1 ? <Tag color="success">正常</Tag> : <Tag color="red">禁用</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      hideInSearch: true,
    },
  ]
  const ActionFun = (val: string) => {
    console.log('🚀 ~ file: user.tsx ~ line 59 ~ Edit ~ row', val)
  }
  return (
    <>
      <CommonTable<SysUser> actionFun={ActionFun} actions={actions} columns={columns} url="user" />
    </>
  )
}

export default SysUserView
