import React, { useRef } from 'react'
import CommonTable, { TableActions } from '@/components/table/table'
import { ProColumns } from '@ant-design/pro-table'
import { SysUser } from '@/type/sys/sys'
import { Button, Tag } from 'antd'
import { CommonFormType } from '@/type/commonType'
import CommonForm from './form'

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
  const commonFormRef = useRef<CommonFormType>(null)
  const ActionFun = (val: string) => {
    console.log('🚀 ~ file: user.tsx ~ line 59 ~ Edit ~ row', val)
  }
  const toolBar = () => [
    <Button key="add" onClick={() => Add()} type="primary">
      新建
    </Button>,
  ]
  const Add = () => {
    commonFormRef.current?.show('add')
  }
  return (
    <>
      <CommonTable<SysUser> toolBar={toolBar()} actionFun={ActionFun} actions={actions} columns={columns} url="user" />
      <CommonForm ref={commonFormRef} />
    </>
  )
}

export default SysUserView
