<template>
  <filter-bar :fields="fields" @change="queryChange"></filter-bar>
  <div class="mt-3">
    <base-table v-bind="tableProps">
      <template #action="{ row }">
        <table-action
          :is-btn-group="true"
          :show-tip="false"
          :actions="actions"
          :row="row"
          @click="handleRowAction"
        />
      </template>
    </base-table>
  </div>
</template>
<script lang="ts" setup>
import TableAction from '@/components/TableAction.vue'
import { getRoleList } from '@/api/userRole'
import FilterBar from '@/components/FilterBar.vue'
import BaseTable from '@/components/baseTable.vue'
import type { FilterBarQueryData } from '@/types/FilterBar'
import type { UserRole, UserRoleListRes } from '@/types/userRole'
import { onMounted, reactive } from 'vue'
import type { TableActionItem } from '@/types/tableAction'

const COLUMNS = [
  { label: '角色ID', prop: 'id', width: 80 },
  { label: '角色名称', prop: 'roleName', width: 160 },
  { label: '角色编码', prop: 'roleCode', width: 160 },
  { label: '角色描述', prop: 'description', width: 220 },
  { label: '状态', prop: 'status', width: 100 },
  { label: '创建时间', prop: 'createTime', width: 180 },
]
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

const queryChange = (data: FilterBarQueryData[]) => {
  console.log(data)
}

const tableProps = reactive({
  columns: COLUMNS,
  data: [] as UserRole[],
  total: 0,
  loading: true,
  currentPage: 1,
  showPagination: false,
})

const actions: TableActionItem[] = [
  { tip: '编辑', event: 'edit', icon: 'Edit', size: 'small', type: 'primary', hidden: false },
  { tip: '删除', event: 'delete', icon: 'Delete', size: 'small', type: 'danger', hidden: false },
]

const handleRowAction = (event: string, row: UserRole) => {
  if (event === 'edit') {
    editRole(row)
  } else if (event === 'delete') {
    deleteRole(row)
  }
}

const editRole = (userRole: UserRole) => {
  console.log(userRole)
}

const deleteRole = (userRole: UserRole) => {
  console.log(userRole)
}

onMounted(() => {
  // 初始化查询
  queryChange([])
  // 初始化表格数据
  tableProps.data = []
  tableProps.total = 0
  tableProps.loading = false
  tableProps.currentPage = 1
  tableProps.showPagination = false
  // 查询角色列表
  getRoleList({ pageNum: 1, pageSize: 10 }).then((res: UserRoleListRes) => {
    if (res.code === 200) {
      tableProps.data = res.data.list
      tableProps.total = res.data.total
      tableProps.loading = false
    }
  })
})
</script>
