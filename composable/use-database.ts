import { useNuxtApp } from 'nuxt/app';
import type { IFinanceService } from '../src/types/FinanceEntry';

export const useDatabase = () => {
  const { $storage } = useNuxtApp();
  return $storage as IFinanceService;
};
