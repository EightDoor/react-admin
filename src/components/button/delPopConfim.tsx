import React from 'react'
import { Button, Popconfirm } from 'antd'

interface Props {
  title: string
  content?: string
  ok: () => void
  cancel?: () => void
  okText?: string
  cancelText?: string
}
const DelPropConfim = (props: Props) => (
  <>
    <Popconfirm
      title={props.content ?? '确定删除吗?'}
      onConfirm={props.ok}
      onCancel={props.cancel}
      okText={props.okText ?? '确定'}
      cancelText={props.cancelText ?? '取消'}
    >
      <Button type="ghost" size="small">
        {props.title ?? '删除'}
      </Button>
    </Popconfirm>
  </>
)

export default DelPropConfim
