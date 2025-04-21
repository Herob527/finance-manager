<script setup lang="ts">
const CATEGORIES = [
  'Groceries',
  'Utilities',
  'Entertainment',
  'Other',
  'Job',
].map((c) => ({ value: c.toLowerCase(), label: c }));
</script>

<template>
  <UForm class="space-y-4">
    <UFormField label="Amount" name="amount">
      <UInputNumber />
    </UFormField>

    <UFormField label="Description" name="description">
      <UInput />
    </UFormField>

    <UFormField label="Category" name="category">
      <USelect :items="CATEGORIES" class="w-48" />
    </UFormField>

    <UFormField label="Date" name="date">
      <UCalendar />
    </UFormField>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
