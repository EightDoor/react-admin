import React from 'react'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { http } from '@/utils/request'

interface Props<T> {
  // 表格行
  columns: ProColumns<T>[]
  // 索引key
  rowKey?: string
  // 标题
  headerTitle?: string
  // 顶部的操作栏
  toolBar?: React.ReactNode[]
}
function CommonTable<T>(props: Props<T>) {
  const ToolBar = () => {
    let list: React.ReactNode[] = []
    if (props.toolBar) {
      list = props.toolBar
    }
    return list
  }
  return (
    <>
      <ProTable<T>
        columns={props.columns}
        rowKey={props.rowKey ?? 'id'}
        search={{
          labelWidth: 'auto',
        }}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter)
          return Promise.resolve({
            data: [],
            success: true,
          })
        }}
        pagination={{ pageSize: 10 }}
        dateFormatter="string"
        headerTitle={props.headerTitle}
        toolBarRender={() => ToolBar()}
      />
    </>
  )
}
export default CommonTable
