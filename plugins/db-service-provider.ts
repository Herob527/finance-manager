import { defineNuxtPlugin } from 'nuxt/app';
import IndexedDBStorage from '../src/services/LocalDatabase';
import LoggingStorage from '../src/services/DummyFinanceService';

export default defineNuxtPlugin({
  name: 'db-service-provider',
  setup(nuxtApp) {
    const StorageClass = import.meta.server ? LoggingStorage : IndexedDBStorage;
    nuxtApp.provide('storage', new StorageClass());
  },
});
