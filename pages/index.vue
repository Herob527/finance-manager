<script setup lang="ts">
import AddFinanceEntry from '../components/AddFinanceEntry.vue';
import { useDatabase } from '../composable/use-database';

const test = useDatabase();
</script>

<template>
  <span class="text-3xl">Test</span>
  <AddFinanceEntry />
</template>
