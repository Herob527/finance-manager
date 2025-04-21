<script setup lang="ts">
import type { FinanceEntry } from '../src/types/FinanceEntry';
import UButton from '@nuxt/ui/components/Button.vue';
import UTable from '@nuxt/ui/components/Table.vue';

const props = defineProps<{ data: FinanceEntry[] }>();

defineEmits<{
  (event: 'delete', id: number);
}>();
</script>
<template>
  <UTable :data="props.data" />
</template>
