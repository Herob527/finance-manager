<script setup lang="ts">
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { useObservable } from '@vueuse/rxjs';
import { getLocalTimeZone } from '@internationalized/date';
import {
  AddFinanceEntry,
  ChartDisplay,
  DisplayFinanceEntries,
} from '#components';
import type { Schema } from '~/components/AddFinanceEntry.vue';
import { useDatabase } from '~/composable/use-database';

const test = useDatabase();

const data = useObservable(
  from(
    liveQuery(async () => {
      return await test.getAll();
    }),
  ),
);

const handleSubmit = (data: Schema) => {
  test.add({
    date: data.date.toDate(getLocalTimeZone()),
    description: data.description,
    amount: data.amount,
    category: data.category,
    enabled: true,
  });
};

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
    <div class="flex flex-row gap-4 mt-4">
      <AddFinanceEntry @submit="handleSubmit" />
      <div class="flex-1">
        <template v-if="data && data?.length > 0">
          <DisplayFinanceEntries
            class="border-2 border-primary-500 rounded-2xl"
            :data="
              [...data].sort((a, b) => a.date.getTime() - b.date.getTime())
            "
            @toggle="(id) => handleToggle({ id })"
            @delete="(id) => handleRemove({ id })"
          />
        </template>
        <span v-else> No data yet </span>
      </div>
    </div>
    <div class="mt-4">
      <ChartDisplay
        :data="
          [...(data ?? [])].sort((a, b) => a.date.getTime() - b.date.getTime())
        "
      />
    </div>
  </main>
</template>
