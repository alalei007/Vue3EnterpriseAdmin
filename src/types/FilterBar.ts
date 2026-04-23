export interface optionItem {
  label: string
  value: string
}
export interface FilterField {
  label: string
  id: string
  type: string
  options?: optionItem[]
}
export interface FilterBarQueryData {
  id: string
  data: string[]
}
