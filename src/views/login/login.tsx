import React, { useState } from 'react'
import { Button, Form, Input, notification } from 'antd'
import { useHistory } from 'react-router-dom'
import { store } from '@/utils/store'

import { TOKEN } from '@/utils/constant'
import { http } from '@/utils/request'
import { LoginSuccess } from '@/type/commonType'
import styles from './login.module.less'

interface LoginType {
  username: string
  password: string
}
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const tailLayout = {
  wrapperCol: { offset: 2, span: 22 },
}

const LoginHome = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const history = useHistory()

  const loginFun = () => {
    form
      .validateFields()
      .then(async (res: LoginType) => {
        console.log(res)
        setLoading(true)
        try {
          const result = await http.post<LoginSuccess>('auth/login', res)
          if (result.data.msg === 'success') {
            console.log(result, 'r')
            const { data } = result
            await store.setItem(TOKEN, data.accessToken)
            notification.open({
              message: '提示',
              description: '登陆成功',
              type: 'success',
            })
            history.push('/')
            return true
          }
          notification.open({
            message: '提示',
            description: result.data.msg,
            type: 'error',
          })

          setLoading(false)
        } catch (error) {
          console.error(error)
          setLoading(false)
        }
        return false
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <div className={styles.container}>
        <h1>后台管理</h1>
        <Form form={form} {...layout}>
          <Form.Item rules={[{ required: true, message: '请输入' }]} name="username" label="用户名">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '请输入' }]} name="password" label="密码">
            <Input.Password onPressEnter={() => loginFun()} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button loading={loading} type="primary" onClick={() => loginFun()}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default LoginHome
