import { defineNuxtPlugin } from 'nuxt/app';
import LoggingStorage from '~/src/services/DummyFinanceService';
import IndexedDBStorage from '~/src/services/LocalDatabase';

export default defineNuxtPlugin({
  name: 'db-service-provider',
  setup(nuxtApp) {
    const StorageClass = import.meta.server ? LoggingStorage : IndexedDBStorage;
    nuxtApp.provide('storage', new StorageClass());
  },
});
