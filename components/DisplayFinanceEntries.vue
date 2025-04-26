<script setup lang="ts">
import { computed, h } from 'vue';
import type { FinanceEntry } from '../src/types/FinanceEntry';
import UTable, { type TableColumn } from '@nuxt/ui/components/Table.vue';
import UCheckbox from '@nuxt/ui/components/Checkbox.vue';
import UButton from '@nuxt/ui/components/Button.vue';
import { CATEGORIES } from '../src/constants';

const props = defineProps<{ data: FinanceEntry[] }>();

const emit = defineEmits<{
  (event: 'toggle' | 'delete', id: number);
}>();

const columns = computed(
  () =>
    [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) =>
          Intl.DateTimeFormat('pl-PL').format(
            row.getValue<Date | undefined>('date'),
          ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) =>
          Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
          }).format(row.getValue('amount')),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) =>
          CATEGORIES.find((c) => c.value === row.getValue('category'))?.label ??
          '',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => row.getValue<string>('description'),
      },
      {
        accessorKey: 'enabled',
        header: 'Enabled',
        cell: ({ row }) =>
          h(UCheckbox, {
            defaultValue: row.getValue<boolean>('enabled'),
            update: () => {
              console.log('test');
            },
            onChange: () => {
              emit('toggle', row.getValue('id'));
            },
          }),
      },
      {
        accessorKey: 'id',
        header: 'Delete',
        cell: ({ row }) =>
          h(
            UButton,
            {
              color: 'error',
              onClick: () => emit('delete', row.getValue('id')),
            },
            'Delete',
          ),
      },
    ] as const satisfies TableColumn<FinanceEntry>[],
);
</script>
<template>
  <UTable :data="props.data" :columns="columns" />
</template>
