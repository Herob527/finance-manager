<script setup lang="ts">
import { getLocalTimeZone } from '@internationalized/date';
import { AddFinanceEntry } from '#components';
import type { Schema } from '~/components/AddFinanceEntry.vue';
import { useDatabase } from '#imports';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { from, map, catchError, of } from 'rxjs';
import type { FinanceEntry } from '~/src/types/FinanceEntry';

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

function createDataState<T>() {
  return {
    data: [] as T,
    isLoading: true,
    error: null as unknown | null,
  };
}
const data$ = useObservable(
  from(liveQuery(async () => await test.getAll())).pipe(
    map((result) => ({
      data: result,
      isLoading: false,
      error: null,
    })),
    catchError((error) =>
      of({
        data: [],
        isLoading: false,
        error,
      }),
    ),
  ),
  {
    initialValue: createDataState<FinanceEntry[]>(),
  },
);

const processedData = computed(() => {
  return (data$.value.data ?? []).toSorted(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
});

const handleToggle = async ({ id }: { id: number }) => {
  await test.toggle(id);
};

const handleRemove = async ({ id }: { id: number }) => {
  await test.delete(id);
};
</script>

<template>
  <main class="container mx-auto flex flex-col">
    <h1 class="text-4xl font-bold my-12">Finance Tracker</h1>
    <div class="flex flex-row gap-4">
      <AddFinanceEntry @submit="handleSubmit" />
      <DisplayFinanceEntries
        :class="[
          'border-2',
          {
            'border-primary-500': !data$.error,
            'border-error-500': !!data$.error,
          },
          'rounded-2xl',
        ]"
        :data="processedData"
        :loading="data$.isLoading"
        :error="!!data$.error"
        @toggle="(id) => handleToggle({ id })"
        @delete="(id) => handleRemove({ id })"
      />
    </div>
  </main>
</template>
