import { Button, Result } from 'antd'
import React from 'react'

const NotFond = () => (
  <>
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在"
      extra={<Button type="primary">返回首页</Button>}
    />
    ,
  </>
)

export default NotFond
