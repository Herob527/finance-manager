<script setup lang="ts">
import AddFinanceEntry from '../components/AddFinanceEntry.vue';
import { useDatabase } from '../composable/use-database';

const test = useDatabase();
</script>

<template>
  <main class="container mx-auto flex flex-col">
    <span class="text-3xl">Test</span>
    <AddFinanceEntry />
  </main>
</template>
