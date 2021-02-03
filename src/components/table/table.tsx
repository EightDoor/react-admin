import React from 'react'
import ProTable, { ProColumns } from '@ant-design/pro-table'
import { http } from '@/utils/request'
import { TableResult } from '@/type/commonType'
import { SysUser } from '@/type/user/user'

interface Props<T> {
  // 表格行
  columns: ProColumns<T, 'text'>[]
  // 索引key
  rowKey?: string
  // 标题
  headerTitle?: string
  // 顶部的操作栏
  toolBar?: React.ReactNode[]
  // 地址
  url: string
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
          const page = params.current ?? 1
          const limit = params.pageSize ?? 10
          return new Promise((resolve, reject) => {
            http
              .get(props.url, {
                params: {
                  page,
                  limit,
                },
              })
              .then((res: TableResult) => {
                console.log(res)
                resolve({
                  data: res.data.data,
                  success: true,
                  total: res.data.total,
                })
              })
              .catch((error) => {
                reject(error)
              })
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
