import React, { useRef, useState } from 'react'
import CommonTable, { TableActions } from '@/components/table/table'
import { ActionType, ProColumns } from '@ant-design/pro-table'
import { SysRole, SysUser } from '@/type/sys/sys'
import { Button, message, Spin, Tag } from 'antd'
import { CommonFormType, CommonOptions, TableResult } from '@/type/commonType'
import { ModalForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form'
import { useForm } from 'antd/lib/form/Form'
import { http } from '@/utils/request'
import { useMount } from 'ahooks'
import CommonForm from './form'

const SysUserView = () => {
  const url = 'user'
  const [visible, setVisible] = useState(false)
  const [form] = useForm()
  const [roleForm] = useForm()
  const [roleVis, setRoleVis] = useState(false)
  const [loadingRole, setLoadingRole] = useState(false)
  const [editId, setEditId] = useState<string>()
  const [userEditId, setUserEditId] = useState<string>()
  const [roleOptions, setRoleOptions] = useState<CommonOptions[]>([])
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
      title: '角色分配',
      key: 'roleAssignment',
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
      case 'roleAssignment':
        roleForm.resetFields()
        getRoleList(data?.id)
        setUserEditId(data?.id)
        setRoleVis(true)
        break
      default:
        break
    }
  }
  const getRoleList = (id?: string) => {
    setLoadingRole(true)
    http
      .get(`/user/roleList/${id}`)
      .then((res) => {
        console.log(res.data)
        const result: number[] = []
        if (res.data.roleId) {
          try {
            res.data.roleId.split(',').forEach((v: string) => {
              result.push(Number(v))
            })
            console.log(result, 'r')
            roleForm.setFieldsValue({
              selectRoles: result,
            })
          } catch (error) {
            console.log(error, '获取拥有角色')
          }
        }
        setLoadingRole(false)
      })
      .catch((error) => {
        console.log(error)
        setLoadingRole(false)
      })
  }
  useMount(() => {
    getRoleOptions()
  })
  const getRoleOptions = () => {
    http
      .get('role', {
        params: {
          page: 1,
          limgit: 1000,
        },
      })
      .then((res: TableResult<SysRole>) => {
        const result: CommonOptions[] = []
        res.data.data.forEach((item) => {
          result.push({
            label: item.roleName,
            value: item.id,
          })
        })
        setRoleOptions(result)
      })
      .catch((error) => {
        console.log(error)
      })
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
      {/* 角色分配 */}
      <ModalForm
        form={roleForm}
        visible={roleVis}
        title="角色分配"
        modalProps={{
          onCancel: () => {
            setRoleVis(false)
          },
        }}
        onFinish={async (values) => {
          console.log(values.selectRoles)
          const data = {
            userId: userEditId,
            roleId: values.selectRoles.join(','),
          }
          await http
            .post('user/userRole', data)
            .then((res) => {
              console.log(res.data.data)
              message.success('提交成功')
              setRoleVis(false)
            })
            .catch((error) => {
              console.log(error)
            })
          return true
        }}
      >
        <Spin spinning={loadingRole}>
          <ProFormCheckbox.Group name="selectRoles" layout="horizontal" options={roleOptions} />
        </Spin>
      </ModalForm>
    </>
  )
}

export default SysUserView
