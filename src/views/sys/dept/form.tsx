import { CommonFormType, CommonFormTypeShow } from '@/type/commonType'
import { SysDept } from '@/type/sys/sys'
import { http } from '@/utils/request'
import { DrawerForm, ProFormText } from '@ant-design/pro-form'
import { message, Form, TreeSelect } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { cloneDeep } from 'lodash'
import React, { useState, useImperativeHandle, forwardRef, Ref, useEffect } from 'react'

interface Props {
  treeData: SysDept[]
  // 刷新
  Refresh: () => void
  url: string
}
const CommonForm = (props: Props, ref: Ref<CommonFormType>) => {
  const [drawerVisit, setDrawerVisit] = useState(false)
  const [title, setTitle] = useState('添加')
  const [treeData, setTreeData] = useState<SysDept[]>([])
  const [editId, setEditId] = useState<string>()
  const [form] = useForm()

  useImperativeHandle(ref, () => ({
    show: (val: CommonFormTypeShow, data) => {
      if (val === 'add') {
        setEditId('')
        setTitle('添加')
      } else if (val === 'edit') {
        setTitle('修改')
        setEditId(data.id)
        form.setFieldsValue(data)
      }
      setDrawerVisit(true)
    },
  }))

  useEffect(() => {
    console.log(props.treeData, 'tree')
    setTreeData(props.treeData)
  }, [props.treeData])
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
          try {
            // 修改
            if (editId) {
              data.id = editId
              await http.patch(`${props.url}/${editId}`, data)
            } else {
              await http.post(props.url, data)
            }
            props.Refresh()
            message.success('提交成功')
            return true
          } catch (error) {
            console.log(error)
            message.error('提交失败')
            return false
          }
        }}
        initialValues={{
          orderNum: 0,
        }}
      >
        <ProFormText rules={[{ required: true, message: '请输入名称' }]} label="部门名称" name="name" />
        <Form.Item name="parentId" label="父级">
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择，默认不选择为一级"
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
          />
        </Form.Item>
        <ProFormText fieldProps={{ type: 'number' }} label="排序" name="orderNum" />
      </DrawerForm>
    </>
  )
}

export default forwardRef(CommonForm)
