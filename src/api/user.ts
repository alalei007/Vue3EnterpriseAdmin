import type { LoginRes, RefreshTokenRes, UserInfoRes } from '@/types/user'
import { getRefreshToken, removeToken } from '@/utils/storage'
import request from './request'

export function login(username: string, password: string): Promise<LoginRes> {
  return request.post('/user/login', {
    username,
    password,
  })
}

export function getUserInfo(): Promise<UserInfoRes> {
  return request.get('/user/info')
}

export function refreshToken(): Promise<RefreshTokenRes> {
  const refreshToken = getRefreshToken()
  removeToken()
  return request.post('/refreshToken', refreshToken)
}
