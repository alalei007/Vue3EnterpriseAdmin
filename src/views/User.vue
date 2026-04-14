<template>
  <!-- 搜索栏 -->
  <div class="flex items-center gap-2 mb-3">
    <table-search :options="searchOptions" @change="handleSearch" />
    <table-action :actions="actionOptions" @click="handleActionClick" />
  </div>

  <!-- 表格区域 -->
  <div class="mt-3">
    <base-table v-bind="tableProps" @selection-change="handleSelection">
      <template #action="{ row }">
        <table-action
          :is-btn-group="true"
          :show-tip="true"
          :actions="getRowActions(row)"
          :row="row"
          @click="handleRowAction"
        />
      </template>
    </base-table>
  </div>

  <!-- 弹窗 -->
  <base-dialog v-model="dialog.visible" :title="dialog.title" width="500px">
    <!-- 纯文本提示 -->
    <template
      v-if="['delete', 'enable', 'disable', 'resetPassword'].includes(dialog.type)"
      #default
    >
      <div class="text-center py-4">
        {{ dialogTips[dialog.type] }}{{ dialog.rowData?.username }} 吗？
      </div>
    </template>

    <template v-else-if="dialog.type == 'batchDelete'" #default>
      <base-table v-bind="batchDeleteProps"> </base-table>
    </template>

    <!-- 编辑表单 -->
    <template v-else #default>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px" class="px-4">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="roleName">
          <el-select v-model="form.roleName" placeholder="请选择角色">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
            <el-option label="运营" value="运营" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
      <el-button @click="handleDialogCancel">取消</el-button>
    </template>
  </base-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { deleteUser, getUserList } from '@/api/userManage'
import TableAction from '@/components/TableAction.vue'
import TableSearch from '@/components/TableSearch.vue'
import BaseTable from '@/components/baseTable.vue'
import BaseDialog from '@/components/baseDialog.vue'
import type { TableActionItem, TableRowData } from '@/types/tableAction'
import { SearchInputType, type ChangeValueItem, type SelectOptionItem } from '@/types/tableSearch'
import type { UserItem } from '@/types/userManage'

// ==========================================
// 常量配置
// ==========================================
const ROLE_OPTIONS = ['管理员', '普通用户', '运营'] as const
const DIALOG_TIPS = {
  delete: '确定要删除用户',
  enable: '确定要启用用户',
  disable: '确定要禁用用户',
  resetPassword: '确定要重置用户',
  edit: '编辑用户',
}
const DIALOG_TITLE = {
  delete: '删除',
  batchDelete: '删除',
  enable: '启用',
  disable: '启用',
  resetPassword: '重置',
  edit: '编辑',
}

// ==========================================
// 搜索配置
// ==========================================
const searchOptions = ref<SelectOptionItem[]>([
  { label: '用户名', id: 'username', value: 'username', type: SearchInputType.Input },
  { label: '创建时间', id: 'createTime', value: 'createTime', type: SearchInputType.DateRange },
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
    options: ROLE_OPTIONS.map((item) => ({ label: item, value: item })),
  },
])

// ==========================================
// 顶部操作按钮
// ==========================================
const actionOptions = ref<TableActionItem[]>([
  { label: '新增', event: 'add', type: 'primary', hidden: false },
  { label: '删除', event: 'delete', type: 'danger', hidden: false },
  { label: '导出', event: 'export', type: 'default', hidden: false },
])

// ==========================================
// 表格配置
// ==========================================
const COLUMNS = [
  { label: '用户ID', prop: 'id', width: 80 },
  { label: '用户名', prop: 'username', width: 150 },
  { label: '昵称', prop: 'nickname', width: 150 },
  { label: '手机号', prop: 'phone', width: 150 },
  { label: '角色', prop: 'roleName', width: 120 },
  { label: '状态', prop: 'status', width: 100 },
  { label: '创建时间', prop: 'createTime', width: 180 },
]
const tableProps = reactive({
  columns: COLUMNS,
  showSelection: true,
  data: [] as UserItem[],
  total: 0,
  Loading: true,
  currentPage: 1,
  showPagination: false,
})

