<template>
  <filter-bar :fields="fields" @change="queryChange"></filter-bar>
  <!-- 表格区域 -->
  <div class="mt-3">
    <base-table v-bind="tableProps"></base-table>
  </div>
</template>
<script lang="ts" setup>
import FilterBar from '@/components/FilterBar.vue'
import baseTable from '@/components/baseTable.vue'
import type { FilterBarQueryData } from '@/types/FilterBar'
import { reactive } from 'vue'

const COLUMNS = [
  { label: '角色ID', prop: 'id', width: 80 },
  { label: '角色名称', prop: 'roleName', width: 160 },
  { label: '角色编码', prop: 'roleCode', width: 160 },
  { label: '角色描述', prop: 'remark', width: 220 },
  { label: '状态', prop: 'status', width: 100 },
  { label: '创建时间', prop: 'createTime', width: 180 },
  { label: '操作', prop: 'action', width: 320, fixed: 'right' },
]
const tableProps = reactive({
  columns: COLUMNS,
  data: [],
  total: 0,
  Loading: true,
  currentPage: 1,
  showPagination: false,
})
const fields = [
  {
    label: '角色名称',
    id: 'roleName',
    type: 'checkbox',
    options: [
      { label: '系统管理员', value: 'admin' },
      { label: '测试账号', value: 'test' },
      { label: '运营经理', value: 'manager' },
    ],
  },
  {
    label: '状态',
    id: 'status',
    type: 'radio',
    options: [
      { label: '正常', value: 'normal' },
      { label: '禁用', value: 'disabled' },
    ],
  },
  { label: '角色描述', id: 'describe', type: 'input' },
  { label: '创建时间', id: 'createTime', type: 'date' },
]

const queryChange = (data: FilterBarQueryData) => {
  console.log(data)
}
</script>
