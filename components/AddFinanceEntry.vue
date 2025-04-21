<script setup lang="ts">
import { type } from 'arktype';
import { shallowReactive } from 'vue';
import UForm from '@nuxt/ui/components/Form.vue';
import UFormField from '@nuxt/ui/components/FormField.vue';
import UCalendar from '@nuxt/ui/components/Calendar.vue';
import type { FormSubmitEvent } from '@nuxt/ui';
import { CalendarDate } from '@internationalized/date';

const emit = defineEmits<{
  (e: 'submit', data: Schema): void;
}>();

const CATEGORIES = (
  ['Groceries', 'Utilities', 'Entertainment', 'Other', 'Job'] as const
).map((c) => ({ value: c.toLowerCase() as Lowercase<typeof c>, label: c }));

const schema = type({
  amount: type.number.configure({
    message: (ctx) => {
      return ctx.code === 'domain' ? 'Amount is required' : '';
    },
  }),
  description: type.string.moreThanLength(3).or('undefined'),
  category: type.enumerated(...CATEGORIES.map((c) => c.value)).configure({
    message: (ctx) =>
      ctx.code === 'predicate' ? 'Category must be picked' : '',
  }),
  date: type.instanceOf(CalendarDate).configure({
    message: (ctx) => (ctx.code === 'proto' ? 'Date is required' : ''),
  }),
});
export type Schema = typeof schema.infer;

const state = shallowReactive<Partial<Schema>>({
  date: undefined,
  amount: undefined,
  category: undefined,
  description: undefined,
});

const handleSubmit = (ev: FormSubmitEvent<Schema>) => {
  emit('submit', ev.data);
};
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4 border-primary-500 border-2 p-2 rounded-2xl"
    @submit="handleSubmit"
  >
    <span class="font-bold text-2xl mb-4"> Fill the data </span>
    <UFormField label="Amount" name="amount">
      <UInputNumber v-model="state.amount" />
    </UFormField>

    <UFormField label="Description" name="description">
      <UInput v-model="state.description" />
    </UFormField>

    <UFormField label="Category" name="category">
      <USelect v-model="state.category" :items="CATEGORIES" class="w-48" />
    </UFormField>

    <UFormField label="Date" name="date">
      <UCalendar v-model="state.date" />
    </UFormField>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
