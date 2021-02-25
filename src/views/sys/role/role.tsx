import React, { useRef, useState } from 'react'
import CommonTable, { TableActions } from '@/components/table/table'
import { ActionType, ProColumns } from '@ant-design/pro-table'
import { SysMenu, SysRole } from '@/type/sys/sys'
import { Button, message, Tree, Spin } from 'antd'
import { CommonFormType, TableResult } from '@/type/commonType'
import { ModalForm } from '@ant-design/pro-form'
import { useForm } from 'antd/lib/form/Form'
import { http } from '@/utils/request'
import { useMount } from 'ahooks'
import { formatTree } from '@/utils'
import CommonForm from './form'

type RoleMenu = SysMenu & { key: number | string }
const SysRoleView = () => {
  const url = 'role'
  const [visible, setVisible] = useState(false)
  const [form] = useForm()
  const [editId, setEditId] = useState<string>()
  const tableRef = useRef<ActionType>()
  const [treeData, setTreeData] = useState<RoleMenu[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [treeLoading, setTreeLoading] = useState(false)
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
      case 'menu':
        setEditId(data?.id)
        getRoleMenus(data?.id)
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
  useMount(() => {
    getDeptList()
  })
  const getDeptList = () => {
    http
      .get('menu', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .then((res: TableResult<RoleMenu>) => {
        const { data } = res.data
        setTreeData(formatTree(data))
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const onCheck = (checked: any): void => {
    console.log('onCheck', checked)
    setCheckedKeys(checked)
  }
  const getRoleMenus = (id?: string) => {
    setTreeLoading(true)
    http
      .get(`role/menus/${id}`)
      .then((res) => {
        if (res.data.menuId) {
          try {
            const result = res.data.menuId.split(',')
            const v: number[] = []
            result.forEach((item: string) => {
              v.push(Number(item))
            })
            setCheckedKeys(v)
          } catch (error) {
            console.log(error)
            setCheckedKeys([])
          }
        } else {
          setCheckedKeys([])
        }
        setTreeLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
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
        select: string[]
      }>
        form={form}
        visible={visible}
        title="菜单分配"
        onFinish={async () => {
          console.log(checkedKeys)
          const data = {
            menuId: checkedKeys.join(','),
            roleId: editId,
          }
          await http.post('role/relationAndMenu', data)
          message.success('提交成功')
          tableRef.current?.reload()
          setVisible(false)
          return true
        }}
        modalProps={{
          onCancel: () => {
            setVisible(false)
          },
        }}
      >
        <div style={{ height: '300px', overflow: 'scroll' }}>
          <Spin spinning={treeLoading}>
            <Tree defaultExpandAll checkable onCheck={onCheck} checkedKeys={checkedKeys} treeData={treeData} />
          </Spin>
        </div>
      </ModalForm>
    </>
  )
}

export default SysRoleView
