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
        @click="handleClick(item.event || '', row)"
        >{{ item?.label }}</el-button
      ></el-tooltip
    >
  </component>
</template>

<script setup lang="ts" generic="T extends TableRowData">
import type { TableActionItem, TableRowData } from '@/types/tableAction'
import { ElButtonGroup } from 'element-plus'

const props = defineProps<{
  actions: TableActionItem[]
  isBtnGroup?: boolean
  showTip?: boolean
  row?: T
}>()
const emit = defineEmits<{
  (e: 'click', type: string, row?: T): void
}>()
function handleClick(type: string, row: T | undefined) {
  emit('click', type, row)
}
</script>
