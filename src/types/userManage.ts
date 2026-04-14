import type { ApiResponse } from './api'

/**
 * 用户查询参数类型
 */
export interface UserQueryParams {
  username?: string
  nickname?: string
  phone?: string
  status?: string | number
  roleId?: string | number
  createTime?: string[]
  pageNum: number
  pageSize: number
}

/**
 * 用户列表单项类型
 */
export interface UserItem {
  id: number | string
  username: string
  nickname: string
  phone: string
  roleId: number | string
  roleName: string
  status: 0 | 1 | '正常' | '禁用'
  createTime: string
}

/**
 * 新增/编辑用户参数类型
 */
export interface UserForm {
  id?: number | string
  username: string
  password?: string
  nickname: string
  phone: string
  roleId: number | string
  status: 0 | 1
}

export interface UserListData {
  list: UserItem[]
  total: number
  pageNum: number
  pageSize: number
}

export type UserListRes = ApiResponse<UserListData>

export type UserDetailRes = ApiResponse<UserItem>
