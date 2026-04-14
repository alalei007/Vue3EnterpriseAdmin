<template>
  <el-button
    v-bind="buttonAttrs"
    :loading="isClicking"
    @click="handleClick"
    :disabled="props.disabled"
  >
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, useAttrs } from 'vue'

defineOptions({
  name: 'BaseButton',
})

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  debounceDelay: {
    type: Number,
    default: 200,
  },
})

const attrs = useAttrs()
const buttonAttrs = computed(() => {
  const result: Record<string, unknown> = {}
  for (const key in attrs) {
    if (!key.startsWith('on')) {
      result[key] = attrs[key]
    }
  }
  return result
})

let timer: number | null = null
const isClicking = ref(false)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  isClicking.value = true
  clearTimeout(timer!)
  timer = window.setTimeout(() => {
    emit('click', event)
    isClicking.value = false
  }, props.debounceDelay)
}

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<style scoped>
/* Add any scoped styles if needed */
</style>
