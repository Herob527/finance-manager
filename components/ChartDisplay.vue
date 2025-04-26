<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type VNodeRef } from 'vue';
import type { FinanceEntry } from '../src/types/FinanceEntry';
import { Chart } from 'chart.js/auto';

const props = defineProps<{ data: FinanceEntry[] }>();

const chartContainer = ref<VNodeRef | null>(null);

let chartInstance: Chart | undefined;

// Suggested by claude
function groupByItems<T, K extends PropertyKey>(
  items: Iterable<T>,
  keySelector: (item: T) => K,
): Record<K, T[]> {
  // @ts-expect-error - Using native Object.groupBy but ignoring TypeScript errors
  return Object.groupBy(items, keySelector);
}

const processData = (data = props.data) => {
  const formatter = new Intl.DateTimeFormat('en-AU', {
    month: 'long',
  });
  const groupedData = groupByItems(
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
      value.reduce((acc, cur) => {
        currentSum += acc + cur.amount;
        return currentSum;
      }, 0),
    ),
  };
};

// Watch for data changes
watch(
  () => props.data,
  (newData, oldData) => {
    if (chartInstance) {
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
  if (chartContainer.value === null) return;
  const { keys, values } = processData();
  chartInstance = new Chart(chartContainer.value, {
    type: 'bar',

    data: {
      labels: keys,
      datasets: [
        {
          data: values,
        },
      ],
    },
  });
});
</script>
<template>
  <canvas ref="chartContainer" />
</template>
