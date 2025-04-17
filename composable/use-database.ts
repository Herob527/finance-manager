import { useNuxtApp } from 'nuxt/app';
import type { IFinanceService } from '../src/schemas/FinanceEntry';

export const useDatabase = () => {
  const { $storage } = useNuxtApp();
  return $storage as IFinanceService;
};
