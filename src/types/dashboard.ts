import type { ApiResponse } from './api'

/**
 * 仪表盘概览卡片数据类型
 * @description 用于首页顶部数字统计卡片
 */
export interface DashboardCard {
  /** 卡片标题 */
  title: string
  /** 卡片显示数值 */
  value: string | number
}

/**
 * 饼图单条数据类型
 */
export interface PieItem {
  name: string
  value: number
}

/**
 * 折线图数据类型
 */
export interface LineChartData {
  dateList: string[]
  valueList: number[]
}

/**
 * 柱状图数据类型
 */
export interface BarChartData {
  categoryList: string[]
  salesList: number[]
}

/**
 * 仪表盘完整数据结构
 */
export interface DashboardData {
  /** 顶部统计卡片 */
  cards: DashboardCard[]
  /** 折线图 */
  lineData: LineChartData
  /** 饼图 */
  pieData: PieItem[]
  /** 柱状图 */
  barData: BarChartData
  /** 日志 */
  logs: OperateLogItem[]
}

/**
 * 仪表盘接口返回类型
 */
export type DashboardRes = ApiResponse<DashboardData>

// 操作日志项类型
export interface OperateLogItem {
  id?: number | string
  user: string // 操作用户
  action: string // 操作内容
  module: string // 操作模块
  time: string // 操作时间
  status: '成功' | '失败' // 状态
  ip?: string // 可选IP
}
