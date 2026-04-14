<template>
  <div class="inline-flex gap-1">
    <el-select
      v-model="searchTypeItem"
      @change="handleChange"
      :placeholder="placeholder || '请选择'"
      style="width: 140px"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item" />
    </el-select>
    <div>
      <el-select
        style="width: 140px"
        v-show="isSelect"
        v-model="searchValue"
        :placeholder="searchTypeItem?.placeholder || '请选择'"
      >
        <el-option
          v-for="o in searchTypeItem?.options"
          :key="o.value"
          :label="o.label"
          :value="o.value"
        />
      </el-select>
      <el-input
        style="width: 140px"
        v-show="isInput"
        v-model="searchValue"
        :placeholder="searchTypeItem?.placeholder || '请输入'"
      />
      <div v-show="isDateRange">
        <el-date-picker
          v-model="searchValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchInputType, type ChangeValueItem, type SelectOptionItem } from '@/types/tableSearch'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  options: SelectOptionItem[]
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'change', value: ChangeValueItem): void
}>()

const searchTypeItem = ref<SelectOptionItem | null>(props.options?.[0] ?? null)
const searchValue = ref('')

const isType = (type: SearchInputType) => {
  const item = searchTypeItem.value
  return item ? type === item.type : false
}
const isInput = computed(() => {
  return isType(SearchInputType.Input)
})

const isDateRange = computed(() => {
  return isType(SearchInputType.DateRange)
})

const isSelect = computed(() => {
  return isType(SearchInputType.Select)
})
function handleChange() {
  searchValue.value = ''
}
watch(searchValue, () => {
  if (searchValue.value && searchTypeItem.value) {
    emit('change', {
      type: searchTypeItem.value.id,
      value: searchValue.value,
    })
  }
})
</script>
