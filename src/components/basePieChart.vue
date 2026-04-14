<template>
  <div class="w-full h-full" ref="pieChart"></div>
</template>
<script setup lang="ts">
import type { ECharts } from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { PieItem } from '@/types/dashboard'

const props = defineProps<{
  data: PieItem[]
  option?: Record<string, never>
}>()

let myChart: ECharts | null = null
const pieChart = ref(null)
function drawChart() {
  if (!pieChart.value) {
    return
  }
  if (!myChart) {
    myChart = echarts.init(pieChart.value)
  }
  const baseOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: props.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  myChart.setOption({ ...baseOption, ...props.option })
}
function resizeChart() {
  myChart?.resize()
}
watch(
  () => [props.data, props.option],
  () => {
    drawChart()
  },
  { deep: true },
)
onMounted(() => {
  drawChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  window.removeEventListener('resize', resizeChart)
})
</script>
