export interface TableActionItem {
  label?: string
  tip?: string
  event: string
  type?: BtnType
  icon?: string
  size?: string
  hidden?: boolean // 控制隐藏
}
type BtnType = 'primary' | 'success' | 'warning' | 'danger' | 'default'
export interface TableRowData {
  id?: number | string
  [key: string]: number | string | undefined | object
}
