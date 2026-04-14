<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ props.title }}</span>
      </div>
    </template>
    <div>
      {{ props.value }}
    </div>
  </el-card>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    require: true,
    default: '',
  },
  value: {
    type: [String, Number],
    require: true,
    default: 0,
  },
})
</script>
