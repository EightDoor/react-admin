import React, { useRef, useState } from 'react'
import CommonTable, { TableActions } from '@/components/table/table'
import { ActionType, ProColumns } from '@ant-design/pro-table'
import { SysDept } from '@/type/sys/sys'
import { Button, message, Tag } from 'antd'
import { CommonFormType, TableResult } from '@/type/commonType'
import { useMount } from 'ahooks'
import { http } from '@/utils/request'
import { formatMenuType, formatTree } from '@/utils'
import CommonForm from './form'

const SysMenu = () => {
  const url = 'menu'
  const pageSize = 1000
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
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
      renderText: (text: string) => <Tag color={formatMenuType(text).color}>{formatMenuType(text).title}</Tag>,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      hideInSearch: true,
    },
    {
      title: '菜单标识',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
      hideInSearch: true,
    },
    {
      title: '路径',
      dataIndex: 'path',
      hideInSearch: true,
    },
    {
      title: '组件地址',
      dataIndex: 'component',
      hideInSearch: true,
    },
    {
      title: '重定向地址',
      dataIndex: 'redirect',
      hideInSearch: true,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      hideInSearch: true,
    },
    {
      title: '是否隐藏',
      dataIndex: 'hidden',
      hideInSearch: true,
      renderText: (text: string) => <>{text ? <Tag color="green">是</Tag> : '否'}</>,
    },
    {
      title: '是否首页',
      dataIndex: 'isHome',
      hideInSearch: true,
      renderText: (text: string) => <>{text ? <Tag color="green">是</Tag> : '否'}</>,
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
        await http.delete(`${url}/${data?.id}`)
        Refresh()
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
          limit: pageSize,
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
        pageSize={pageSize}
        actionRef={ref}
        isTree
        toolBar={toolBar()}
        actionFun={ActionFun}
        actions={actions}
        columns={columns}
        url={url}
      />
      <CommonForm url={url} Refresh={() => Refresh()} ref={commonFormRef} treeData={treeData} />
    </>
  )
}

export default SysMenu
