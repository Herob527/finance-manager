<script setup lang="ts">
import { UBadge } from '#components';
import { Chart } from 'chart.js/auto';
import { onMounted, onUnmounted, ref, watch, type VNodeRef } from 'vue';
import type { FinanceEntry } from '~/src/types/FinanceEntry';
import cssVar from '~/utils/cssVar';

const props = defineProps<{
  data: FinanceEntry[];
  loading: boolean;
  error: boolean;
}>();

const chartContainer = ref<VNodeRef | null>(null);

let chartInstance: Chart | undefined;

const processData = (data = props.data) => {
  const formatter = new Intl.DateTimeFormat('en-AU', {
    month: 'long',
  });
  const groupedData = Object.groupBy(
    data.map((entry) => ({
      ...entry,
      amount: entry.amount,
      _date: `${formatter.format(entry.date)} ${entry.date.getFullYear()}`,
    })),
    (value) => value._date,
  );
  let currentSum = -500;
  return {
    keys: Object.keys(groupedData),
    values: Object.values(groupedData).map((value) =>
      (value ?? []).reduce((_acc, cur) => {
        currentSum += cur.amount;
        return currentSum;
      }, 0),
    ),
  };
};

// Watch for data changes
watch(
  () => props.data,
  (newData) => {
    if (chartInstance && !props.error) {
      chartInstance.data.labels = processData(newData).keys;
      chartInstance.data.datasets[0].data = processData(newData).values;
      chartInstance.update();
    }
  },
  { deep: true },
);

onUnmounted(() => {
  if (chartInstance === undefined) return;
  chartInstance.destroy();
  chartInstance = undefined;
});

onMounted(() => {
  if (chartContainer.value === null || props.error) return;
  const { keys, values } = processData();
  chartInstance = new Chart(chartContainer.value, {
    type: 'bar',
    data: {
      labels: keys,
      datasets: [
        {
          label: 'Balance',
          data: values,
          backgroundColor: cssVar('--color-primary-500'),
          borderColor: cssVar('--color-primary-600'),
          borderWidth: 1,
        },
      ],
    },
  });
});
</script>
<template>
  <span v-if="loading">Loading data for chart...</span>
  <UBadge
    v-else-if="error"
    size="xl"
    color="error"
    label="Error loading data for chart"
  />
  <canvas ref="chartContainer" />
</template>
