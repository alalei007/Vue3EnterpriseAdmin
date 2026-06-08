import request from './request'
import type { UserDetailRes, UserForm, UserListRes, UserQueryParams } from '@/types/userManage'

export function getUserList(): Promise<UserListRes> {
  return request.get('/user/list')
}

/**
 * 1. 获取用户分页列表
 * @param params 查询条件
 */
export function getUserPageList(params: UserQueryParams): Promise<UserListRes> {
  return request({
    url: '/system/user/list',
    method: 'get',
    params,
  })
}

/**
 * 2. 获取单个用户详情
 * @param id 用户ID
 */
export function getUserDetail(id: number | string): Promise<UserDetailRes> {
  return request({
    url: `/system/user/${id}`,
    method: 'get',
  })
}

/**
 * 3. 新增用户
 * @param data 用户表单数据
 */
export function addUser(data: UserForm): Promise<UserDetailRes> {
  return request({
    url: '/system/user',
    method: 'post',
    data,
  })
}

/**
 * 4. 编辑用户
 * @param data 用户表单数据
 */
export function updateUser(data: UserForm): Promise<UserDetailRes> {
  return request({
    url: '/system/user',
    method: 'put',
    data,
  })
}

/**
 * 5. 删除用户（支持批量）
 * @param ids 用户ID，多个用逗号分隔
 */
export function deleteUser(ids: number | string) {
  return request({
    url: `/system/user/${ids}`,
    method: 'delete',
  })
}

/**
 * 6. 修改用户状态
 * @param id 用户ID
 * @param status 状态 0/1
 */
export function changeUserStatus(id: number | string, status: number): Promise<UserDetailRes> {
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: { id, status },
  })
}

/**
 * 7. 重置密码
 * @param id 用户ID
 * @param password 新密码
 */
export function resetUserPwd(id: number | string, password: string): Promise<UserDetailRes> {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: { id, password },
  })
}

/**
 * 8. 导出用户Excel
 * @param params 查询条件
 */
export function exportUser(params: UserQueryParams) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
}
