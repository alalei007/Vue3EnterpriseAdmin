export interface TableActionItem {
  label?: string
  tip?: string
  event: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  icon?: string
  size?: string
  hidden?: boolean // 控制隐藏
}
export interface TableRowData {
  id?: number | string
  [key: string]: number | string | undefined | object
}
