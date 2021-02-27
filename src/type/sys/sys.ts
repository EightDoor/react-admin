import { BaseType } from '../commonType'

export interface SysUser extends BaseType {
  passWord?: string
  // 账户
  account: string
  // 昵称
  nickName: string
  // 邮箱
  email?: string
  // 状态 所属状态是否有效 1是有效 0是失效
  status: number
  // 头像
  avatar?: string
  // 部门id
  deptId: number
  // 手机号码
  phoneNum: string
}

export interface SysDept extends BaseType {
  parentId: number
  // 部门名称
  name?: string
  // 排序
  orderNum?: number
  children?: SysDept[]
  key?: string
}

export interface SysRole extends BaseType {
  // 备注
  remark: string
  // 名称
  roleName: string
}

export interface SysMenu extends BaseType {
  // 父级id 一级为0
  parentId: number
  // 菜单名称
  title: string
  // 菜单类型： 1. 目录 2. 菜单 3. 按钮
  type: number
  // 排序
  orderNum: number
  // 权限标识
  perms: string
  // 菜单标识
  name: string
  // 路径
  path: string
  // 组件地址
  component: string
  // 重定向地址
  redirect: string
  // 图标
  icon: string
  // 是否隐藏
  hidden: string
  // 是否首页
  isHome: string
  key?: string
}

export interface SysUserInfo {
  menus: SysMenu[]
  roles: SysRole[]
  userInfo: SysUser | any
}
