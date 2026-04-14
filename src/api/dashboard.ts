import type { DashboardRes } from '@/types/dashboard'
import request from './request'

export function getDashboardData(): Promise<DashboardRes> {
  return request.get('/dashboard/info')
}
