import React from 'react'
import { Button } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { ButtonType } from 'antd/lib/button'

interface Props {
  list: CommonButtonType[]
  change: (val: string) => void
}
export interface CommonButtonType {
  title: string
  size?: SizeType
  type?: ButtonType
  key?: string
}
const CommonButton = (props: Props) => (
  <>
    {props.list.map((item) => (
      <Button
        onClick={() => props.change(item.key ?? item.title)}
        style={{ marginRight: 15 }}
        key={item.title}
        size={item.size ?? 'small'}
        type={item.type ?? 'primary'}
      >
        {item.title}
      </Button>
    ))}
  </>
)

export default CommonButton
