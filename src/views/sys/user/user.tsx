import React, { useRef, useState } from 'react'
import CommonTable, { TableActions } from '@/components/table/table'
import { ActionType, ProColumns } from '@ant-design/pro-table'
import { SysUser } from '@/type/sys/sys'
import { Button, message, Tag } from 'antd'
import { CommonFormType } from '@/type/commonType'
import { ModalForm, ProFormText } from '@ant-design/pro-form'
import { useForm } from 'antd/lib/form/Form'
import { http } from '@/utils/request'
import CommonForm from './form'

const SysUserView = () => {
  const url = 'user'
  const [visible, setVisible] = useState(false)
  const [form] = useForm()
  const [editId, setEditId] = useState<string>()
  const tableRef = useRef<ActionType>()
  const actions: TableActions[] = [
    {
      title: '编辑',
      key: 'edit',
    },
    {
      title: '修改密码',
      key: 'editPass',
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
  const ActionFun = async (val: string, data: SysUser | undefined) => {
    console.log('🚀 ~ file: user.tsx ~ line 59 ~ Edit ~ row', val)
    switch (val) {
      case 'edit':
        commonFormRef.current?.show('edit', data)
        break
      case 'del':
        await http.delete(`${url}/${data?.id}`)
        message.success('删除成功')
        tableRef.current?.reload()
        break
      case 'editPass':
        setEditId(data?.id)
        setVisible(true)
        break
      default:
        break
    }
  }
  const toolBar = () => [
    <Button key="add" onClick={() => Add()} type="primary">
      新建
    </Button>,
  ]
  const Add = () => {
    commonFormRef.current?.show('add')
  }
  const onRefresh = () => {
    tableRef.current?.reload()
  }
  return (
    <>
      <CommonTable<SysUser>
        actionRef={tableRef}
        toolBar={toolBar()}
        actionFun={ActionFun}
        actions={actions}
        columns={columns}
        url={url}
      />
      <CommonForm onRefresh={onRefresh} url={url} ref={commonFormRef} />

      {/* 修改密码 */}
      <ModalForm<{
        passWord: string
        passWordN: string
      }>
        form={form}
        visible={visible}
        title="修改密码"
        onFinish={async (values) => {
          console.log(values.passWord)
          if (values.passWord === values.passWordN) {
            await http.patch(`${url}/${editId}`, { passWord: values.passWord })
            message.success('提交成功')
            tableRef.current?.reload()
            setVisible(false)
          } else {
            message.info('二次输入的密码不一致')
          }
          return true
        }}
        modalProps={{
          onCancel: () => {
            setVisible(false)
          },
        }}
      >
        <ProFormText.Password
          rules={[{ required: true, message: '请输入密码' }]}
          name="passWord"
          placeholder="请输入密码"
          label="密码"
        />
        <ProFormText.Password
          rules={[{ required: true, message: '请再次输入密码' }]}
          name="passWordN"
          placeholder="请再次输入密码"
          label="请再次输入密码"
        />
      </ModalForm>
    </>
  )
}

export default SysUserView
