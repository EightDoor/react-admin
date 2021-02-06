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
}
