<script setup lang="ts">
import { liveQuery } from 'dexie';
import { catchError, from, map, of } from 'rxjs';
import { useObservable } from '@vueuse/rxjs';
import { ChartDisplay, DisplayFinanceEntries } from '#components';
import { useDatabase } from '#imports';
import type { FinanceEntry } from '~/src/types/FinanceEntry';

const test = useDatabase();
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

const handleToggle = async ({ id }: { id: number }) => {
  await test.toggle(id);
};

const handleRemove = async ({ id }: { id: number }) => {
  await test.delete(id);
};

const processedData = computed(() => {
  return (data$.value.data ?? []).toSorted(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
});
</script>

<template>
  <main class="container mx-auto flex flex-col">
    <h1 class="text-4xl font-bold my-12">Finance Tracker</h1>
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
    <div class="mt-4">
      <ChartDisplay :data="processedData.filter(({ enabled }) => enabled)" />
    </div>
  </main>
</template>
