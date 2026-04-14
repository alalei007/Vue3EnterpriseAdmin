<template>
  <component :is="isBtnGroup ? ElButtonGroup : 'div'">
    <el-tooltip
      v-for="item in props.actions"
      :key="item.label"
      :disabled="!showTip"
      :content="item.tip"
      placement="top"
      effect="light"
      ><el-button
        :type="item.type"
        :icon="item.icon"
        :hidden="item.hidden"
        :size="item.size || 'default'"
        @click="handleClick(item.event || '', row ? row : {})"
        >{{ item.label }}</el-button
      ></el-tooltip
    >
  </component>
</template>

<script setup lang="ts">
import type { TableActionItem, TableRowData } from '@/types/tableAction'
import { ElButtonGroup } from 'element-plus'

const props = defineProps<{
  actions: TableActionItem[]
  isBtnGroup?: boolean
  showTip?: boolean
  row?: TableRowData
}>()
const emit = defineEmits<{
  (e: 'click', type: string, row?: TableRowData): void
}>()
function handleClick(type: string, row: TableRowData) {
  emit('click', type, row)
}
</script>
