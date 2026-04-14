<!-- 基础表格组件
 props: 
    columns: 表格列配置
    data: 表格数据
    total: 数据总条数
    loading: 是否加载中
    currentPage: 当前页
    pageSize: 每页条数
    showPagination: 是否展示分页
 events:
    current-change(page)
    size-change(size)
 功能：
    支持空数据和加载中状态显示
    支持操作列，通过插槽传入操作按钮
    支持分页配置与事件
使用方法：
    <BaseTable
      :columns="columns"
      :data="tableData"
      :total="total"
      :loading="loading"
      :current-page="currentPage"
      :page-size="pageSize"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template #action="{ row }">
        <el-button type="primary" @click="editRow(row)">编辑</el-button>
        <el-button type="danger" @click="deleteRow(row)">删除</el-button>
      </template>
    </BaseTable>
-->
<template>
  <div class="base-table-wrapper">
    <el-table
      ref="tableRef"
      :data="props.data || []"
      :empty-text="!props.loading && (props.data || []).length === 0 ? '暂无数据' : ''"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="showSelection" type="selection" width="55" align="center" />
      <el-table-column
        v-for="column in props.columns"
        :key="column.prop || column.label"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :fixed="column.fixed || false"
        :align="column.align || 'left'"
      />

      <el-table-column v-if="$slots.action" label="操作" fixed="right">
        <template #default="scope">
          <slot ref="slotRef" name="action" :row="scope.row" :index="scope.$index" />
        </template>
      </el-table-column>
    </el-table>

    <div v-if="props.loading" class="table-loading-overlay">
      <el-icon class="is-loading" :size="32">
        <Loading />
      </el-icon>
      <span>加载中...</span>
    </div>
    <el-pagination
      v-if="props.showPagination"
      background
      :current-page="props.currentPage"
      :page-size="props.pageSize"
      :total="props.total"
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 50, 100]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style scoped>
.base-table-wrapper {
  /* position: relative; */
}
.table-pagination {
  margin-top: 16px;
  text-align: right;
}
.table-loading-overlay {
  position: absolute;
  top: 48px; /* 表头高度 */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>
<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { onMounted, type PropType, ref, watch } from 'vue'

type TableColumn = {
  prop?: string
  label: string
  width?: string | number
  fixed?: string | boolean
  align?: 'left' | 'center' | 'right'
}

type TableRow = Record<string, unknown>

const props = defineProps({
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => [],
  },
  showSelection: {
    type: Boolean,
    default: () => false,
  },
  data: {
    type: Array as PropType<TableRow[]>,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'current-change', page: number): void
  (e: 'size-change', size: number): void
  (e: 'selection-change', val: TableRow[]): void
}>()

const handleCurrentChange = (page: number) => {
  emit('current-change', page)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

const handleSelectionChange = (val: TableRow[]) => {
  console.log(val, 'selection-change')
  emit('selection-change', val)
}

const tableRef = ref(null)
const slotRef = ref(null)
let containerWidth = 0
let contentWidth = 0
onMounted(() => {
  if (tableRef.value && slotRef.value) {
    containerWidth = tableRef.value.offsetWidth
    contentWidth = slotRef.value.offsetWidth
    console.log('ff')
  }
})
watch(slotRef, (newWidth) => {
  contentWidth = newWidth.offsetWidth
  if (tableRef.value) {
    containerWidth = tableRef.value.offsetWidth
    console.log('a')
    if (contentWidth > containerWidth) {
      console.log('插槽内容宽度超出容器宽度')
    }
  }
})
</script>
