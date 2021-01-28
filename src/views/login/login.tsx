import React from 'react'
import { Button, Form, Input, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { store } from '@/utils/store'

// import styles from './login.module.less';
import { TOKEN } from '@/utils/constant'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const tailLayout = {
  wrapperCol: { offset: 2, span: 22 },
}

const LoginHome = () => {
  const [form] = Form.useForm()
  const history = useHistory()

  const loginFun = () => {
    form
      .validateFields()
      .then((res: any) => {
        console.log(res)
        store.setItem(TOKEN, Date.now())
        history.push('/')
        message.success('登录成功')
        return true
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <div>
        <h1>后台管理</h1>
        <Form form={form} {...layout}>
          <Form.Item rules={[{ required: true, message: '请输入' }]} name="username" label="用户名">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请输入' }]} name="password" label="密码">
            <Input.Password onPressEnter={() => loginFun()} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" onClick={() => loginFun()}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default LoginHome
