<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="font-semibold text-gray-700">Sales Report</h2>
      <div class="flex items-center space-x-4">
        <select
          v-model="selectedPeriod"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>
    <div class="h-64">
      <Bar
        v-if="selectedPeriod === 'week' || selectedPeriod === 'month'"
        :data="chartData"
        :options="chartOptions"
      />
      <Line
        v-else
        :data="lineChartData"
        :options="chartOptions"
      />
    </div>
    <div class="flex justify-center mt-4 space-x-8">
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-teal-500 mr-2"></span>
        <span class="text-sm text-gray-600">Revenue</span>
      </div>
      <div class="flex items-center">
        <span class="w-3 h-3 rounded-full bg-blue-800 mr-2"></span>
        <span class="text-sm text-gray-600">Ticket</span>
      </div>
    </div>
    <div class="grid grid-cols-3 mt-6 border-t pt-4">
      <div class="text-gray-500">
        <p class="text-xs text-gray-500">Current {{ periodLabel }}</p>
        <p class="font-semibold">{{ currentStats?.value || '0 ₫' }}</p>
      </div>
      <div class="text-gray-500">
        <p class="text-xs text-gray-500">Previous {{ periodLabel }}</p>
        <p class="font-semibold">{{ previousStats?.value || '0 ₫' }}</p>
      </div>
      <div class="text-gray-500">
        <p class="text-xs text-gray-500">Conversion</p>
        <p class="font-semibold">{{ currentStats?.conversion || '0%' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs } from 'vue';
import { Bar, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  statsData: Object,
  weekData: Object,
  monthData: Object,
  quarterData: Object,
  yearData: Object,
});
const { statsData, weekData, monthData, quarterData, yearData } = toRefs(props);

// Period selection
const selectedPeriod = ref('week');

// Computed properties for chart data
const chartData = computed(() => {
  if (selectedPeriod.value === 'week') return weekData.value;
  if (selectedPeriod.value === 'month') return monthData.value;
  return weekData.value; // Fallback
});

const lineChartData = computed(() => {
  if (selectedPeriod.value === 'quarter') return quarterData.value;
  if (selectedPeriod.value === 'year') return yearData.value;
  return quarterData.value; // Fallback
});

// Dynamic y-axis scaling based on data
const chartOptions = computed(() => {
  const currentData = selectedPeriod.value === 'week' || selectedPeriod.value === 'month'
    ? chartData.value
    : lineChartData.value;

  // Find max revenue and ticket values
  const maxRevenue = Math.max(...(currentData.datasets?.[0]?.data || [0]));
  const maxTickets = Math.max(...(currentData.datasets?.[1]?.data || [0]));
  const maxValue = Math.max(maxRevenue, maxTickets * 100000); // Assume avg ticket price ~100,000 VND for scaling

  // Calculate appropriate max and stepSize
  const scaleMax = Math.ceil(maxValue / 100000) * 100000; // Round up to nearest 100,000
  const stepSize = Math.ceil(scaleMax / 5 / 100000) * 100000; // ~5 steps

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: scaleMax > 0 ? scaleMax : 1000000, // Default max if no data
        ticks: {
          stepSize: stepSize > 0 ? stepSize : 200000, // Default step if no data
          callback: (value) => {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
            }).format(value);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
});

// Computed properties for display values
const periodLabel = computed(() => {
  return selectedPeriod.value.charAt(0).toUpperCase() + selectedPeriod.value.slice(1);
});

const currentStats = computed(() => {
  return statsData.value?.[selectedPeriod.value]?.current || {};
});

const previousStats = computed(() => {
  return statsData.value?.[selectedPeriod.value]?.previous || {};
});
</script>
