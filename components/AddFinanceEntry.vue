<script setup lang="ts">
import {
  UCalendar,
  UForm,
  UFormField,
  UInput,
  UInputNumber,
  USelect,
} from '#components';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import type { FormSubmitEvent } from '@nuxt/ui';
import { type } from 'arktype';
import { shallowReactive } from 'vue';
import { CATEGORIES, SERIES_TYPES, type AddMode } from '~/src/constants';

const emit = defineEmits<{
  (e: 'submit', data: Schema): void;
}>();

const props = defineProps<{ mode: AddMode }>();

const schema = computed(() =>
  type({
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
    seriesType:
      props.mode === 'series'
        ? type.enumerated(...SERIES_TYPES.map((c) => c.value)).configure({
            message: 'Series type is required',
          })
        : type.undefined,
    untilDate:
      props.mode === 'series'
        ? type.instanceOf(CalendarDate).configure({
            message: (ctx) => (ctx.code === 'proto' ? 'Date is required' : ''),
          })
        : type.undefined,
  }),
);

export type Schema = typeof schema.value.infer;

const state = shallowReactive<Partial<Schema>>({
  date: undefined,
  amount: undefined,
  category: undefined,
  description: undefined,
  seriesType: undefined,
  untilDate: undefined,
});

const handleSubmit = (ev: FormSubmitEvent<Schema>) => {
  emit('submit', ev.data);
  state.amount = undefined;
  state.category = undefined;
  state.description = undefined;
  state.seriesType = undefined;
  state.untilDate = undefined;
};

const form = useTemplateRef('form');

watch(
  () => state,
  (selection) => console.log(selection),
);

watch(
  () => props.mode,
  () => {
    state.date = undefined;
    state.amount = undefined;
    state.category = undefined;
    state.description = undefined;
    state.seriesType = undefined;
    state.untilDate = undefined;
    form.value?.clear();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="flex flex-row gap-4 border-primary-500 border-2 p-4 rounded-2xl h-min"
    @submit="handleSubmit"
  >
    <div class="flex flex-col gap-4">
      <span class="font-bold text-2xl mb-4"> Fill the data </span>
      <UFormField label="Amount" name="amount">
        <UInputNumber
          :value="state.amount"
          :step="0.01"
          :step-snapping="false"
          @input="state.amount = Number($event.target.value)"
        />
      </UFormField>

      <UFormField label="Description" name="description">
        <UInput v-model="state.description" />
      </UFormField>

      <UFormField label="Category" name="category">
        <USelect v-model="state.category" :items="CATEGORIES" class="w-48" />
      </UFormField>

      <UFormField
        label="Series type"
        name="seriesType"
        :class="{ hidden: mode !== 'series' }"
      >
        <URadioGroup v-model="state.seriesType" :items="SERIES_TYPES" />
      </UFormField>
      <UFormField
        label="Until date"
        name="untilDate"
        :class="{ hidden: mode !== 'series' }"
      >
        <UPopover>
          <UButton
            :label="
              state.untilDate
                ? Intl.DateTimeFormat('pl-PL', {}).format(
                    state.untilDate.toDate(getLocalTimeZone()),
                  )
                : 'Open'
            "
            color="neutral"
            class="w-full"
            variant="subtle"
          />
          <template #content>
            <UCalendar
              v-model="state.untilDate"
              month-controls
              :week-starts-on="1"
            />
          </template>
        </UPopover>
      </UFormField>

      <UButton type="submit" class="inline-flex w-min"> Submit </UButton>
    </div>
    <div class="flex flex-col items-center justify-center">
      <UFormField name="date">
        <UCalendar v-model="state.date" month-controls :week-starts-on="1" />
      </UFormField>
    </div>
  </UForm>
</template>
