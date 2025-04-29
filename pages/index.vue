<script setup lang="ts">
import { ULink } from '#components';
</script>

<template>
  <main class="w-full flex flex-row flex-wrap h-screen">
    <ULink
      to="/add-data"
      class="flex-1 bg-neutral-500 text-center text-white h-full flex items-center justify-center text-5xl uppercase font-bold text-shadow-lg hover:bg-neutral-600 group"
      ><span
        class="group-hover:tracking-widest transition-[letter-spacing] duration-500"
        >Add</span
      >
    </ULink>
    <ULink
      to="/display-data"
      class="flex-1 bg-primary-500 text-center text-white h-full flex items-center justify-center text-5xl uppercase font-bold hover:bg-primary-600 group"
    >
      <span
        class="group-hover:tracking-widest transition-[letter-spacing] duration-500"
        >Display</span
      >
    </ULink>
  </main>
</template>
