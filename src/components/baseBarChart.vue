<template>
  <div class="w-full h-full" ref="barChart"></div>
</template>
<script setup lang="ts">
import type { ECharts } from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  xData: string[]
  seriesData: number[]
  option?: Record<string, never>
}>()

let myChart: ECharts | null = null
const barChart = ref(null)
function drawChart() {
  if (!barChart.value) {
    return
  }
  if (!myChart) {
    myChart = echarts.init(barChart.value)
  }
  const baseOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: props.xData,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: props.seriesData,
      },
    ],
  }
  myChart.setOption({ ...baseOption, ...props.option })
}
function resizeChart() {
  myChart?.resize()
}
watch(
  () => [props.xData, props.seriesData, props.option],
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
