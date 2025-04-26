<script setup lang="ts">
import { onMounted, ref, type VNodeRef } from 'vue';
import type { FinanceEntry } from '../src/types/FinanceEntry';
import { Chart } from 'chart.js/auto';

const props = defineProps<{ data: FinanceEntry[] }>();

const chartContainer = ref<VNodeRef | null>(null);

const chartInstance = ref();

onMounted(() => {
  console.log(chartContainer.value);
  chartInstance.value = new Chart(chartContainer.value, {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          data: [40, 20, 12],
        },
      ],
    },
  });
});
</script>
<template>
  <canvas ref="chartContainer" />
</template>
