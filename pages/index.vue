<script setup lang="ts">
import { liveQuery } from 'dexie';
import AddFinanceEntry, {
  type Schema,
} from '../components/AddFinanceEntry.vue';
import { useDatabase } from '../composable/use-database';
import { from } from 'rxjs';
import { useObservable } from '@vueuse/rxjs';
import { today, getLocalTimeZone } from '@internationalized/date';

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
    enabled: false,
  });
};
</script>

<template>
  <main class="container mx-auto flex flex-col">
    <div class="flex flex-row gap-4 mt-4">
      <AddFinanceEntry @submit="handleSubmit" />
      <div>
        <template v-if="data && data?.length > 0">
          <span v-for="entry in data ?? []" :key="entry.id">
            {{ entry.category }}
          </span>
        </template>
        <span v-else> No data yet </span>
      </div>
    </div>
  </main>
</template>