const batchDeleteProps = reactive({
  columns: COLUMNS,
  data: [] as UserItem[],
  showPagination: false,
})

// ==========================================
// 表单
// ==========================================
const formRef = ref()
const form = reactive({
  username: '',
  nickname: '',
  phone: '',
  roleName: '',
})

const formRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  roleName: [{ required: true, message: '请选择角色', trigger: 'change' }],
})

// ==========================================
// 弹窗状态
// ==========================================
const dialog = reactive({
  visible: false,
  title: '',
  type: '',
  rowData: null as UserItem | null,
})
const dialogTips = DIALOG_TIPS

// ==========================================
// 行操作按钮
// ==========================================
function getRowActions(row: TableRowData): TableActionItem[] {
  return [
    { tip: '编辑', event: 'edit', icon: 'Edit', size: 'small', type: 'primary', hidden: false },
    {
      tip: '重置密码',
      event: 'resetPassword',
      icon: 'Refresh',
      size: 'small',
      type: 'primary',
      hidden: false,
    },
    {
      tip: '启用',
      event: 'enable',
      icon: 'Unlock',
      size: 'small',
      type: 'primary',
      hidden: row.status !== '禁用',
    },
    {
      tip: '禁用',
      event: 'disable',
      icon: 'Lock',
      size: 'small',
      type: 'primary',
      hidden: row.status === '禁用',
    },
    { tip: '删除', event: 'delete', icon: 'Delete', size: 'small', type: 'danger', hidden: false },
  ]
}

// ==========================================
// 数据获取
// ==========================================
async function fetchUserList() {
  try {
    tableProps.Loading = true
    const { data } = await getUserList()
    tableProps.data = data.list
    tableProps.total = data.total
  } catch (err) {
    console.error('获取用户列表失败', err)
  } finally {
    tableProps.Loading = false
  }
}

// ==========================================
// 事件处理
// ==========================================
function handleSearch(data: ChangeValueItem) {
  console.log('搜索条件：', data)

  // 后续可对接分页/筛选
}

function handleSelection(datas: TableRowData[]) {
  const arr = datas.map((item) => {
    return { ...item }
  })
  console.log(datas, arr, 'ffffffffffffffffe')
  Object.assign(batchDeleteProps.data, arr)
}
function handleActionClick(event: string) {
  console.log(event, 'eee')
  if (event === 'add') {
    openDialog('add')
  } else if (event === 'delete') {
    if (batchDeleteProps.data.length) {
      openDialog('batchDelete')
    }
  }
}

function handleRowAction(event: string, row: UserItem) {
  dialog.rowData = row
  openDialog(event)
}

// 打开弹窗
function openDialog(type: string) {
  console.log(type, 'fff')
  dialog.type = type
  dialog.title = DIALOG_TITLE[type as keyof typeof DIALOG_TIPS]
  dialog.visible = true

  if (type === 'edit' && dialog.rowData) {
    form.username = dialog.rowData.username
    form.nickname = dialog.rowData.nickname
    form.phone = dialog.rowData.phone
    form.roleName = dialog.rowData.roleName
  }
}

// 确定
async function handleDialogConfirm() {
  const { type, rowData } = dialog

  if (type === 'edit') {
    const valid = await formRef.value?.validate()
    if (!valid) return
  }

  if (type === 'delete' && rowData) {
    await deleteUser(rowData.id)
    ElMessage.success('删除成功')
  }
  if (type === 'batchDelete' && batchDeleteProps.data.length) {
    const ids = batchDeleteProps.data.map((item) => item.id).toString()
    await deleteUser(ids)
    ElMessage.success('删除成功')
  }

  if (type === 'resetPassword') {
    ElMessage.success('密码已重置')
  }

  if (type === 'enable' || type === 'disable') {
    ElMessage.success('操作成功')
  }

  dialog.visible = false
  fetchUserList() // 刷新列表
}

// 取消
function handleDialogCancel() {
  dialog.visible = false
  formRef.value?.clearValidate()
}

// ==========================================
// 生命周期
// ==========================================
onMounted(() => {
  fetchUserList()
})
</script>
