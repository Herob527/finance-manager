<script setup lang="ts">
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { useObservable } from '@vueuse/rxjs';
import { ChartDisplay, DisplayFinanceEntries } from '#components';
import { useDatabase } from '#imports';

const test = useDatabase();

const data = useObservable(
  from(
    liveQuery(async () => {
      return await test.getAll();
    }),
  ),
);

const handleToggle = async ({ id }: { id: number }) => {
  await test.toggle(id);
};

const handleRemove = async ({ id }: { id: number }) => {
  await test.delete(id);
};

const processedData = computed(() => {
  return (data.value ?? []).toSorted(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
});
</script>

<template>
  <main class="container mx-auto flex flex-col">
    <h1 class="text-4xl font-bold my-12">Finance Tracker</h1>
    <template v-if="data && data?.length > 0">
      <DisplayFinanceEntries
        class="border-2 border-primary-500 rounded-2xl"
        :data="processedData"
        @toggle="(id) => handleToggle({ id })"
        @delete="(id) => handleRemove({ id })"
      />
    </template>
    <span v-else> No data yet </span>
    <div class="mt-4">
      <ChartDisplay :data="processedData.filter(({ enabled }) => enabled)" />
    </div>
  </main>
</template>
