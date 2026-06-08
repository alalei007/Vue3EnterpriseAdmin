<template>
  <div class="flex items-center gap-2">
    <table-search :options="searchOptions" @change="search"></table-search>
    <table-action :actions="actionOptions" @click="handleClick"></table-action>
  </div>
  <div class="mt-3" ref="a">
    <base-table v-bind="tablOptions">
      <template #action="{ row }">
        <table-action
          :is-btn-group="true"
          :show-tip="true"
          :actions="getRowAction(row)"
          :row="row"
          @click="handleRowClick"
        ></table-action>
      </template>
    </base-table>
  </div>
  <base-dialog :title="dialogConfig.title" v-model="dialogConfig.isOpen" style="width: 500px">
    <template #default>
      <div v-show="dialogConfig.type == 'delete'">
        确定要删除用户{{ dialogConfig.rowData?.username }}吗？
      </div>
      <div v-show="dialogConfig.type == 'enable'">
        确定要启用用户{{ dialogConfig.rowData?.username }}吗？
      </div>
      <div v-show="dialogConfig.type == 'disable'">
        确定要禁用用户{{ dialogConfig.rowData?.username }}吗？
      </div>
      <div v-if="dialogConfig.type == 'resetPassword'">
        确定要重置用户{{ dialogConfig.rowData?.username }}密码吗？
      </div>
      <div v-show="dialogConfig.type == 'edit'" class="px-8">
        <el-form :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="角色" prop="roleName">
            <el-select v-model="form.roleName" placeholder="请选择">
              <el-option label="管理员" value="管理员" />
              <el-option label="普通用户" value="普通用户" />
              <el-option label="运营" value="运营" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <el-button type="primary" @click="hancleDialogClick('confirm')">确定</el-button>
      <el-button @click="hancleDialogClick('cancel')">取消</el-button>
    </template>
  </base-dialog>
</template>
<script setup lang="ts">
import { deleteUser, getUserList } from '@/api/userManage'
import TableAction from '@/components/TableAction.vue'
import TableSearch from '@/components/TableSearch.vue'
import baseTable from '@/components/baseTable.vue'
import baseDialog from '@/components/baseDialog.vue'
import { type TableActionItem, type TableRowData } from '@/types/tableAction'
import { SearchInputType, type SelectOptionItem } from '@/types/tableSearch'
import type { UserItem } from '@/types/userManage'
import { defineComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
defineComponent({
  name: 'AppUser1',
})
const searchOptions = ref<SelectOptionItem[]>([
  {
    label: '用户名',
    id: 'username',
    value: 'username',
    type: SearchInputType.Input,
  },
  {
    label: '创建时间',
    id: 'createTime',
    value: 'createTime',
    type: SearchInputType.DateRange,
  },
  {
    label: '状态',
    id: 'status',
    value: 'status',
    type: SearchInputType.Select,
    options: [
      { label: '正常', value: '正常' },
      { label: '禁用', value: '禁用' },
    ],
  },
  {
    label: '角色',
    id: 'roleName',
    value: 'roleName',
    type: SearchInputType.Select,
    options: [
      { label: '管理员', value: '管理员' },
      { label: '普通用户', value: '普通用户' },
      { label: '运营', value: '运营' },
    ],
  },
])
const actionOptions = ref<TableActionItem[]>([
  {
    label: '新增',
    event: 'add',
    type: 'primary',
    hidden: false,
  },
  {
    label: '删除',
    event: 'delete',
    type: 'danger',
    hidden: false,
  },
  {
    label: '导出',
    event: 'export',
    type: 'default',
    hidden: false,
  },
])

function getRowAction(row: TableRowData): TableActionItem[] {
  return [
    {
      tip: '编辑',
      event: 'edit',
      icon: 'Edit',
      size: 'small',
      type: 'primary',
      hidden: false,
    },
    {
      tip: '重置密码',
      icon: 'Refresh',
      size: 'small',
      event: 'resetPassword',
      type: 'primary',
      hidden: false,
    },
    {
      tip: '启用',
      icon: 'Unlock',
      size: 'small',
      event: 'enable',
      type: 'primary',
      hidden: row.status !== '禁用',
    },
    {
      tip: '禁用',
      icon: 'Lock',
      size: 'small',
      event: 'disable',
      type: 'primary',
      hidden: row.status === '禁用',
    },
    {
      tip: '删除',
      icon: 'Delete',
      size: 'small',
      event: 'delete',
      type: 'danger',
      hidden: false,
    },
  ]
}

function search() {}

function handleClick(type: string) {
  console.log(type, 'tttt')
}

const tablOptions = reactive({
  columns: [
    { label: '用户ID', prop: 'id', width: 80 },
    { label: '用户名', prop: 'username', width: 150 },
    { label: '昵称', prop: 'nickname', width: 150 },
    { label: '手机号', prop: 'phone', width: 150 },
    { label: '角色', prop: 'roleName', width: 120 },
    { label: '状态', prop: 'status', width: 100 },
    { label: '创建时间', prop: 'createTime', width: 180 },
  ],
  data: [] as UserItem[],
  total: 0,
  Loading: true,
  currentPage: 1,
  showPagination: false,
})
const form = reactive({
  username: '',
  nickname: '',
  phone: '',
  roleName: '',
})
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话号', trigger: 'blur' }],
  roleName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
})
const dialogConfig = reactive({
  title: '',
  isOpen: false,
  rowData: {} as UserItem,
  type: '',
})
async function hancleDialogClick(type: string) {
  if (type == 'confirm') {
    if (dialogConfig.type === 'delete') {
      await deleteUser(dialogConfig.rowData.id)
    }
    dialogConfig.isOpen = false
  } else if (type == 'cancel') {
    dialogConfig.isOpen = false
  }
}
function handleRowClick(type: string, row: UserItem) {
  const titleMap = {
    delete: '删除',
    enable: '使能',
    disable: '禁用',
    edit: '编辑',
    resetPassword: '重置密码',
  }
  dialogConfig.title = titleMap[type as keyof typeof titleMap]
  dialogConfig.isOpen = true
  dialogConfig.type = type
  dialogConfig.rowData = row

  if (type == 'edit') {
    form.username = dialogConfig.rowData.username
    form.nickname = dialogConfig.rowData.nickname
    form.phone = dialogConfig.rowData.phone
    form.roleName = dialogConfig.rowData.roleName
  }
}
async function getUser() {
  const res = await getUserList()
  const data = res.data
  tablOptions.data = data.list
  tablOptions.Loading = false
  tablOptions.total = data.total
}
const a = ref(null)
onBeforeMount(() => {
  console.log(a.value)
})
onMounted(async () => {
  console.log(a.value)
  getUser()
})
</script>
