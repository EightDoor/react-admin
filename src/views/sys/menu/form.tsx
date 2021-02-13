import { CommonFormType, CommonFormTypeShow, CommonOptions, TableResult } from '@/type/commonType'
import { SysDept, SysMenu } from '@/type/sys/sys'
import { formatMenuType, formatTree } from '@/utils'
import { http } from '@/utils/request'
import { DrawerForm, ProFormSelect, ProFormText } from '@ant-design/pro-form'
import { useMount } from 'ahooks'
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
  const [options, setOptions] = useState<CommonOptions[]>([])
  const isOptions = [
    {
      label: '是',
      value: 1,
    },
    {
      label: '否',
      value: 0,
    },
  ]
  const [menus, setMenus] = useState<SysMenu[]>([])

  useMount(() => {
    getOptions()
    getMenuTree()
  })
  const getMenuTree = () => {
    http
      .get('menu')
      .then((res: TableResult) => {
        setMenus(formatTree(res.data.data))
        console.log('🚀 ~ file: form.tsx ~ line 50 ~ http.get ~ res.data.data', res.data.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const getOptions = () => {
    const vv: CommonOptions[] = []
    formatMenuType().options.forEach((item) => {
      vv.push({
        label: formatMenuType(item).title,
        value: item,
      })
    })
    setOptions(vv)
  }
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
          hidden: 0,
          isHome: 0,
        }}
      >
        <ProFormText rules={[{ required: true, message: '请输入标题' }]} label="标题" name="title" />
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
        <ProFormSelect
          options={options}
          name="type"
          label="菜单类型"
          rules={[{ required: true, message: '请选择菜单类型' }]}
        />
        <ProFormText name="perms" label="权限标识" placeholder="请输入权限标识" />
        <ProFormText name="name" label="菜单标识" placeholder="请输入菜单标识" />
        <ProFormText name="path" label="路径" placeholder="请输入路径" />
        <ProFormText name="component" label="组件地址" placeholder="请输入组件地址" />
        <ProFormText name="redirect" label="重定向地址" placeholder="请输入重定向地址" />
        <ProFormText name="icon" label="图标" placeholder="请输入图标" />
        <ProFormSelect options={isOptions} name="hidden" label="是否隐藏" />
        <ProFormSelect options={isOptions} name="isHome" label="是否首页" />
        <ProFormText fieldProps={{ type: 'number' }} label="排序" name="orderNum" />
      </DrawerForm>
    </>
  )
}

export default forwardRef(CommonForm)
