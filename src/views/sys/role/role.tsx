import React, { useRef, useState } from 'react'
import CommonTable, { TableActions } from '@/components/table/table'
import { ActionType, ProColumns } from '@ant-design/pro-table'
import { SysRole, SysUser } from '@/type/sys/sys'
import { Button, message, Tag } from 'antd'
import { CommonFormType } from '@/type/commonType'
import { ModalForm, ProFormText } from '@ant-design/pro-form'
import { useForm } from 'antd/lib/form/Form'
import { http } from '@/utils/request'
import CommonForm from './form'

const SysRole = () => {
  const url = 'role'
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
      title: '菜单分配',
      key: 'menu',
    },
    {
      title: '删除',
      type: 'del',
      key: 'del',
    },
  ]
  const columns: ProColumns<SysRole>[] = [
    {
      title: '名称',
      dataIndex: 'roleName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },

    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      hideInSearch: true,
    },
  ]
  const commonFormRef = useRef<CommonFormType>(null)
  const ActionFun = async (val: string, data: SysRole | undefined) => {
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
      <CommonTable<SysRole>
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

export default SysRole
