export interface SelectOptionItem {
  label: string
  id: string
  value: string
  type: SearchInputType
  options?: OptionItem[]
  placeholder?: string
}

export interface OptionItem {
  label: string
  value: string | number
}

export enum SearchInputType {
  Input = 'input',
  Select = 'select',
  DateRange = 'DateRange',
}

export interface ChangeValueItem {
  type: string
  value: string
}
