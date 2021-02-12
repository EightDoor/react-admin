import { CommonFormType, CommonFormTypeShow, TableResult } from '@/type/commonType'
import { SysDept, SysUser } from '@/type/sys/sys'
import { formatTree } from '@/utils'
import { http } from '@/utils/request'
import { DrawerForm, ProFormRadio, ProFormText } from '@ant-design/pro-form'
import { useMount } from 'ahooks'
import { message, Form, TreeSelect } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { cloneDeep } from 'lodash'
import React, { useState, useImperativeHandle, forwardRef, Ref } from 'react'

interface Props {
  url: string
  // 刷新
  onRefresh: () => void
}
const CommonForm = (props: Props, ref: Ref<CommonFormType>) => {
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [title, setTitle] = useState('添加')
  const [form] = useForm()
  const [dataSource, setDataSource] = useState<SysDept[]>([])
  const [editId, setEditId] = useState<string>()
  const [editData, setEditData] = useState<SysUser>()
  const defaultPasswd = '123456'

  useMount(() => {
    http
      .get('dept', {
        params: {
          page: 1,
          limit: 1000,
        },
      })
      .then((res: TableResult<SysDept>) => {
        setDataSource(formatTree(res.data.data))
        console.log('🚀 ~ file: form.tsx ~ line 32 ~ useMount ~ formatTree(res.data.data)', formatTree(res.data.data))
      })
      .catch((error) => {
        console.log(error)
      })
  })
  useImperativeHandle(ref, () => ({
    show: (val: CommonFormTypeShow, value: SysUser) => {
      if (val === 'add') {
        form.resetFields()
        setEditId('')
        setTitle('添加')
      } else if (val === 'edit') {
        console.log(value)
        value.deptId = Number(value.deptId)
        setEditId(value.id)
        setTitle('修改')
        setEditData(value)
        form.setFieldsValue(value)
      }
      setDrawerVisit(true)
    },
  }))
  return (
    <>
      <DrawerForm
        form={form}
        visible={drawerVisit}
        onVisibleChange={setDrawerVisit}
        title={title}
        onFinish={async (values) => {
          const data = cloneDeep(values)
          console.log('🚀 ~ file: form.tsx ~ line 39 ~ onFinish={ ~ values', data)
          if (!data.password && !editId) {
            data.passWord = defaultPasswd
          }
          try {
            await (editId ? http.patch(`${props.url}/${editId}`, data) : http.post(props.url, data))
            props.onRefresh()
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
        <Form.Item name="deptId" label="部门" rules={[{ required: true, message: '请选择' }]}>
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={dataSource}
            placeholder="请选择"
            treeDefaultExpandAll
          />
        </Form.Item>
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
        {!editId ? (
          <ProFormText.Password fieldProps={{ type: 'password' }} label="密码(默认为123456)" name="passWord" />
        ) : null}
      </DrawerForm>
    </>
  )
}

export default forwardRef(CommonForm)
