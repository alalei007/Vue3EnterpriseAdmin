import type { ApiResponse } from './api'

// 用户角色接口
export interface UserRole {
  id: number
  name: string
  code: string
  description: string
  status: number
  createTime: string
  permissions: string[]
}
// 用户角色列表查询参数
export interface UserRoleListQuery {
  pageNum: number
  pageSize: number
}
// 用户角色列表查询结果
export interface UserRoleListResult {
  list: UserRole[]
  total: number
  pageNum: number
  pageSize: number
}
// 用户角色创建参数
export interface UserRoleCreateQuery {
  name: string
  code: string
  description: string
  status: number
}
// 用户角色列表接口返回异步结果
export type UserRoleListRes = ApiResponse<UserRoleListResult>
