<template>
  <el-dialog
    v-model="model"
    :title="title"
    :fullscreen="isFullscreen"
    :show-close="false"
    destroy-on-close
    @close="handleClose"
  >
    <template #header="{ close }">
      <div class="flex items-center justify-between">
        <span class="text-base font-semibold">{{ title }}</span>
        <div class="flex items-center gap-2">
          <el-icon
            v-if="enableFullscreenButton"
            class="cursor-pointer"
            @click="toggleFullscreen"
            aria-label="Toggle fullscreen"
          >
            <FullScreen />
          </el-icon>
          <el-icon class="cursor-pointer" @click="close" aria-label="Close dialog">
            <Close />
          </el-icon>
        </div>
      </div>
    </template>

    <slot />

    <template v-if="$slots.footer">
      <div class="flex justify-end gap-2 mt-4">
        <slot name="footer" />
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, toRef } from 'vue'
import { Close, FullScreen } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  enableFullscreenButton: {
    type: Boolean,
    default: false,
  },
})
const model = defineModel({
  type: Boolean,
  required: true,
})

const emit = defineEmits(['close', 'open'])

const title = toRef(props, 'title')

const isFullscreen = ref(false)

watch(model, (value) => {
  if (value) {
    isFullscreen.value = false
    emit('open')
  }
})

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const handleClose = () => {
  model.value = false
  emit('close')
}
</script>
