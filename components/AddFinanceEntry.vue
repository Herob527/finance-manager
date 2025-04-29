<script setup lang="ts">
import {
  UCalendar,
  UForm,
  UFormField,
  UInput,
  UInputNumber,
  USelect,
} from '#components';
import { CalendarDate } from '@internationalized/date';
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';
import { type } from 'arktype';
import { shallowReactive } from 'vue';
import { CATEGORIES } from '~/src/constants';

const emit = defineEmits<{
  (e: 'submit', data: Schema): void;
}>();

const schema = type({
  amount: type.number.configure({
    message: (ctx) => {
      return ctx.code === 'domain' ? 'Amount is required' : '';
    },
  }),
  description: type.string
    .moreThanLength(3)
    .or('undefined')
    .or(type.string.atMostLength(0)),
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
  state.amount = undefined;
  state.category = undefined;
  state.description = undefined;
};

const items = ref<TabsItem[]>([
  {
    label: 'Occurrence',
    icon: 'i-lucide-user',
  },
  {
    label: 'Series',
    icon: 'i-lucide-lock',
  },
]);
</script>

<template>
  <section>
    <UTabs :items="items" class="w-full" />
    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-row gap-4 border-primary-500 border-2 p-4 rounded-2xl h-min"
      @submit="handleSubmit"
    >
      <div class="flex flex-col gap-4">
        <span class="font-bold text-2xl mb-4"> Fill the data </span>
        <UFormField label="Amount" name="amount">
          <UInputNumber
            v-model="state.amount"
            :step="0.01"
            :step-snapping="false"
          />
        </UFormField>

        <UFormField label="Description" name="description">
          <UInput v-model="state.description" />
        </UFormField>

        <UFormField label="Category" name="category">
          <USelect v-model="state.category" :items="CATEGORIES" class="w-48" />
        </UFormField>

        <UButton type="submit" class="inline-flex w-min"> Submit </UButton>
      </div>
      <div class="flex flex-col items-center justify-center">
        <UFormField name="date">
          <UCalendar v-model="state.date" month-controls :week-starts-on="1" />
        </UFormField>
      </div>
    </UForm>
  </section>
</template>
