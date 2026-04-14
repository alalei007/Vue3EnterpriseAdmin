<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const props = defineProps({
  xData: {
    type: Array,
    default: () => [],
  },
  seriesData: {
    type: Array,
    default: () => [],
  },
  option: {
    type: Object,
    default: () => {},
  },
})
const chartRef = ref(null)
let myChart: ECharts | null = null
function drawChart() {
  if (!chartRef.value) {
    return
  }
  if (!myChart) {
    myChart = echarts.init(chartRef.value)
  }
  const baseOption = {
    xAxis: {
      type: 'category',
      data: props.xData,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: props.seriesData,
        type: 'line',
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
