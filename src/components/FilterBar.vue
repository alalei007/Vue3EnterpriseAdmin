<template>
  <el-input-tag
    ref="inputTagRef"
    v-model="tagList"
    placeholder="添加筛选条件"
    aria-label="输入后请按回车键"
    @click.stop="showDropdownCard"
    @add-tag="addTag"
  >
    <template #tag="{ value, index }">
      <div class="flex items-center" :ref="getTagRef(index)" @click="tagClick(value, index)">
        <span>{{ value }}</span>
      </div>
    </template>
  </el-input-tag>

  <el-dropdown
    ref="dropdownRef"
    :show-arrow="false"
    virtual-triggering
    trigger="click"
    placement="bottom-start"
    :virtual-ref="triggerDropdownRef"
    :hide-on-click="false"
  >
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in firstList"
          :key="item.label"
          @click.stop="firstItemClick(item)"
          >{{ item.label }}</el-dropdown-item
        >

        <el-dropdown-item v-for="(item, index) in seconList" :key="item.label">
          <template v-if="secondType === 'radio'">
            <el-radio v-model="radio" :value="item.value" :label="item.label"></el-radio>
          </template>
          <template v-if="secondType === 'checkbox'">
            <el-checkbox v-model="checkList[index]" :value="item.value" :label="item.label" />
          </template>
        </el-dropdown-item>

        <el-dropdown-item v-if="seconList.length" class="border-t" style="border-color: #dcdfe6">
          <div class="flex flex-end pd-3">
            <el-button @click="handleSelectCancel()">取消</el-button>
            <el-button @click="handleSelectConfirm()" type="primary" class="ml-2">确定</el-button>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import type { FilterField, optionItem, FilterBarQueryData } from '@/types/FilterBar'
import { type DropdownInstance, type InputTagInstance, type TagInstance } from 'element-plus'
import { cloneDeep } from 'lodash'
import { ref } from 'vue'

const props = defineProps<{
  fields: FilterField[]
}>()
const emit = defineEmits<{
  (e: 'change', data: FilterBarQueryData[]): void
}>()

const triggerPosition = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect)
const triggerDropdownRef = ref({
  getBoundingClientRect: () => triggerPosition.value,
})

const inputTagRef = ref<InputTagInstance>()
const dropdownRef = ref<DropdownInstance>()

const tagList = ref<string[]>([])
const firstList = ref<FilterField[]>([])
const seconList = ref<optionItem[]>([])

const showDropdownCard = () => {
  seconList.value = []
  firstList.value = cloneDeep(props.fields)

  const inputEl = inputTagRef.value?.$el.querySelector('.el-input-tag__input')
  if (!inputEl) return

  const { scrollX, scrollY } = window

  triggerPosition.value = DOMRect.fromRect({
    x: inputEl.getBoundingClientRect().left + scrollX,
    y: inputEl.getBoundingClientRect().top + scrollY + 20,
  })
  dropdownRef.value?.handleOpen()
}

const currentInput = ref('')
const secondType = ref<string>()
const radio = ref<string>()
const checkList = ref<boolean[]>([])

// el-input-tag中已输入的内容
const inputedMap: Map<string, string[]> = new Map()
const firstItemClick = (item: FilterField) => {
  // 清空和赋值
  firstList.value = []
  radio.value = ''
  checkList.value = []
  secondType.value = item.type

  currentInput.value = `${item.label}:`
  simulateInput()
  if (item.type === 'input') {
    inputTagRef.value?.focus()
    dropdownRef.value?.handleClose()
  } else if (['checkbox', 'radio'].includes(item.type)) {
    if (!item.options) return
    const selectedValues = inputedMap.get(item.label) || []
    seconList.value = item.options.map((o) => {
      return { ...o }
    })
    if (item.type === 'checkbox') {
      checkList.value = item.options.map((o) => selectedValues.includes(o.value))
    } else if (item.type === 'radio') {
      radio.value = selectedValues[0] || ''
    }
  }
}

const handleSelectConfirm = () => {
  const label = currentInput.value.slice(0, -1)
  let arr: optionItem[] = []
  if (secondType.value === 'checkbox') {
    arr = seconList.value.filter((_, index) => checkList.value[index])
  } else if (secondType.value === 'radio') {
    if (radio.value) {
      arr = seconList.value.filter((item) => item.value === radio.value)
    }
  }

  inputedMap.set(
    label,
    arr.map((item) => item.value),
  )

  const newTags: string[] = []
  arr.forEach((item) => {
    const tag = `${label}:${item.label}`
    newTags.push(tag)
  })
  tagList.value = tagList.value.filter((tag) => {
    const [oldLabel] = tag.split(':')
    return label !== oldLabel
  })
  tagList.value.push(...newTags)

  currentInput.value = ''
  simulateInput()

  dropdownRef.value?.handleClose()
}
const handleSelectCancel = () => {
  currentInput.value = ''
  simulateInput()
  dropdownRef.value?.handleClose()
}

const addTag = (tag: string) => {
  if (!secondType.value) {
    tagList.value = tagList.value.filter((s) => s !== tag)
  }
  if (secondType.value === 'input') {
    const label = currentInput.value.slice(0, -1)
    if (inputedMap.get(label)) {
      tagList.value = tagList.value.filter((tag) => {
        const [oldLabel] = tag.split(':')
        return label !== oldLabel
      })
      tagList.value.push(tag)
    }
    inputedMap.set(label, [tag])
  }

  const queryDataArr: FilterBarQueryData[] = []
  tagList.value.forEach((s) => {
    const [label, tag] = s.split(':')
    const values = label && inputedMap.get(label)
    if (label && tag && values) {
      queryDataArr.push({ id: label, data: values })
    }
  })
  emit('change', queryDataArr)
}

const tagRefs = ref<Array<TagInstance | null>>(Array(tagList.value.length).fill(null))
const getTagRef = (index: number) => {
  return (el: TagInstance) => {
    tagRefs.value[index] = el
  }
}

const tagClick = (tag: string, i: number) => {
  // const eleRef = getTagRef(i)
  // const { scrollX, scrollY } = window
  // triggerPosition.value = DOMRect.fromRect({
  //   x: eleRef.getBoundingClientRect().left + scrollX,
  //   y: eleRef.getBoundingClientRect().top + scrollY + 20,
  // })
}
async function simulateInput() {
  if (!inputTagRef.value) return

  // 1. 拿到内部原生 input
  const nativeInput = inputTagRef.value.$el.querySelector('input') as HTMLInputElement
  if (!nativeInput) return

  // 2. 模拟输入文本（必须用原生 setter 才能触发响应）
  const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
  proto?.set?.call(nativeInput, currentInput.value)

  // 3. 触发 input 事件（让组件感知到值变化）
  nativeInput.dispatchEvent(new Event('input', { bubbles: true }))

  // // 4. 等待 DOM 更新 → 模拟回车（生成标签）
  // await nextTick()
  // nativeInput.dispatchEvent(
  //   new KeyboardEvent('keyup', {
  //     key: 'Enter',
  //     code: 'Enter',
  //     bubbles: true,
  //   }),
  // )
}

// 工具函数
</script>
