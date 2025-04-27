<script setup lang="ts">
import { NuxtPage, UApp, UNavigationMenu } from '#components';
import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Main',
    icon: 'i-lucide-book-open',
    to: '/',
  },
  {
    label: 'Add',
    icon: 'i-lucide-plus',
    to: '/add-data',
  },
  {
    label: 'Display',
    icon: 'i-lucide-box',
    to: '/display-data',
  },
]);
</script>

<template>
  <UNavigationMenu
    :items="items"
    class="w-full justify-center p-4 sticky top-0 bg-neutral-900/50 z-10 backdrop-blur-md border-b-2 border-neutral-800"
  />
  <UApp>
    <NuxtPage />
  </UApp>
</template>
