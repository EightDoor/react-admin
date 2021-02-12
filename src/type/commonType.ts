import { AxiosResponse } from 'axios'

// 基础结构
export interface BaseType {
  id: string
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}

// 表格返回
export type TableResult<T = any> = AxiosResponse<Result<T>>

interface Result<T> {
  count: number
  page: number
  pageCount: number
  total: number
  data: T[]
}

// 表单
export interface CommonFormType<T = any> {
  show: (val: CommonFormTypeShow, data?: T) => void
}

export type CommonFormTypeShow = 'add' | 'edit'
