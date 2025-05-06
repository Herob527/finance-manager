<script setup lang="ts">
import { getLocalTimeZone } from '@internationalized/date';
import { AddFinanceEntry } from '#components';
import type { Schema } from '~/components/AddFinanceEntry.vue';
import { useDatabase } from '#imports';
import { useObservable } from '@vueuse/rxjs';
import type { FinanceEntry } from '~/src/types/FinanceEntry';
import type { TabsItem } from '@nuxt/ui';
import type { AddMode } from '~/src/constants';

const dbInstance = useDatabase();

const handleSubmit = async (data: Schema['inferOut']) => {
  if (data.untilDate !== undefined) {
    dbInstance.addSeries(
      {
        date: data.date.toDate(getLocalTimeZone()),
        description: data.description,
        amount: data.amount,
        category: data.category,
        enabled: true,
      },
      { end: data.untilDate.toDate(getLocalTimeZone()) },
    );
  } else {
    dbInstance.add([
      {
        date: data.date.toDate(getLocalTimeZone()),
        description: data.description,
        amount: data.amount,
        category: data.category,
        enabled: true,
      },
    ]);
  }
};

function createDataState<T>() {
  return {
    data: [] as T,
    isLoading: true,
    error: null as unknown | null,
  };
}
const data$ = useObservable(dbInstance.observe(), {
  initialValue: createDataState<FinanceEntry[]>(),
});

const processedData = computed(() => {
  return data$.value.data ?? [];
});

const handleToggle = async ({ id }: { id: number }) => {
  await dbInstance.toggle(id);
};

const handleRemove = async ({ id }: { id: number }) => {
  await dbInstance.delete(id);
};

const items = ref<TabsItem[]>([
  {
    label: 'Occurrence',
    icon: 'i-lucide-user',
    value: 'occurrence',
  },
  {
    label: 'Series',
    icon: 'i-lucide-lock',
    value: 'series',
  },
]);

const addMode = ref<AddMode>('occurrence');
</script>

<template>
  <main class="container mx-auto flex flex-col mb-4">
    <h1 class="text-4xl font-bold my-12">Finance Tracker</h1>
    <div class="flex flex-row gap-4">
      <div>
        <UTabs v-model="addMode" :items="items" class="w-full" />
        <AddFinanceEntry :mode="addMode" @submit="handleSubmit" />
      </div>
      <DisplayFinanceEntries
        :hidden-keys="['enabled']"
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
