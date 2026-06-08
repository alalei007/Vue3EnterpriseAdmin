import request from './request'
import type {
  UserRole,
  UserRoleCreateQuery,
  UserRoleListQuery,
  UserRoleListRes,
} from '@/types/userRole'

// 获取角色列表
export function getRoleList(params: UserRoleListQuery): Promise<UserRoleListRes> {
  return request({
    url: '/userRole/list',
    params,
    method: 'get',
  })
}

// 新增角色
export function addRole(data: UserRoleCreateQuery): Promise<UserRole> {
  return request({
    url: '/userRole',
    method: 'post',
    data,
  })
}

// 编辑角色
export function updateRole(data: UserRoleCreateQuery): Promise<UserRole> {
  return request({
    url: '/userRole',
    method: 'put',
    data,
  })
}

// 删除角色
export function deleteRole(ids: number[]): Promise<void> {
  return request({
    url: '/userRole',
    method: 'delete',
    data: ids,
  })
}

// 修改状态
export function changeRoleStatus(id: number, status: number): Promise<void> {
  return request({
    url: '/userRole/status',
    method: 'put',
    data: { id, status },
  })
}

// 分配权限
export function assignPermission(
  roleId: number,
  menuIds: number[],
  btnIds: number[],
): Promise<void> {
  return request({
    url: '/userRole/permission',
    method: 'put',
    data: { roleId, menuIds, btnIds },
  })
}
// 获取角色权限树
export function getRolePermTree(roleId: number): Promise<UserRole> {
  return request({
    url: '/userRole/permission/tree',
    method: 'get',
    params: { roleId },
  })
}
