<script setup lang="ts">
import { UButton, UCheckbox, UTable } from '#components';
import {
  getPaginationRowModel,
  type PaginationState,
} from '@tanstack/vue-table';
import type { TableColumn } from '@nuxt/ui';
import { computed, h } from 'vue';
import { CATEGORIES } from '~/src/constants';
import type { FinanceEntry } from '~/src/types/FinanceEntry';

defineProps<{
  data: FinanceEntry[];
  loading: boolean;
  error: boolean;
}>();

const emit = defineEmits<{
  (event: 'toggle' | 'delete', id: number): void;
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
const table = useTemplateRef('table');

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
});
</script>
<template>
  <div class="flex flex-col">
    <UTable
      ref="table"
      v-model:pagination="pagination"
      :data="error ? [] : data"
      :empty="error ? 'Error loading data' : 'No data yet'"
      :columns="columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      :loading="loading || error"
      :loading-color="error ? 'error' : 'primary'"
    />
    <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        :default-page="
          (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
        "
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>
