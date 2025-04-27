<script setup lang="ts">
import { getLocalTimeZone } from '@internationalized/date';
import { AddFinanceEntry } from '#components';
import type { Schema } from '~/components/AddFinanceEntry.vue';
import { useDatabase } from '#imports';

const test = useDatabase();

const handleSubmit = (data: Schema) => {
  test.add({
    date: data.date.toDate(getLocalTimeZone()),
    description: data.description,
    amount: data.amount,
    category: data.category,
    enabled: true,
  });
};
</script>

<template>
  <main class="container mx-auto flex flex-col">
    <h1 class="text-4xl font-bold my-12">Finance Tracker</h1>
    <div class="flex flex-row gap-4">
      <AddFinanceEntry @submit="handleSubmit" />
    </div>
  </main>
</template>
