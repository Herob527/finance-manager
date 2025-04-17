<script setup lang="ts">
import AddFinanceEntry from '../components/AddFinanceEntry.vue';
import { useDatabase } from '../composable/use-database';

const test = useDatabase();
</script>

<template>
  <span>Test</span>
  <AddFinanceEntry />
</template>
