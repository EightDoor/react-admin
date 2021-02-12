import React, { useRef, useState } from 'react'
import CommonTable, { CommonTableActionRef, TableActions } from '@/components/table/table'
import { ActionType, ProColumns } from '@ant-design/pro-table'
import { SysDept } from '@/type/sys/sys'
import { Button, FormInstance, message } from 'antd'
import { CommonFormType, TableResult } from '@/type/commonType'
import { useMount } from 'ahooks'
import { http } from '@/utils/request'
import { formatTree } from '@/utils'
import CommonForm from './form'

const SysDeptView = () => {
  const url = 'dept'
  const ref = useRef<ActionType>()
  const [treeData, setTreeData] = useState<SysDept[]>([])
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
  const columns: ProColumns<SysDept>[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
    },
    {
      title: '父级id',
      dataIndex: 'parentId',
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ]
  const commonFormRef = useRef<CommonFormType<SysDept>>(null)
  const ActionFun = async (val: string, data: SysDept | undefined) => {
    console.log('🚀 ~ file: user.tsx ~ line 59 ~ Edit ~ row', val)
    switch (val) {
      case 'edit':
        commonFormRef.current?.show('edit', data)
        break
      case 'del':
        await http.delete(url + data?.id)
        getDeptList()
        message.success('删除成功')
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
  useMount(() => {
    getDeptList()
  })
  const getDeptList = () => {
    http
      .get(url, {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .then((res: TableResult<SysDept>) => {
        const { data } = res.data
        const result = formatTree(data)
        setTreeData(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const Refresh = () => {
    ref.current?.reload()
    getDeptList()
  }
  return (
    <>
      <CommonTable<SysDept>
        actionRef={ref}
        isTree
        toolBar={toolBar()}
        actionFun={ActionFun}
        actions={actions}
        columns={columns}
        url="dept"
      />
      <CommonForm url={url} Refresh={() => Refresh()} ref={commonFormRef} treeData={treeData} />
    </>
  )
}

export default SysDeptView
