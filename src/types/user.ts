import type { ApiResponse } from './api'

// src/types/user.ts
export interface UserInfo {
  userId: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: 0 | 1
  createTime: string
}

export interface userInfoData {
  userInfo: UserInfo
  roles: string[]
  menus: MenuObj[]
}
export type UserInfoRes = ApiResponse<userInfoData>

export interface MenuObj {
  path: string
  name: string
  title: string
  icon?: string
  children?: MenuObj[]
  roles?: string[]
}

export interface LoginData {
  token: string
  refreshToken: string
}
export type LoginRes = ApiResponse<LoginData>

export interface RefreshTokenData {
  token: string
  refreshToken: string
}

export type RefreshTokenRes = ApiResponse<RefreshTokenData>
