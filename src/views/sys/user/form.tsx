import { CommonFormType, CommonFormTypeShow } from '@/type/commonType'
import { http } from '@/utils/request'
import { DrawerForm, ProFormRadio, ProFormText } from '@ant-design/pro-form'
import { message } from 'antd'
import React, { useState, useImperativeHandle, forwardRef, Ref } from 'react'

const CommonForm = (props: any, ref: Ref<CommonFormType>) => {
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [title, setTitle] = useState('添加')

  useImperativeHandle(ref, () => ({
    show: (val: CommonFormTypeShow) => {
      if (val === 'add') {
        // do
      }
      setDrawerVisit(true)
    },
  }))
  return (
    <>
      <DrawerForm
        visible={drawerVisit}
        onVisibleChange={setDrawerVisit}
        title={title}
        onFinish={async (values) => {
          console.log('🚀 ~ file: form.tsx ~ line 39 ~ onFinish={ ~ values', values)
          try {
            const result = await http.post('user', values)
            console.log(result)
            message.success('提交成功')
            return true
          } catch (error) {
            console.log(error)
            message.error('提交失败')
            return false
          }
        }}
        initialValues={{
          status: 1,
        }}
      >
        <ProFormText rules={[{ required: true, message: '请输入账户' }]} label="账户" name="account" />
        <ProFormText rules={[{ required: true, message: '请输入昵称' }]} label="昵称" name="nickName" />
        <ProFormText fieldProps={{ type: 'email' }} label="邮箱" name="email" />
        <ProFormRadio.Group
          name="status"
          label="状态"
          options={[
            {
              label: '有效',
              value: 1,
            },
            {
              label: '失效',
              value: 0,
            },
          ]}
        />
        <ProFormText fieldProps={{ type: 'tel' }} label="手机号码" name="phoneNum" />
        <ProFormText.Password
          fieldProps={{ type: 'password' }}
          rules={[{ required: true, message: '请输入密码' }]}
          label="密码"
          name="passWord"
        />
      </DrawerForm>
    </>
  )
}

export default forwardRef(CommonForm)
