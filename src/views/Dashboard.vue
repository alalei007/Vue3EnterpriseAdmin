<template>
  <div>
    <h2 class="font-semibold text-xl mb-2">控制台总览</h2>
    <p class="text-sm text-gray-400">欢迎使用企业后台管理系统，今天是 {{ today }}</p>
  </div>
  <el-row :gutter="30" justify="space-between">
    <el-col class="my-2" v-bind="{ xs: 24, sm: 12, md: 8 }" v-for="item in cards" :key="item.title">
      <base-card class="w-full" :title="item.title" :value="item.value"></base-card>
    </el-col>
  </el-row>
  <el-row :gutter="20" class="mt-10">
    <el-col :xs="24" :sm="12">
      <el-card class="">
        <template #header>近7日访问趋势</template>
        <div class="h-80">
          <base-line-chart v-bind="lineChartData"></base-line-chart>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="12">
      <el-card class="">
        <template #header>用户角色占比</template>
        <div class="h-80">
          <base-pie-chart v-bind="pieChartData"></base-pie-chart>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20" class="m-4">
    <el-col :xs="24" :sm="12">
      <el-card class="">
        <template #header>商品分类销量</template>
        <div class="h-80">
          <base-bar-chart v-bind="lineChartData"></base-bar-chart>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="12">
      <el-card>
        <template #header>最近操作日志</template>
        <div class="h-80">
          <base-table v-bind="tableData"></base-table>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { getDashboardData } from '@/api/dashboard'
import type { DashboardCard, OperateLogItem, PieItem } from '@/types/dashboard'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import baseCard from '@/components/baseCard.vue'
import { useNowTime } from '@/hooks/useNowTime'
import baseLineChart from '@/components/baseLineChart.vue'
import BasePieChart from '@/components/basePieChart.vue'
import baseBarChart from '@/components/baseBarChart.vue'
import BaseTable from '@/components/baseTable.vue'
defineComponent({
  name: 'AppDashboard',
})

const today = useNowTime().currentTime

const cards = ref<Array<DashboardCard>>([])
const lineChartData = reactive({
  xData: [] as string[],
  seriesData: [] as number[],
})
const pieChartData = reactive({
  data: [] as PieItem[],
})
const barChartData = reactive({
  xData: [] as string[],
  seriesData: [] as number[],
})
const tableData = reactive({
  columns: [
    { label: '操作用户', prop: 'user', width: '120' },
    { label: '操作模块', prop: 'module', width: '130' },
    { label: '操作内容', prop: 'action' },
    { label: '操作时间', prop: 'time', width: '180' },
    { label: '状态', prop: 'status', width: '100' },
  ],
  data: [] as OperateLogItem[],
  total: 0,
  Loading: false,
  currentPage: 1,
  pageSize: 1,
  showPagination: false,
})

onMounted(async () => {
  tableData.Loading = true
  const res = await getDashboardData()
  const data = res.data
  cards.value = data.cards
  lineChartData.xData = data.lineData.dateList
  lineChartData.seriesData = data.lineData.valueList
  pieChartData.data = data.pieData
  barChartData.xData = data.barData.categoryList
  barChartData.seriesData = data.barData.salesList
  tableData.data = data.logs
})
</script>
